/**
 * Utilities for handling wildcard patterns and advanced search functionality
 */

export type PatternMatchMode = 'exact' | 'wildcard' | 'regex';

export interface WildcardPattern {
  pattern: string;
  isWildcard: boolean;
  regex: RegExp;
  mode: PatternMatchMode;
}

export interface PatternMatchOptions {
  caseSensitive?: boolean;
  maxComplexity?: number;
  timeout?: number;
}

/**
 * Compile a pattern string into a reusable pattern matcher
 */
export function compilePattern(
  pattern: string,
  mode: PatternMatchMode = 'wildcard',
  options: PatternMatchOptions = {}
): WildcardPattern {
  const { caseSensitive = false, maxComplexity = 1000 } = options;

  // Security check: prevent overly complex patterns
  if (pattern.length > maxComplexity) {
    throw new Error(
      `Pattern too complex: ${pattern.length} > ${maxComplexity} characters`
    );
  }

  let regex: RegExp;
  let isWildcard = false;

  switch (mode) {
    case 'exact': {
      // Exact match - escape all regex special characters
      const escapedExact = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      regex = new RegExp(`^${escapedExact}$`, caseSensitive ? '' : 'i');
      break;
    }

    case 'wildcard':
      // Check if pattern contains wildcards
      isWildcard = pattern.includes('*') || pattern.includes('?');

      if (!isWildcard) {
        // No wildcards, treat as exact match
        const escapedNoWild = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        regex = new RegExp(`^${escapedNoWild}$`, caseSensitive ? '' : 'i');
      } else {
        // Convert wildcards to regex
        const regexPattern = convertWildcardToRegex(pattern);
        regex = new RegExp(regexPattern, caseSensitive ? '' : 'i');
      }
      break;

    case 'regex':
      // Direct regex - validate for safety
      validateRegexSafety(pattern);
      regex = new RegExp(pattern, caseSensitive ? '' : 'i');
      isWildcard = true; // Treat regex as wildcard for processing purposes
      break;

    default:
      throw new Error(`Unknown pattern mode: ${mode}`);
  }

  return {
    pattern,
    isWildcard,
    regex,
    mode,
  };
}

/**
 * Test if a value matches the compiled pattern
 */
export function matchesPattern(
  value: string | null | undefined,
  compiledPattern: WildcardPattern
): boolean {
  if (!value) return false;

  const stringValue = String(value);
  return compiledPattern.regex.test(stringValue);
}

/**
 * Convert wildcard pattern to regex pattern
 */
function convertWildcardToRegex(pattern: string): string {
  // Escape all regex special characters except * and ?
  let escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');

  // Convert wildcards to regex equivalents
  escaped = escaped.replace(/\*/g, '.*'); // * becomes .*
  escaped = escaped.replace(/\?/g, '.'); // ? becomes .

  // Anchor the pattern to match the entire string
  return `^${escaped}$`;
}

/**
 * Validate regex pattern for safety (prevent ReDoS attacks)
 */
