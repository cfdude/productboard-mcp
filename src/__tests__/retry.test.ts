/**
 * Unit tests for retry logic
 */
import { describe, it, expect } from "@jest/globals";
import { withRetry, CircuitBreaker } from "../utils/retry.js";
import { NetworkError, RateLimitError } from "../errors/index.js";

describe("Retry Logic", () => {
  describe("withRetry", () => {
    it("should succeed on first attempt", async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        return "success";
      };
      
      const result = await withRetry(fn);
      expect(result).toBe("success");
      expect(attempts).toBe(1);
    });

    it("should retry on retryable errors", async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts < 3) {
          throw new NetworkError("Connection failed");
        }
        return "success";
      };

      const result = await withRetry(fn, {
        maxRetries: 3,
        initialDelay: 10,
      });

      expect(result).toBe("success");
      expect(attempts).toBe(3);
    });

    it("should respect rate limit retry-after", async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts === 1) {
          throw new RateLimitError(1); // 1 second
        }
        return "success";
      };

      const start = Date.now();
      const result = await withRetry(fn, {
        maxRetries: 2,
        initialDelay: 10000, // Would be 10s without retry-after
      });
      const duration = Date.now() - start;

      expect(result).toBe("success");
      expect(attempts).toBe(2);
      expect(duration).toBeGreaterThanOrEqual(900); // At least 900ms
      expect(duration).toBeLessThan(2000); // But less than 2s
    });

    it("should fail after max retries", async () => {
      let attempts = 0;
      const error = new NetworkError("Persistent failure");
      const fn = async () => {
        attempts++;
        throw error;
      };

      await expect(
        withRetry(fn, { maxRetries: 2, initialDelay: 10 })
      ).rejects.toThrow(error);

      expect(attempts).toBe(2);
    });

    it("should not retry non-retryable errors", async () => {
      let attempts = 0;
      const error = new Error("Not retryable");
      const fn = async () => {
        attempts++;
        throw error;
      };

      await expect(withRetry(fn)).rejects.toThrow(error);
      expect(attempts).toBe(1);
    });

    it("should handle axios-like errors", async () => {
      let attempts = 0;
      const fn = async () => {
        attempts++;
        if (attempts === 1) {
          throw { response: { status: 503 } };
        }
        return "success";
      };

      const result = await withRetry(fn, {
        maxRetries: 2,
        initialDelay: 10,
      });

      expect(result).toBe("success");
      expect(attempts).toBe(2);
    });
  });

  describe("CircuitBreaker", () => {
    it("should allow calls when closed", async () => {
      const breaker = new CircuitBreaker(3, 100);
      let calls = 0;
      const fn = async () => {
        calls++;
        return "success";
      };

      const result = await breaker.execute(fn);
      expect(result).toBe("success");
      expect(calls).toBe(1);
    });

    it("should open after threshold failures", async () => {
      const breaker = new CircuitBreaker(3, 100);
      let calls = 0;
      const fn = async () => {
        calls++;
        throw new Error("fail");
      };

      // Fail 3 times to open the breaker
      for (let i = 0; i < 3; i++) {
        await expect(breaker.execute(fn)).rejects.toThrow("fail");
      }
      expect(calls).toBe(3);

      // Circuit should be open now
      await expect(breaker.execute(fn)).rejects.toThrow(
        "Circuit breaker is open"
      );
      expect(calls).toBe(3); // Not called on 4th attempt
    });

    it("should enter half-open state after timeout", async () => {
      const breaker = new CircuitBreaker(2, 50); // 50ms timeout
      let calls = 0;
      let shouldFail = true;
      
      const fn = async () => {
        calls++;
        if (shouldFail) {
          throw new Error("fail");
        }
        return "success";
      };

      // Open the breaker
      await expect(breaker.execute(fn)).rejects.toThrow("fail");
      await expect(breaker.execute(fn)).rejects.toThrow("fail");
      expect(calls).toBe(2);

      // Should be open
      await expect(breaker.execute(fn)).rejects.toThrow(
        "Circuit breaker is open"
      );
      expect(calls).toBe(2);

      // Wait for timeout
      await new Promise(resolve => setTimeout(resolve, 60));

      // Should allow one attempt (half-open)
      shouldFail = false;
      const result = await breaker.execute(fn);
      expect(result).toBe("success");
      expect(calls).toBe(3);
    });

    it("should reset on successful half-open call", async () => {
      const breaker = new CircuitBreaker(2, 50);
      let calls = 0;
      let failCount = 0;
      
      const fn = async () => {
        calls++;
        if (failCount > 0) {
          failCount--;
          throw new Error("fail");
        }
        return "success";
      };

      // Open the breaker
      failCount = 2;
      await expect(breaker.execute(fn)).rejects.toThrow();
      await expect(breaker.execute(fn)).rejects.toThrow();

      // Wait and succeed in half-open
      await new Promise(resolve => setTimeout(resolve, 60));
      await breaker.execute(fn);

      // Should be fully closed now - reset call count
      calls = 0;
      await breaker.execute(fn);
      await breaker.execute(fn);
      expect(calls).toBe(2);
    });
  });
});