/**
 * Context wrapper pattern for eliminating code duplication
 * Based on Jira MCP server analysis
 */
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig, getInstance, getWorkspace } from "../config.js";
import {
  MultiInstanceProductboardConfig,
  ProductboardInstanceConfig,
} from "../types.js";
import axios, { AxiosInstance } from "axios";
import {
  AuthenticationError,
  NetworkError,
  RateLimitError,
  ConfigurationError,
  sanitizeErrorMessage,
} from "../errors/index.js";
import { withRetry, CircuitBreaker } from "./retry.js";
import { validateRequestSize } from "./validation.js";

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
  workspaceId?: string,
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
      baseURL: instance.baseUrl || "https://api.productboard.com",
      headers: {
        Authorization: `Bearer ${instance.apiToken}`,
        "Content-Type": "application/json",
        "X-Version": "1",
      },
      timeout: 30000,
    });

    // Add request interceptor for rate limiting
    axiosInstance.interceptors.request.use((config) => {
      // Add workspace context if available
      if (workspaceId) {
        config.headers = config.headers || {};
        config.headers["X-Workspace-Id"] = workspaceId;
      }
      return config;
    });

    // Add response interceptor for error handling
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const status = error.response.status;
          const retryAfter = error.response.headers?.["retry-after"];

          if (status === 401) {
            throw new AuthenticationError();
          } else if (status === 403) {
            throw new McpError(
              ErrorCode.InvalidRequest,
              "Access denied"
            );
          } else if (status === 404) {
            throw new McpError(ErrorCode.InvalidRequest, "Resource not found");
          } else if (status === 429) {
            throw new RateLimitError(
              retryAfter ? parseInt(retryAfter) : undefined
            );
          } else if (status >= 500) {
            throw new NetworkError("Server error", error);
          }

          throw new McpError(
            ErrorCode.InvalidRequest,
            sanitizeErrorMessage(error)
          );
        }

        throw new NetworkError("Network error", error);
      },
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
      `Configuration error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Wrapper function to handle common tool patterns
 */
export async function withContext<T>(
  handler: (context: ToolContext) => Promise<T>,
  instanceName?: string,
  workspaceId?: string,
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
  maxPages: number = 10,
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
