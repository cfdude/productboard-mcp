/**
 * Input validation and sanitization utilities
 */
import { ValidationError } from "../errors/index.js";

// Maximum allowed string lengths
const MAX_TITLE_LENGTH = 255;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_CONTENT_LENGTH = 50000;
const MAX_TAG_LENGTH = 50;
const MAX_ARRAY_LENGTH = 100;
const MAX_URL_LENGTH = 2048;
const MAX_EMAIL_LENGTH = 254;

// Regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/;
const SAFE_STRING_REGEX = /^[\w\s\-.,!?@#$%^&*()+=\[\]{};:'"<>\/\\|`~]+$/;

/**
 * Sanitize a string input
 */
export function sanitizeString(
  value: unknown,
  field: string,
  maxLength: number = MAX_DESCRIPTION_LENGTH
): string {
  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be a string`, field);
  }
  
  const trimmed = value.trim();
  
  if (trimmed.length === 0) {
    throw new ValidationError(`${field} cannot be empty`, field);
  }
  
  if (trimmed.length > maxLength) {
    throw new ValidationError(
      `${field} exceeds maximum length of ${maxLength}`,
      field
    );
  }
  
  // Remove potential SQL injection characters
  const sanitized = trimmed
    .replace(/[<>]/g, "") // Remove HTML tags
    .replace(/\0/g, ""); // Remove null bytes
  
  return sanitized;
}

/**
 * Validate and sanitize email
 */
export function validateEmail(value: unknown, field: string = "email"): string {
  const email = sanitizeString(value, field, MAX_EMAIL_LENGTH);
  
  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError(`Invalid email format`, field);
  }
  
  return email.toLowerCase();
}

/**
 * Validate and sanitize URL
 */
export function validateUrl(value: unknown, field: string = "url"): string {
  const url = sanitizeString(value, field, MAX_URL_LENGTH);
  
  if (!URL_REGEX.test(url)) {
    throw new ValidationError(`Invalid URL format`, field);
  }
  
  try {
    new URL(url); // Additional validation
    return url;
  } catch {
    throw new ValidationError(`Invalid URL format`, field);
  }
}

/**
 * Validate array input
 */
export function validateArray<T>(
  value: unknown,
  field: string,
  validator?: (item: unknown, index: number) => T
): T[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${field} must be an array`, field);
  }
  
  if (value.length > MAX_ARRAY_LENGTH) {
    throw new ValidationError(
      `${field} exceeds maximum length of ${MAX_ARRAY_LENGTH}`,
      field
    );
  }
  
  if (validator) {
    return value.map((item, index) => validator(item, index));
  }
  
  return value as T[];
}

/**
 * Validate object has required fields
 */
export function validateRequired<T extends Record<string, unknown>>(
  obj: T,
  requiredFields: (keyof T)[]
): void {
  for (const field of requiredFields) {
    if (obj[field] === undefined || obj[field] === null) {
      throw new ValidationError(`${String(field)} is required`, String(field));
    }
  }
}

/**
 * Validate pagination parameters
 */
export interface PaginationParams {
  limit: number;
  offset: number;
}

export function validatePagination(params: any): PaginationParams {
  const limit = params.limit !== undefined ? Number(params.limit) : 50;
  const offset = params.offset !== undefined ? Number(params.offset) : 0;
  
  if (isNaN(limit) || limit < 1 || limit > 100) {
    throw new ValidationError("Limit must be between 1 and 100", "limit");
  }
  
  if (isNaN(offset) || offset < 0) {
    throw new ValidationError("Offset must be non-negative", "offset");
  }
  
  return { limit, offset };
}

/**
 * Validate date string
 */
export function validateDate(value: unknown, field: string): string {
  const dateStr = sanitizeString(value, field, 30);
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new ValidationError(`Invalid date format`, field);
  }
  
  return date.toISOString();
}

/**
 * Validate enum value
 */
export function validateEnum<T extends string>(
  value: unknown,
  validValues: readonly T[],
  field: string
): T {
  if (!validValues.includes(value as T)) {
    throw new ValidationError(
      `Invalid ${field}. Must be one of: ${validValues.join(", ")}`,
      field
    );
  }
  
  return value as T;
}

/**
 * Sanitize object by removing undefined/null values
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const cleaned: Partial<T> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      cleaned[key as keyof T] = value;
    }
  }
  
  return cleaned;
}

/**
 * Validate request size
 */
export function validateRequestSize(data: unknown): void {
  const size = JSON.stringify(data).length;
  const maxSize = 1024 * 1024; // 1MB
  
  if (size > maxSize) {
    throw new ValidationError("Request payload too large");
  }
}