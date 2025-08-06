/**
 * API client factory for ProductBoard MCP Server
 * Creates isolated HTTP clients per session to prevent conflicts
 */

import axios from 'axios';
import { SessionConfig } from './session-config.js';
import { debugLog } from './debug-logger.js';
import {
  AuthenticationError,
  NetworkError,
  RateLimitError,
  sanitizeErrorMessage,
} from '../errors/index.js';

export interface ApiClient {
  get: (url: string, config?: any) => Promise<any>;
  post: (url: string, data?: any, config?: any) => Promise<any>;
  put: (url: string, data?: any, config?: any) => Promise<any>;
  patch: (url: string, data?: any, config?: any) => Promise<any>;
  delete: (url: string, config?: any) => Promise<any>;
  request: (config: any) => Promise<any>;
}

/**
 * Create a ProductBoard API client instance with session-specific configuration
 */
export function createProductBoardApiClient(config: SessionConfig): ApiClient {
  const axiosInstance = axios.create({
    baseURL: config.baseUrl,
    timeout: config.timeouts?.request || 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(config.apiToken && {
        Authorization: `Bearer ${config.apiToken}`,
        'X-Version': '1',
      }),
    },
  });

  // Add request interceptor for logging and rate limiting
  axiosInstance.interceptors.request.use(
    requestConfig => {
      debugLog('api-client', 'HTTP request started', {
        method: requestConfig.method?.toUpperCase(),
        url: requestConfig.url,
        baseURL: requestConfig.baseURL,
        timeout: requestConfig.timeout,
      });

      return requestConfig;
    },
    error => {
      debugLog('api-client', 'HTTP request setup failed', {
        error: error.message,
      });
      return Promise.reject(error);
    }
  );

  // Add response interceptor for logging and error handling
  axiosInstance.interceptors.response.use(
    response => {
      debugLog('api-client', 'HTTP response received', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        responseTime: response.headers['x-response-time'] || 'unknown',
      });

      return response;
    },
    error => {
      // Enhanced error handling with ProductBoard-specific logic
      const errorResponse = error.response;
      const errorMessage = sanitizeErrorMessage(error.message);

      debugLog('api-client', 'HTTP response failed', {
        status: errorResponse?.status,
        statusText: errorResponse?.statusText,
        url: error.config?.url,
        error: errorMessage,
        responseData: errorResponse?.data,
      });

      // Convert HTTP errors to appropriate ProductBoard errors
      if (errorResponse) {
        switch (errorResponse.status) {
          case 401:
            throw new AuthenticationError(
              'Authentication failed - check your API token'
            );
          case 429:
            throw new RateLimitError();
          case 500:
          case 502:
          case 503:
          case 504:
            throw new NetworkError(
              `ProductBoard server error (${errorResponse.status}): ${errorMessage}`,
              error
            );
          default:
            return Promise.reject(error);
        }
      }

      // Network errors (no response)
      if (error.code === 'ECONNABORTED') {
        throw new NetworkError(
          'Request timeout - ProductBoard API may be slow',
          error
        );
      }

      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new NetworkError('Unable to connect to ProductBoard API', error);
      }

      return Promise.reject(error);
    }
  );

  // Return a clean API interface
  return {
    get: axiosInstance.get.bind(axiosInstance),
    post: axiosInstance.post.bind(axiosInstance),
    put: axiosInstance.put.bind(axiosInstance),
    patch: axiosInstance.patch.bind(axiosInstance),
    delete: axiosInstance.delete.bind(axiosInstance),
    request: axiosInstance.request.bind(axiosInstance),
  };
}

/**
 * Create a client with retry logic
 */
export function createResilientApiClient(config: SessionConfig): ApiClient {
  const baseClient = createProductBoardApiClient(config);

  // Wrap methods with retry logic
  const withRetry = <T extends any[], R>(
    method: (...args: T) => Promise<R>,
    methodName: string
  ) => {
    return async (...args: T): Promise<R> => {
      const maxRetries = 3;
      let lastError: Error;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await method(...args);
        } catch (error: any) {
          lastError = error;

          // Don't retry authentication errors or client errors
          if (
            error instanceof AuthenticationError ||
            (error.response && error.response.status < 500)
          ) {
            throw error;
          }

          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
            debugLog('api-client', `Retrying ${methodName} after error`, {
              attempt,
              maxRetries,
              delay,
              error: error.message,
            });

            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError!;
    };
  };

  return {
    get: withRetry(baseClient.get, 'GET'),
    post: withRetry(baseClient.post, 'POST'),
    put: withRetry(baseClient.put, 'PUT'),
    patch: withRetry(baseClient.patch, 'PATCH'),
    delete: withRetry(baseClient.delete, 'DELETE'),
    request: withRetry(baseClient.request, 'REQUEST'),
  };
}
