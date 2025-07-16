/**
 * Custom error types for Productboard MCP server
 */
import { ErrorCode } from "@modelcontextprotocol/sdk/types.js";

export class ProductboardError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "ProductboardError";
  }
}

export class ValidationError extends ProductboardError {
  constructor(message: string, public field?: string) {
    super(ErrorCode.InvalidRequest, message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends ProductboardError {
  constructor(message: string = "Authentication failed") {
    super(ErrorCode.InvalidRequest, message);
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends ProductboardError {
  constructor(public retryAfter?: number) {
    super(
      ErrorCode.InvalidRequest,
      `Rate limit exceeded${retryAfter ? `. Retry after ${retryAfter}s` : ""}`
    );
    this.name = "RateLimitError";
  }
}

export class NetworkError extends ProductboardError {
  constructor(message: string, originalError?: unknown) {
    super(ErrorCode.InternalError, message, originalError);
    this.name = "NetworkError";
  }
}

export class ConfigurationError extends ProductboardError {
  constructor(message: string) {
    super(ErrorCode.InternalError, message);
    this.name = "ConfigurationError";
  }
}

/**
 * Sanitize error messages to prevent information leakage
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return error.field ? `Invalid ${error.field}` : "Invalid input";
  }
  
  if (error instanceof AuthenticationError) {
    return "Authentication failed";
  }
  
  if (error instanceof RateLimitError) {
    return error.message;
  }
  
  if (error instanceof NetworkError) {
    return "Network error occurred";
  }
  
  if (error instanceof ConfigurationError) {
    return "Configuration error";
  }
  
  // Generic error - don't expose details
  return "An error occurred processing your request";
}