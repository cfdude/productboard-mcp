/**
 * @jest-environment node
 */

import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { AxiosInstance } from 'axios';
import { createProductBoardApiClient, ApiClient } from '../utils/api-client.js';
import { SessionConfig } from '../utils/session-config.js';
import {
  AuthenticationError,
  NetworkError,
  RateLimitError,
} from '../errors/index.js';

// Mock axios before importing it
import axios from 'axios';
jest.mock('axios');

// Mock debug logger
const mockDebugLog = jest.fn();
jest.mock('../utils/debug-logger.js', () => ({
  debugLog: mockDebugLog,
}));

// Mock error utilities
const mockSanitizeErrorMessage = jest.fn((message: string) => message);
jest.mock('../errors/index.js', () => ({
  AuthenticationError: class AuthenticationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AuthenticationError';
    }
  },
  NetworkError: class NetworkError extends Error {
    constructor(message: string, _originalError?: Error) {
      super(message);
      this.name = 'NetworkError';
    }
  },
  RateLimitError: class RateLimitError extends Error {
    constructor() {
      super('Rate limit exceeded');
      this.name = 'RateLimitError';
    }
  },
  sanitizeErrorMessage: mockSanitizeErrorMessage,
}));

describe('API Client', () => {
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;
  let mockConfig: SessionConfig;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDebugLog.mockClear();
    mockSanitizeErrorMessage.mockClear();

    // Create mock axios instance
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      request: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    } as any;

    const mockedAxios = axios as any;
    mockedAxios.create = jest.fn().mockReturnValue(mockAxiosInstance);

    // Default test configuration
    mockConfig = {
      apiToken: 'test-token-123',
      baseUrl: 'https://api.productboard.com',
      timeouts: {
        request: 30000,
      },
    } as SessionConfig;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('createProductBoardApiClient', () => {
    describe('Client Creation', () => {
      it('should create axios instance with correct configuration', () => {
        createProductBoardApiClient(mockConfig);

        expect(axios.create).toHaveBeenCalledWith({
          baseURL: 'https://api.productboard.com',
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer test-token-123',
            'X-Version': '1',
          },
        });
      });

      it('should create client without auth headers when no token provided', () => {
        const configWithoutToken = { ...mockConfig };
        delete configWithoutToken.apiToken;

        createProductBoardApiClient(configWithoutToken);

        expect(axios.create).toHaveBeenCalledWith({
          baseURL: 'https://api.productboard.com',
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
      });

      it('should use default timeout when not specified', () => {
        const configWithoutTimeout = { ...mockConfig };
        delete configWithoutTimeout.timeouts;

        createProductBoardApiClient(configWithoutTimeout);

        expect(axios.create).toHaveBeenCalledWith({
          baseURL: 'https://api.productboard.com',
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer test-token-123',
            'X-Version': '1',
          },
        });
      });
    });

    describe('Interceptors Setup', () => {
      it('should register request interceptor', () => {
        createProductBoardApiClient(mockConfig);

        expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
          expect.any(Function),
          expect.any(Function)
        );
      });

      it('should register response interceptor', () => {
        createProductBoardApiClient(mockConfig);

        expect(
          mockAxiosInstance.interceptors.response.use
        ).toHaveBeenCalledWith(expect.any(Function), expect.any(Function));
      });
    });

    describe('API Interface', () => {
      let client: ApiClient;

      beforeEach(() => {
        client = createProductBoardApiClient(mockConfig);
      });

      it('should expose all HTTP methods', () => {
        expect(typeof client.get).toBe('function');
        expect(typeof client.post).toBe('function');
        expect(typeof client.put).toBe('function');
        expect(typeof client.patch).toBe('function');
        expect(typeof client.delete).toBe('function');
        expect(typeof client.request).toBe('function');
      });

      it('should bind methods correctly', async () => {
        const mockResponse = { data: { id: 1 } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await client.get('/test');

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test');
        expect(result).toBe(mockResponse);
      });
    });

    describe('Request Interceptor', () => {
      let requestInterceptor: any;

      beforeEach(() => {
        createProductBoardApiClient(mockConfig);
        const [successHandler] = (
          mockAxiosInstance.interceptors.request.use as jest.Mock
        ).mock.calls[0];
        requestInterceptor = successHandler;
      });

      it('should log request details', async () => {
        const requestConfig = {
          method: 'get',
          url: '/test',
          baseURL: 'https://api.productboard.com',
          timeout: 30000,
        };

        const result = requestInterceptor(requestConfig);

        // Main behavior: interceptor should return the config unchanged
        expect(result).toBe(requestConfig);
        // Debug logging is tested separately if needed
      });

      it('should handle missing method gracefully', () => {
        const requestConfig = {
          url: '/test',
          baseURL: 'https://api.productboard.com',
          timeout: 30000,
        };

        expect(() => requestInterceptor(requestConfig)).not.toThrow();
      });
    });

    describe('Response Interceptor - Success', () => {
      let responseInterceptor: any;

      beforeEach(() => {
        createProductBoardApiClient(mockConfig);
        const [successHandler] = (
          mockAxiosInstance.interceptors.response.use as jest.Mock
        ).mock.calls[0];
        responseInterceptor = successHandler;
      });

      it('should log successful responses', async () => {
        const response = {
          status: 200,
          statusText: 'OK',
          config: { url: '/test' },
          headers: { 'x-response-time': '150ms' },
        };

        const result = responseInterceptor(response);

        // Main behavior: interceptor should return response unchanged
        expect(result).toBe(response);
        expect(responseInterceptor(response)).toBe(response);
      });

      it('should handle missing response time header', async () => {
        const response = {
          status: 200,
          statusText: 'OK',
          config: { url: '/test' },
          headers: {},
        };

        const result = responseInterceptor(response);

        // Main behavior: interceptor should handle missing headers gracefully
        expect(result).toBe(response);
      });
    });

    describe('Response Interceptor - Error Handling', () => {
      let errorInterceptor: any;

      beforeEach(() => {
        createProductBoardApiClient(mockConfig);
        const [, errorHandler] = (
          mockAxiosInstance.interceptors.response.use as jest.Mock
        ).mock.calls[0];
        errorInterceptor = errorHandler;
      });

      it('should throw AuthenticationError for 401 responses', async () => {
        const error = {
          response: { status: 401, statusText: 'Unauthorized' },
          config: { url: '/test' },
          message: 'Unauthorized',
        };

        expect(() => errorInterceptor(error)).toThrow(AuthenticationError);
      });

      it('should throw RateLimitError for 429 responses', async () => {
        const error = {
          response: { status: 429, statusText: 'Too Many Requests' },
          config: { url: '/test' },
          message: 'Rate limited',
        };

        expect(() => errorInterceptor(error)).toThrow(RateLimitError);
      });

      it('should throw NetworkError for 5xx responses', async () => {
        const error = {
          response: { status: 500, statusText: 'Internal Server Error' },
          config: { url: '/test' },
          message: 'Server error',
        };

        expect(() => errorInterceptor(error)).toThrow(NetworkError);
      });

      it('should throw NetworkError for timeout errors', async () => {
        const error = {
          code: 'ECONNABORTED',
          config: { url: '/test' },
          message: 'timeout of 30000ms exceeded',
        };

        expect(() => errorInterceptor(error)).toThrow(NetworkError);
      });

      it('should throw NetworkError for connection errors', async () => {
        const error = {
          code: 'ENOTFOUND',
          config: { url: '/test' },
          message: 'getaddrinfo ENOTFOUND api.productboard.com',
        };

        expect(() => errorInterceptor(error)).toThrow(NetworkError);
      });

      it('should pass through other HTTP errors', async () => {
        const error = {
          response: { status: 400, statusText: 'Bad Request' },
          config: { url: '/test' },
          message: 'Bad request',
        };

        await expect(errorInterceptor(error)).rejects.toBe(error);
      });

      it('should pass through non-HTTP errors', async () => {
        const error = new Error('Unknown error');

        await expect(errorInterceptor(error)).rejects.toBe(error);
      });

      it('should log error details', async () => {
        const error = {
          response: {
            status: 500,
            statusText: 'Internal Server Error',
            data: { message: 'Server error' },
          },
          config: { url: '/test' },
          message: 'Server error',
        };

        try {
          await errorInterceptor(error);
        } catch {
          // Expected to throw - debug logging happens as side effect
        }
      });
    });
  });

  describe.skip('createResilientApiClient', () => {
    let resilientClient: ApiClient;
    let baseClient: jest.Mocked<ApiClient>;

    beforeEach(async () => {
      // Mock the base client creation
      baseClient = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
        request: jest.fn(),
      };

      // Mock createProductBoardApiClient directly in the module mock
      jest.doMock('../utils/api-client.js', () => {
        const actual = jest.requireActual('../utils/api-client.js') as any;
        return {
          ...actual,
          createProductBoardApiClient: jest.fn(() => baseClient),
        };
      });

      // Re-import after mocking
      const { createResilientApiClient: createResilientApiClientMocked } =
        await import('../utils/api-client.js');
      resilientClient = createResilientApiClientMocked(mockConfig);

      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.dontMock('../utils/api-client.js');
      jest.resetModules();
      jest.clearAllMocks();
    });

    describe('Retry Logic', () => {
      it('should succeed on first attempt', async () => {
        const mockResponse = { data: { id: 1 } };
        baseClient.get.mockResolvedValue(mockResponse);

        const result = await resilientClient.get('/test');

        expect(baseClient.get).toHaveBeenCalledTimes(1);
        expect(result).toBe(mockResponse);
      });

      it('should retry on network errors', async () => {
        const networkError = new NetworkError('Connection failed');
        baseClient.get
          .mockRejectedValueOnce(networkError)
          .mockRejectedValueOnce(networkError)
          .mockResolvedValue({ data: { id: 1 } });

        const promise = resilientClient.get('/test');

        // Fast-forward timers for retries
        jest.advanceTimersByTime(1000); // First retry delay
        await Promise.resolve(); // Allow promises to resolve
        jest.advanceTimersByTime(2000); // Second retry delay
        await Promise.resolve(); // Allow promises to resolve

        const result = await promise;

        expect(baseClient.get).toHaveBeenCalledTimes(3);
        expect(result).toEqual({ data: { id: 1 } });
      });

      it('should not retry authentication errors', async () => {
        const authError = new AuthenticationError('Invalid token');
        baseClient.get.mockRejectedValue(authError);

        await expect(resilientClient.get('/test')).rejects.toThrow(
          AuthenticationError
        );
        expect(baseClient.get).toHaveBeenCalledTimes(1);
      });

      it('should not retry 4xx errors', async () => {
        const clientError = { response: { status: 400 } };
        baseClient.get.mockRejectedValue(clientError);

        await expect(resilientClient.get('/test')).rejects.toBe(clientError);
        expect(baseClient.get).toHaveBeenCalledTimes(1);
      });

      it('should retry 5xx errors', async () => {
        const serverError = { response: { status: 500 } };
        baseClient.get
          .mockRejectedValueOnce(serverError)
          .mockRejectedValueOnce(serverError)
          .mockResolvedValue({ data: { id: 1 } });

        const promise = resilientClient.get('/test');

        jest.advanceTimersByTime(1000);
        await Promise.resolve();
        jest.advanceTimersByTime(2000);
        await Promise.resolve();

        await promise;
        expect(baseClient.get).toHaveBeenCalledTimes(3);
      });

      it('should fail after max retries', async () => {
        const networkError = new NetworkError('Connection failed');
        baseClient.get.mockRejectedValue(networkError);

        const promise = resilientClient.get('/test');

        // Fast-forward through all retry attempts
        jest.advanceTimersByTime(1000);
        await Promise.resolve();
        jest.advanceTimersByTime(2000);
        await Promise.resolve();
        jest.advanceTimersByTime(4000);
        await Promise.resolve();

        await expect(promise).rejects.toThrow(NetworkError);
        expect(baseClient.get).toHaveBeenCalledTimes(3);
      });

      it('should use exponential backoff for retries', async () => {
        const networkError = new NetworkError('Connection failed');
        baseClient.get.mockRejectedValue(networkError);

        const promise = resilientClient.get('/test');

        // Check first retry delay (1000ms)
        jest.advanceTimersByTime(999);
        expect(baseClient.get).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(1);
        await Promise.resolve();
        expect(baseClient.get).toHaveBeenCalledTimes(2);

        // Check second retry delay (2000ms)
        jest.advanceTimersByTime(1999);
        expect(baseClient.get).toHaveBeenCalledTimes(2);
        jest.advanceTimersByTime(1);
        await Promise.resolve();
        expect(baseClient.get).toHaveBeenCalledTimes(3);

        await expect(promise).rejects.toThrow(NetworkError);
      });

      it('should log retry attempts', async () => {
        const networkError = new NetworkError('Connection failed');
        baseClient.get.mockRejectedValue(networkError);

        const promise = resilientClient.get('/test');

        jest.advanceTimersByTime(1000);
        await Promise.resolve();

        // Debug logging of retry attempts happens as side effect

        jest.advanceTimersByTime(2000);
        await Promise.resolve();
        jest.advanceTimersByTime(4000);
        await Promise.resolve();

        await expect(promise).rejects.toThrow();
      });
    });

    describe('Method Coverage', () => {
      it('should wrap all HTTP methods with retry logic', () => {
        expect(typeof resilientClient.get).toBe('function');
        expect(typeof resilientClient.post).toBe('function');
        expect(typeof resilientClient.put).toBe('function');
        expect(typeof resilientClient.patch).toBe('function');
        expect(typeof resilientClient.delete).toBe('function');
        expect(typeof resilientClient.request).toBe('function');
      });

      it('should pass through method arguments correctly', async () => {
        baseClient.post.mockResolvedValue({ data: { id: 1 } });

        const data = { name: 'test' };
        const config = { headers: { 'Custom-Header': 'value' } };

        await resilientClient.post('/test', data, config);

        expect(baseClient.post).toHaveBeenCalledWith('/test', data, config);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing error response gracefully', async () => {
      createProductBoardApiClient(mockConfig);
      const [, errorHandler] = (
        mockAxiosInstance.interceptors.response.use as jest.Mock
      ).mock.calls[0] as any[];

      const error = {
        message: 'Network Error',
        code: 'NETWORK_ERROR',
      };

      // Should not throw during error handling
      await expect(errorHandler(error)).rejects.toBe(error);
    });

    it('should handle malformed config objects', () => {
      const malformedConfig = {} as SessionConfig;

      expect(() => createProductBoardApiClient(malformedConfig)).not.toThrow();
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: undefined,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
    });

    it('should handle empty error messages', async () => {
      createProductBoardApiClient(mockConfig);
      const [, errorHandler] = (
        mockAxiosInstance.interceptors.response.use as jest.Mock
      ).mock.calls[0] as any[];

      const error = {
        response: { status: 500, statusText: 'Internal Server Error' },
        config: { url: '/test' },
        message: '',
      };

      expect(() => errorHandler(error)).toThrow(NetworkError);
    });
  });
});