function validateRegexSafety(pattern: string): void {
  // Check for potentially dangerous patterns
  const dangerousPatterns = [
    /(\*\+|\+\*)/, // nested quantifiers
    /(\*\{|\+\{)/, // quantifiers with multipliers
    /(\(.*\)\{)/, // groups with large multipliers
    /(\[\^.*\]\{)/, // negated character classes with multipliers
  ];

  for (const dangerous of dangerousPatterns) {
    if (dangerous.test(pattern)) {
      throw new Error(
        'Potentially unsafe regex pattern detected. Use wildcard mode for safer pattern matching.'
      );
    }
  }

  // Check for reasonable length
  if (pattern.length > 500) {
    throw new Error('Regex pattern too long (>500 characters)');
  }
}

/**
 * Enhanced filter application with pattern support
 */
export function applyPatternFilter(
  item: any,
  field: string,
  pattern: WildcardPattern,
  operator: string = 'contains'
): boolean {
  const fieldValue = getNestedFieldValue(item, field);

  if (!fieldValue && operator !== 'isEmpty') {
    return false;
  }

  const stringValue = String(fieldValue || '');

  switch (operator) {
    case 'equals':
      return matchesPattern(stringValue, pattern);

    case 'contains':
      if (pattern.isWildcard) {
        return matchesPattern(stringValue, pattern);
      } else {
        // For non-wildcard contains, use substring matching
        const searchTerm = pattern.pattern;
        return stringValue.toLowerCase().includes(searchTerm.toLowerCase());
      }

    case 'startsWith':
      if (pattern.isWildcard) {
        // Create a new pattern that only matches at the start
        const startPattern = compilePattern(
          pattern.pattern + '*',
          pattern.mode,
          { caseSensitive: pattern.regex.flags.includes('i') === false }
        );
        return matchesPattern(stringValue, startPattern);
      } else {
        return stringValue
          .toLowerCase()
          .startsWith(pattern.pattern.toLowerCase());
      }

    case 'endsWith':
      if (pattern.isWildcard) {
        // Create a new pattern that only matches at the end
        const endPattern = compilePattern('*' + pattern.pattern, pattern.mode, {
          caseSensitive: pattern.regex.flags.includes('i') === false,
        });
        return matchesPattern(stringValue, endPattern);
      } else {
        return stringValue
          .toLowerCase()
          .endsWith(pattern.pattern.toLowerCase());
      }

    case 'isEmpty':
      return (
        !fieldValue ||
        fieldValue === '' ||
        fieldValue === null ||
        fieldValue === undefined
      );

    case 'regex':
      // Force regex mode regardless of compiled pattern mode
      if (pattern.mode !== 'regex') {
        const regexPattern = compilePattern(pattern.pattern, 'regex');
        return matchesPattern(stringValue, regexPattern);
      }
      return matchesPattern(stringValue, pattern);

    case 'before':
    case 'after':
      // Date comparison - convert to dates if possible
      try {
        const itemDate = new Date(fieldValue);
        const compareDate = new Date(pattern.pattern);
        return operator === 'before'
          ? itemDate < compareDate
          : itemDate > compareDate;
      } catch {
        return false;
      }

    default:
      return matchesPattern(stringValue, pattern);
  }
}

/**
 * Get nested field value using dot notation
 */
function getNestedFieldValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Generate search suggestions based on partial matches and typos
 */
export function generateSearchSuggestions(
  searchTerm: string,
  availableFields: string[],
  maxSuggestions: number = 5
): string[] {
  const suggestions: Array<{ field: string; score: number }> = [];

  for (const field of availableFields) {
    const score = calculateSimilarityScore(
      searchTerm.toLowerCase(),
      field.toLowerCase()
    );
    if (score > 0.3) {
      // Minimum similarity threshold
      suggestions.push({ field, score });
    }
  }

  // Sort by score (highest first) and return top suggestions
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions)
    .map(s => s.field);
}

/**
 * Calculate string similarity score (0-1, where 1 is identical)
 */
function calculateSimilarityScore(str1: string, str2: string): number {
  // Use Levenshtein distance for similarity
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);

  if (maxLength === 0) return 1;

  return 1 - distance / maxLength;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  // Calculate distances
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Check if a field name might be a wildcard pattern for field selection
 */
export function isFieldPattern(fieldName: string): boolean {
  return fieldName.includes('*') || fieldName.includes('?');
}

/**
 * Expand field patterns to matching field names
 */
export function expandFieldPatterns(
  patterns: string[],
  availableFields: string[]
): string[] {
  const expandedFields = new Set<string>();

  for (const pattern of patterns) {
    if (isFieldPattern(pattern)) {
      const compiledPattern = compilePattern(pattern, 'wildcard', {
        caseSensitive: false,
      });

      for (const field of availableFields) {
        if (matchesPattern(field, compiledPattern)) {
          expandedFields.add(field);
        }
      }
    } else {
      expandedFields.add(pattern);
    }
  }

  return Array.from(expandedFields);
}

/**
 * Validate pattern complexity to prevent performance issues
 */
export function validatePatternComplexity(
  pattern: string,
  maxStars: number = 10,
  maxQuestions: number = 20
): boolean {
  const starCount = (pattern.match(/\*/g) || []).length;
  const questionCount = (pattern.match(/\?/g) || []).length;

  return starCount <= maxStars && questionCount <= maxQuestions;
}
