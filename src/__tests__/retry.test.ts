/**
 * Unit tests for retry logic
 */
import { describe, it, expect, jest } from "@jest/globals";
import { withRetry, CircuitBreaker } from "../utils/retry.js";
import { NetworkError, RateLimitError } from "../errors/index.js";

describe("Retry Logic", () => {
  describe("withRetry", () => {
    it("should succeed on first attempt", async () => {
      const fn = jest.fn().mockResolvedValue("success");
      const result = await withRetry(fn);
      
      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should retry on retryable errors", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new NetworkError("Connection failed"))
        .mockRejectedValueOnce(new NetworkError("Connection failed"))
        .mockResolvedValue("success");

      const result = await withRetry(fn, {
        maxRetries: 3,
        initialDelay: 10,
      });

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should respect rate limit retry-after", async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new RateLimitError(1)) // 1 second
        .mockResolvedValue("success");

      const start = Date.now();
      const result = await withRetry(fn, {
        maxRetries: 2,
        initialDelay: 10000, // Would be 10s without retry-after
      });
      const duration = Date.now() - start;

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
      expect(duration).toBeGreaterThanOrEqual(900); // At least 900ms
      expect(duration).toBeLessThan(2000); // But less than 2s
    });

    it("should fail after max retries", async () => {
      const error = new NetworkError("Persistent failure");
      const fn = jest.fn().mockRejectedValue(error);

      await expect(
        withRetry(fn, { maxRetries: 2, initialDelay: 10 })
      ).rejects.toThrow(error);

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it("should not retry non-retryable errors", async () => {
      const error = new Error("Not retryable");
      const fn = jest.fn().mockRejectedValue(error);

      await expect(withRetry(fn)).rejects.toThrow(error);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should handle axios-like errors", async () => {
      const axiosError = {
        response: { status: 503 },
      };
      const fn = jest
        .fn()
        .mockRejectedValueOnce(axiosError)
        .mockResolvedValue("success");

      const result = await withRetry(fn, {
        maxRetries: 2,
        initialDelay: 10,
      });

      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe("CircuitBreaker", () => {
    it("should allow calls when closed", async () => {
      const breaker = new CircuitBreaker(3, 100);
      const fn = jest.fn().mockResolvedValue("success");

      const result = await breaker.execute(fn);
      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should open after threshold failures", async () => {
      const breaker = new CircuitBreaker(3, 100);
      const fn = jest.fn().mockRejectedValue(new Error("fail"));

      // Fail 3 times to open the breaker
      for (let i = 0; i < 3; i++) {
        await expect(breaker.execute(fn)).rejects.toThrow("fail");
      }

      // Circuit should be open now
      await expect(breaker.execute(fn)).rejects.toThrow(
        "Circuit breaker is open"
      );
      expect(fn).toHaveBeenCalledTimes(3); // Not called on 4th attempt
    });

    it("should enter half-open state after timeout", async () => {
      const breaker = new CircuitBreaker(2, 50); // 50ms timeout
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error("fail1"))
        .mockRejectedValueOnce(new Error("fail2"))
        .mockResolvedValue("success");

      // Open the breaker
      await expect(breaker.execute(fn)).rejects.toThrow("fail1");
      await expect(breaker.execute(fn)).rejects.toThrow("fail2");

      // Should be open
      await expect(breaker.execute(fn)).rejects.toThrow(
        "Circuit breaker is open"
      );

      // Wait for timeout
      await new Promise(resolve => setTimeout(resolve, 60));

      // Should allow one attempt (half-open)
      const result = await breaker.execute(fn);
      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should reset on successful half-open call", async () => {
      const breaker = new CircuitBreaker(2, 50);
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error("fail1"))
        .mockRejectedValueOnce(new Error("fail2"))
        .mockResolvedValue("success");

      // Open the breaker
      await expect(breaker.execute(fn)).rejects.toThrow();
      await expect(breaker.execute(fn)).rejects.toThrow();

      // Wait and succeed in half-open
      await new Promise(resolve => setTimeout(resolve, 60));
      await breaker.execute(fn);

      // Should be fully closed now
      fn.mockClear();
      await breaker.execute(fn);
      await breaker.execute(fn);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});