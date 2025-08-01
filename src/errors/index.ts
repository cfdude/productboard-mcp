/**
 * Custom error types for Productboard MCP server
 */
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export class ProductboardError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ProductboardError';
  }
}

export class ValidationError extends ProductboardError {
  constructor(
    message: string,
    public field?: string
  ) {
    super(ErrorCode.InvalidRequest, message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ProductboardError {
  constructor(message: string = 'Authentication failed') {
    super(ErrorCode.InvalidRequest, message);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends ProductboardError {
  constructor(public retryAfter?: number) {
    super(
      ErrorCode.InvalidRequest,
      `Rate limit exceeded${retryAfter ? `. Retry after ${retryAfter}s` : ''}`
    );
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends ProductboardError {
  constructor(message: string, originalError?: unknown) {
    super(ErrorCode.InternalError, message, originalError);
    this.name = 'NetworkError';
  }
}

export class ConfigurationError extends ProductboardError {
  constructor(message: string) {
    super(ErrorCode.InternalError, message);
    this.name = 'ConfigurationError';
  }
}

/**
 * Sanitize error messages to prevent information leakage
 * Enhanced with contextual documentation hints
 */
export function sanitizeErrorMessage(
  error: unknown,
  toolName?: string
): string {
  const docHint = toolName
    ? ` Use 'get_${getEntityTypeFromTool(toolName)}_docs()' for complete API documentation.`
    : '';

  if (error instanceof ValidationError) {
    const message = error.field ? `Invalid ${error.field}` : 'Invalid input';
    return `${message}.${docHint}`;
  }

  if (error instanceof AuthenticationError) {
    return `Authentication failed.${docHint}`;
  }

  if (error instanceof RateLimitError) {
    return `${error.message}.${docHint}`;
  }

  if (error instanceof NetworkError) {
    return `Network error occurred.${docHint}`;
  }

  if (error instanceof ConfigurationError) {
    return `Configuration error.${docHint}`;
  }

  // Generic error - don't expose details
  return `An error occurred processing your request.${docHint}`;
}

/**
 * Extract entity type from tool name for contextual documentation
 */
function getEntityTypeFromTool(toolName: string): string {
  if (toolName.includes('feature')) return 'feature';
  if (toolName.includes('note')) return 'note';
  if (toolName.includes('component')) return 'component';
  if (toolName.includes('product')) return 'product';
  if (toolName.includes('company')) return 'company';
  if (toolName.includes('user')) return 'user';
  if (toolName.includes('objective')) return 'objective';
  if (toolName.includes('initiative')) return 'initiative';
  if (toolName.includes('release')) return 'release';
  return 'general';
}
