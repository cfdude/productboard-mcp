/**
 * Retry logic with exponential backoff
 */
import { NetworkError, RateLimitError } from "../errors/index.js";

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryableStatuses?: number[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffFactor: 2,
  retryableStatuses: [429, 500, 502, 503, 504],
};

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff
 */
function calculateDelay(
  attempt: number,
  options: Required<RetryOptions>
): number {
  const delay = Math.min(
    options.initialDelay * Math.pow(options.backoffFactor, attempt - 1),
    options.maxDelay
  );
  
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 0.3 * delay;
  return Math.floor(delay + jitter);
}

/**
 * Determine if error is retryable
 */
function isRetryableError(error: unknown, options: Required<RetryOptions>): boolean {
  if (error instanceof RateLimitError) {
    return true;
  }
  
  if (error instanceof NetworkError) {
    return true;
  }
  
  // Check axios error response
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response?.status === "number"
  ) {
    return options.retryableStatuses.includes((error as any).response.status);
  }
  
  return false;
}

/**
 * Execute function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry
      if (attempt === opts.maxRetries || !isRetryableError(error, opts)) {
        throw error;
      }
      
      // Calculate delay
      let delay = calculateDelay(attempt, opts);
      
      // Use retry-after header if available
      if (error instanceof RateLimitError && error.retryAfter) {
        delay = error.retryAfter * 1000;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response?.headers?.["retry-after"]
      ) {
        const retryAfter = parseInt(
          (error as any).response.headers["retry-after"]
        );
        if (!isNaN(retryAfter)) {
          delay = retryAfter * 1000;
        }
      }
      
      // Wait before retrying
      await sleep(delay);
    }
  }
  
  throw lastError;
}

/**
 * Circuit breaker pattern for API failures
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: "closed" | "open" | "half-open" = "closed";
  
  constructor(
    private readonly threshold: number = 5,
    private readonly timeout: number = 60000 // 1 minute
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = "half-open";
      } else {
        throw new NetworkError("Circuit breaker is open");
      }
    }
    
    try {
      const result = await fn();
      if (this.state === "half-open") {
        this.reset();
      }
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }
  
  private recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = "open";
    }
  }
  
  private reset(): void {
    this.failures = 0;
    this.lastFailureTime = 0;
    this.state = "closed";
  }
}