/**
 * Unit tests for validation utilities
 */
import { describe, it, expect } from "@jest/globals";
import {
  sanitizeString,
  validateEmail,
  validateUrl,
  validateArray,
  validateRequired,
  validatePagination,
  validateDate,
  validateEnum,
  validateRequestSize,
} from "../utils/validation.js";
import { ValidationError } from "../errors/index.js";

describe("Validation Utilities", () => {
  describe("sanitizeString", () => {
    it("should sanitize valid strings", () => {
      expect(sanitizeString("Hello World", "test")).toBe("Hello World");
      expect(sanitizeString("  trimmed  ", "test")).toBe("trimmed");
    });

    it("should remove dangerous characters", () => {
      expect(sanitizeString("Hello<script>alert('xss')</script>", "test")).toBe(
        "Helloscriptalert('xss')/script",
      );
    });

    it("should throw on invalid input", () => {
      expect(() => sanitizeString(123, "test")).toThrow(ValidationError);
      expect(() => sanitizeString("", "test")).toThrow(ValidationError);
    });

    it("should enforce max length", () => {
      const longString = "a".repeat(300);
      expect(() => sanitizeString(longString, "test", 255)).toThrow(
        ValidationError,
      );
    });
  });

  describe("validateEmail", () => {
    it("should validate correct emails", () => {
      expect(validateEmail("test@example.com")).toBe("test@example.com");
      expect(validateEmail("User@EXAMPLE.COM")).toBe("user@example.com");
    });

    it("should reject invalid emails", () => {
      expect(() => validateEmail("notanemail")).toThrow(ValidationError);
      expect(() => validateEmail("@example.com")).toThrow(ValidationError);
      expect(() => validateEmail("test@")).toThrow(ValidationError);
    });
  });

  describe("validateUrl", () => {
    it("should validate correct URLs", () => {
      expect(validateUrl("https://example.com")).toBe("https://example.com");
      expect(validateUrl("http://localhost:3000/path")).toBe(
        "http://localhost:3000/path",
      );
    });

    it("should reject invalid URLs", () => {
      expect(() => validateUrl("not a url")).toThrow(ValidationError);
      expect(() => validateUrl("ftp://example.com")).toThrow(ValidationError);
      expect(() => validateUrl("javascript:alert(1)")).toThrow(ValidationError);
    });
  });

  describe("validateArray", () => {
    it("should validate arrays", () => {
      expect(validateArray([1, 2, 3], "test")).toEqual([1, 2, 3]);
      expect(validateArray([], "test")).toEqual([]);
    });

    it("should reject non-arrays", () => {
      expect(() => validateArray("not array", "test")).toThrow(ValidationError);
      expect(() => validateArray({}, "test")).toThrow(ValidationError);
    });

    it("should enforce max length", () => {
      const longArray = new Array(101).fill(1);
      expect(() => validateArray(longArray, "test")).toThrow(ValidationError);
    });

    it("should apply validator function", () => {
      const validator = (item: unknown): string => String(item).toUpperCase();
      expect(validateArray(["a", "b"], "test", validator)).toEqual(["A", "B"]);
    });
  });

  describe("validateRequired", () => {
    it("should pass when all required fields present", () => {
      expect(() =>
        validateRequired({ a: 1, b: 2, c: 3 }, ["a", "b"]),
      ).not.toThrow();
    });

    it("should throw when required fields missing", () => {
      expect(() =>
        validateRequired({ a: 1, b: undefined }, ["a", "b"]),
      ).toThrow(ValidationError);
      expect(() => validateRequired({ a: null }, ["a"])).toThrow(
        ValidationError,
      );
    });
  });

  describe("validatePagination", () => {
    it("should validate correct pagination", () => {
      expect(validatePagination({ limit: 50, offset: 0 })).toEqual({
        limit: 50,
        offset: 0,
      });
      expect(validatePagination({})).toEqual({ limit: 50, offset: 0 });
    });

    it("should reject invalid pagination", () => {
      expect(() => validatePagination({ limit: 0 })).toThrow(ValidationError);
      expect(() => validatePagination({ limit: 101 })).toThrow(ValidationError);
      expect(() => validatePagination({ offset: -1 })).toThrow(ValidationError);
    });
  });

  describe("validateDate", () => {
    it("should validate correct dates", () => {
      const date = validateDate("2024-01-01", "test");
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it("should reject invalid dates", () => {
      expect(() => validateDate("not a date", "test")).toThrow(ValidationError);
      expect(() => validateDate("2024-13-01", "test")).toThrow(ValidationError);
    });
  });

  describe("validateEnum", () => {
    const validValues = ["red", "green", "blue"] as const;

    it("should validate correct enum values", () => {
      expect(validateEnum("red", validValues, "color")).toBe("red");
      expect(validateEnum("blue", validValues, "color")).toBe("blue");
    });

    it("should reject invalid enum values", () => {
      expect(() => validateEnum("yellow", validValues, "color")).toThrow(
        ValidationError,
      );
    });
  });

  describe("validateRequestSize", () => {
    it("should allow small payloads", () => {
      expect(() => validateRequestSize({ small: "data" })).not.toThrow();
    });

    it("should reject large payloads", () => {
      const largeData = { data: "x".repeat(1024 * 1024) };
      expect(() => validateRequestSize(largeData)).toThrow(ValidationError);
    });
  });
});
