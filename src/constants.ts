/**
 * Application constants
 * Centralized definitions for magic numbers and configuration values
 */

// API Pagination limits
export const API_LIMITS = {
  /** Default maximum records per page */
  DEFAULT_PAGE_SIZE: 100,
  /** Minimum page size allowed */
  MIN_PAGE_SIZE: 1,
  /** Maximum page size allowed */
  MAX_PAGE_SIZE: 100,
  /** Default starting offset */
  DEFAULT_OFFSET: 0,
  /** Minimum offset allowed */
  MIN_OFFSET: 0,
} as const;

// Response optimization limits
export const RESPONSE_LIMITS = {
  /** Minimum response length for optimization */
  MIN_RESPONSE_LENGTH: 100,
  /** Maximum response length before truncation */
  MAX_RESPONSE_LENGTH: 50000,
  /** Maximum length for string fields before truncation */
  MAX_STRING_FIELD_LENGTH: 1024,
  /** Default truncation indicator */
  DEFAULT_TRUNCATE_INDICATOR: '...',
} as const;

// Rate limiting
export const RATE_LIMITS = {
  /** Default rate limit per minute */
  DEFAULT_RATE_LIMIT_PER_MINUTE: 60,
} as const;

// Timeouts and intervals
export const TIMEOUTS = {
  /** Default API request timeout in milliseconds */
  DEFAULT_API_TIMEOUT: 30000,
  /** Connection timeout in milliseconds */
  CONNECTION_TIMEOUT: 10000,
} as const;

// Field validation
export const FIELD_LIMITS = {
  /** Maximum number of custom fields to include */
  MAX_CUSTOM_FIELDS: 50,
  /** Maximum field name length */
  MAX_FIELD_NAME_LENGTH: 100,
} as const;
