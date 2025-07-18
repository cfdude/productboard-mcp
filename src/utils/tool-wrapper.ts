/**
 * Context wrapper pattern for eliminating code duplication
 * Based on Jira MCP server analysis
 */
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { loadConfig, getInstance, getWorkspace } from '../config.js';
import {
  MultiInstanceProductboardConfig,
  ProductboardInstanceConfig,
} from '../types.js';
import axios, { AxiosInstance } from 'axios';
import {
  AuthenticationError,
  NetworkError,
  RateLimitError,
  sanitizeErrorMessage,
} from '../errors/index.js';

export interface ToolContext {
  config: MultiInstanceProductboardConfig;
  instance: ProductboardInstanceConfig;
  workspaceId?: string;
  axios: AxiosInstance;
}

/**
 * Create tool context with configuration and HTTP client
 */
export function createToolContext(
  instanceName?: string,
  workspaceId?: string
): ToolContext {
  try {
    const config = loadConfig();
    const instance = getInstance(config, instanceName);

    // If workspace is provided, validate it exists
    if (workspaceId) {
      getWorkspace(config, workspaceId);
    }

    // Create configured axios instance
    const axiosInstance = axios.create({
      baseURL: instance.baseUrl || 'https://api.productboard.com',
      headers: {
        Authorization: `Bearer ${instance.apiToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json; charset=utf-8',
        'X-Version': '1',
      },
      timeout: 30000,
    });

    // Add request interceptor for rate limiting
    axiosInstance.interceptors.request.use(config => {
      // Add workspace context if available
      if (workspaceId) {
        config.headers = config.headers || {};
        config.headers['X-Workspace-Id'] = workspaceId;
      }
      return config;
    });

    // Add response interceptor for error handling FIRST (so it runs last due to LIFO)
    axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          const status = error.response.status;
          const retryAfter = error.response.headers?.['retry-after'];
          const data = error.response.data;

          if (status === 401) {
            throw new AuthenticationError();
          } else if (status === 403) {
            throw new McpError(ErrorCode.InvalidRequest, 'Access denied');
          } else if (status === 404) {
            throw new McpError(ErrorCode.InvalidRequest, 'Resource not found');
          } else if (status === 409) {
            // Handle specific 409 conflict errors with detailed messages
            let message = 'Conflict error';
            if (data?.errors) {
              const errors = data.errors;
              if (errors.user) {
                message =
                  'User conflict: email/external ID mismatch or company domain conflict';
              } else if (errors.company) {
                message = 'Company conflict: domain does not match external ID';
              }
            }
            throw new McpError(ErrorCode.InvalidRequest, message);
          } else if (status === 422) {
            // Handle specific 422 validation errors with detailed messages
            let message = 'Validation error';
            if (data?.errors) {
              const errors = data.errors;
              if (errors.source) {
                message = 'Source already exists';
              } else if (errors.display_url) {
                message = 'Invalid URL format for display_url';
              } else if (errors.user && errors.company) {
                message =
                  'Cannot specify both user.email and company.domain together';
              } else if (errors.owner) {
                message = 'Owner user does not exist';
              } else if (errors.company?.id) {
                message =
                  'Company does not exist or cannot set both company ID and domain';
              }
            }
            throw new McpError(ErrorCode.InvalidRequest, message);
          } else if (status === 429) {
            throw new RateLimitError(
              retryAfter ? parseInt(retryAfter) : undefined
            );
          } else if (status >= 500) {
            throw new NetworkError('Server error', error);
          }

          throw new McpError(
            ErrorCode.InvalidRequest,
            sanitizeErrorMessage(error)
          );
        }

        throw new NetworkError('Network error', error);
      }
    );

    const context: ToolContext = {
      config,
      instance,
      axios: axiosInstance,
    };

    if (workspaceId) {
      context.workspaceId = workspaceId;
    }

    return context;
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(
      ErrorCode.InternalError,
      `Configuration error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Wrapper function to handle common tool patterns
 */
export async function withContext<T>(
  handler: (context: ToolContext) => Promise<T>,
  instanceName?: string,
  workspaceId?: string
): Promise<T> {
  const context = createToolContext(instanceName, workspaceId);
  return await handler(context);
}

/**
 * Helper to format API responses consistently
 */
export function formatResponse(data: any, includeRaw?: boolean) {
  if (includeRaw) {
    return {
      formatted: JSON.stringify(data, null, 2),
      raw: data,
    };
  }
  return JSON.stringify(data, null, 2);
}

/**
 * Helper to handle pagination
 */
export async function handlePagination<T>(
  context: ToolContext,
  endpoint: string,
  params: Record<string, any> = {},
  maxPages: number = 10
): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= maxPages) {
    const response = await context.axios.get(endpoint, {
      params: { ...params, page, pageLimit: 100 },
    });

    const data = response.data;
    if (data.data && Array.isArray(data.data)) {
      results.push(...data.data);
    }

    hasMore = !!data.pageCursor;
    if (hasMore) {
      params.pageCursor = data.pageCursor;
    }
    page++;
  }

  return results;
}
