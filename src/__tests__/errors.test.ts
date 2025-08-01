/**
 * Unit tests for error handling
 */
import { describe, it, expect } from '@jest/globals';
import { ErrorCode } from '@modelcontextprotocol/sdk/types';
import {
  ProductboardError,
  ValidationError,
  AuthenticationError,
  RateLimitError,
  NetworkError,
  ConfigurationError,
  sanitizeErrorMessage,
} from '../errors/index.js';

describe('Error Types', () => {
  describe('ProductboardError', () => {
    it('should create error with code and message', () => {
      const error = new ProductboardError(
        ErrorCode.InvalidRequest,
        'Test error'
      );
      expect(error.code).toBe(ErrorCode.InvalidRequest);
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ProductboardError');
    });

    it('should store original error', () => {
      const originalError = new Error('Original');
      const error = new ProductboardError(
        ErrorCode.InternalError,
        'Wrapped error',
        originalError
      );
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with field', () => {
      const error = new ValidationError('Invalid email', 'email');
      expect(error.code).toBe(ErrorCode.InvalidRequest);
      expect(error.message).toBe('Invalid email');
      expect(error.field).toBe('email');
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('AuthenticationError', () => {
    it('should create auth error with default message', () => {
      const error = new AuthenticationError();
      expect(error.code).toBe(ErrorCode.InvalidRequest);
      expect(error.message).toBe('Authentication failed');
      expect(error.name).toBe('AuthenticationError');
    });

    it('should create auth error with custom message', () => {
      const error = new AuthenticationError('Token expired');
      expect(error.message).toBe('Token expired');
    });
  });

  describe('RateLimitError', () => {
    it('should create rate limit error without retry after', () => {
      const error = new RateLimitError();
      expect(error.code).toBe(ErrorCode.InvalidRequest);
      expect(error.message).toBe('Rate limit exceeded');
      expect(error.name).toBe('RateLimitError');
    });

    it('should create rate limit error with retry after', () => {
      const error = new RateLimitError(60);
      expect(error.message).toBe('Rate limit exceeded. Retry after 60s');
      expect(error.retryAfter).toBe(60);
    });
  });

  describe('NetworkError', () => {
    it('should create network error', () => {
      const error = new NetworkError('Connection timeout');
      expect(error.code).toBe(ErrorCode.InternalError);
      expect(error.message).toBe('Connection timeout');
      expect(error.name).toBe('NetworkError');
    });

    it('should store original error', () => {
      const originalError = new Error('ECONNREFUSED');
      const error = new NetworkError('Connection failed', originalError);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('ConfigurationError', () => {
    it('should create configuration error', () => {
      const error = new ConfigurationError('Missing API token');
      expect(error.code).toBe(ErrorCode.InternalError);
      expect(error.message).toBe('Missing API token');
      expect(error.name).toBe('ConfigurationError');
    });
  });
});

describe('sanitizeErrorMessage', () => {
  it('should sanitize validation errors', () => {
    const error = new ValidationError('Invalid format', 'email');
    expect(sanitizeErrorMessage(error)).toBe('Invalid email.');

    const errorNoField = new ValidationError('Bad input');
    expect(sanitizeErrorMessage(errorNoField)).toBe('Invalid input.');
  });

  it('should sanitize authentication errors', () => {
    const error = new AuthenticationError('Token invalid: xyz123');
    expect(sanitizeErrorMessage(error)).toBe('Authentication failed.');
  });

  it('should preserve rate limit messages', () => {
    const error = new RateLimitError(60);
    expect(sanitizeErrorMessage(error)).toBe(
      'Rate limit exceeded. Retry after 60s.'
    );
  });

  it('should sanitize network errors', () => {
    const error = new NetworkError('ECONNREFUSED to 192.168.1.1');
    expect(sanitizeErrorMessage(error)).toBe('Network error occurred.');
  });

  it('should sanitize configuration errors', () => {
    const error = new ConfigurationError('Token pb_123 is invalid');
    expect(sanitizeErrorMessage(error)).toBe('Configuration error.');
  });

  it('should sanitize unknown errors', () => {
    expect(sanitizeErrorMessage(new Error('Sensitive data'))).toBe(
      'An error occurred processing your request.'
    );
    expect(sanitizeErrorMessage('String error')).toBe(
      'An error occurred processing your request.'
    );
    expect(sanitizeErrorMessage(null)).toBe(
      'An error occurred processing your request.'
    );
  });
});
