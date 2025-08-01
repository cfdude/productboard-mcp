/**
 * Utilities for handling standardized parameters
 */

import {
  StandardListParams,
  StandardGetParams,
  DetailLevel,
  DetailFieldMappings,
  EnterpriseErrorInfo,
} from '../types/parameter-types.js';
import { ValidationError } from '../errors/index.js';

/**
 * Apply default values and validate list parameters
 */
export function normalizeListParams(
  params: StandardListParams = {}
): Required<StandardListParams> {
  const normalized = {
    limit: params.limit ?? 100,
    startWith: params.startWith ?? 0,
    detail: params.detail ?? 'basic',
    includeSubData: params.includeSubData ?? false,
    fields: params.fields ?? [],
    exclude: params.exclude ?? [],
    validateFields: params.validateFields ?? true,
  };

  // Validate limit
  if (normalized.limit < 1 || normalized.limit > 100) {
    throw new ValidationError('Limit must be between 1 and 100', 'limit');
  }

  // Validate startWith
  if (normalized.startWith < 0) {
    throw new ValidationError('startWith must be non-negative', 'startWith');
  }

  // Validate detail level
  if (!['basic', 'standard', 'full'].includes(normalized.detail)) {
    throw new ValidationError(
      'Detail must be one of: basic, standard, full',
      'detail'
    );
  }

  // Validate fields array
  if (normalized.fields.length > 0 && normalized.exclude.length > 0) {
    throw new ValidationError(
      'Cannot specify both fields and exclude parameters',
      'fields'
    );
  }

  return normalized;
}

/**
 * Apply default values and validate get parameters
 */
export function normalizeGetParams(
  params: StandardGetParams = {}
): Required<StandardGetParams> {
  const normalized = {
    detail: params.detail ?? 'standard',
    includeSubData: params.includeSubData ?? false,
    fields: params.fields ?? [],
    exclude: params.exclude ?? [],
    validateFields: params.validateFields ?? true,
  };

  // Validate detail level
  if (!['basic', 'standard', 'full'].includes(normalized.detail)) {
    throw new ValidationError(
      'Detail must be one of: basic, standard, full',
      'detail'
    );
  }

  // Validate fields array
  if (normalized.fields.length > 0 && normalized.exclude.length > 0) {
    throw new ValidationError(
      'Cannot specify both fields and exclude parameters',
      'fields'
    );
  }

  return normalized;
}

/**
 * Filter response data based on detail level
 */
export function filterByDetailLevel<T extends Record<string, any>>(
  data: T,
  entityType: keyof typeof DetailFieldMappings,
  detailLevel: DetailLevel,
  fields?: string[],
  exclude?: string[]
): Partial<T> {
  // If explicit fields are specified, use dynamic field selection
  if (fields && fields.length > 0) {
    return filterByFields(data, fields);
  }

  // If exclude fields are specified, apply exclusion
  if (exclude && exclude.length > 0) {
    return filterByExclusion(data, exclude);
  }

  // Fall back to detail level filtering
  const fieldsForLevel = DetailFieldMappings[entityType]?.[detailLevel];
  if (!fieldsForLevel) {
    // If no mapping exists, return full data
    return data;
  }

  return filterByFields(data, [...fieldsForLevel]);
}

/**
 * Filter object by specific fields, supporting dot notation for nested fields
 */
export function filterByFields<T extends Record<string, any>>(
  data: T,
  fields: string[]
): Partial<T> {
  const result: any = {};

  for (const field of fields) {
    if (field.includes('.')) {
      // Handle nested field selection (e.g., "timeframe.startDate")
      const fieldPath = field.split('.');
      const topLevelField = fieldPath[0];

      if (data[topLevelField] && typeof data[topLevelField] === 'object') {
        if (!result[topLevelField]) {
          result[topLevelField] = {};
        }

        // Extract nested value
        const nestedValue = getNestedValue(
          data[topLevelField],
          fieldPath.slice(1)
        );
        if (nestedValue !== undefined) {
          setNestedValue(
            result[topLevelField],
            fieldPath.slice(1),
            nestedValue
          );
        }
      }
    } else {
      // Handle direct field selection
      if (data[field] !== undefined) {
        result[field] = data[field];
      }
    }
  }

  return result;
}

/**
 * Filter object by excluding specific fields
 */
export function filterByExclusion<T extends Record<string, any>>(
  data: T,
  excludeFields: string[]
): Partial<T> {
  const result = { ...data };

  for (const field of excludeFields) {
    if (field.includes('.')) {
      // Handle nested field exclusion
      const fieldPath = field.split('.');
      const topLevelField = fieldPath[0];

      if (result[topLevelField] && typeof result[topLevelField] === 'object') {
        (result as any)[topLevelField] = { ...result[topLevelField] };
        deleteNestedValue(result[topLevelField], fieldPath.slice(1));
      }
    } else {
      // Handle direct field exclusion
      delete result[field];
    }
  }

  return result;
}

/**
 * Get nested value from object using field path
 */
function getNestedValue(obj: any, path: string[]): any {
  let current = obj;
  for (const key of path) {
    if (current && typeof current === 'object' && current[key] !== undefined) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Set nested value in object using field path
 */
function setNestedValue(obj: any, path: string[], value: any): void {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[path[path.length - 1]] = value;
}

/**
 * Delete nested value from object using field path
 */
function deleteNestedValue(obj: any, path: string[]): void {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!current[key] || typeof current[key] !== 'object') {
      return; // Path doesn't exist
    }
    current = current[key];
  }
  delete current[path[path.length - 1]];
}

/**
 * Validate field names against entity schema and return suggestions
 */
export function validateFieldNames(
  entityType: keyof typeof DetailFieldMappings,
  requestedFields: string[]
): {
  valid: string[];
  invalid: string[];
  suggestions: Array<{ field: string; suggestion: string }>;
} {
  const entityMapping = DetailFieldMappings[entityType];
  if (!entityMapping) {
    return { valid: requestedFields, invalid: [], suggestions: [] };
  }

  // Get all valid fields from all detail levels
  const allValidFields = [
    ...entityMapping.basic,
    ...entityMapping.standard,
    ...entityMapping.full,
  ];

  const validFields: string[] = [];
  const invalidFields: string[] = [];
  const suggestions: Array<{ field: string; suggestion: string }> = [];

  for (const field of requestedFields) {
    const baseField = field.split('.')[0]; // For nested fields, check base field

    if (allValidFields.some(validField => validField.startsWith(baseField))) {
      validFields.push(field);
    } else {
      invalidFields.push(field);

      // Find closest match for suggestion
      const suggestion = findClosestFieldMatch(baseField, allValidFields);
      if (suggestion) {
        suggestions.push({ field, suggestion });
      }
    }
  }

  return { valid: validFields, invalid: invalidFields, suggestions };
}

/**
 * Find closest field match using simple string similarity
 */
function findClosestFieldMatch(
  field: string,
  validFields: string[]
): string | null {
  let bestMatch = null;
  let bestScore = 0;

  for (const validField of validFields) {
    const score = calculateStringSimilarity(
      field.toLowerCase(),
      validField.toLowerCase()
    );
    if (score > bestScore && score > 0.6) {
      // Minimum similarity threshold
      bestScore = score;
      bestMatch = validField;
    }
  }

  return bestMatch;
}

/**
 * Calculate string similarity using simple character matching
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const maxLen = Math.max(len1, len2);

  if (maxLen === 0) return 1;

  let matches = 0;
  for (let i = 0; i < Math.min(len1, len2); i++) {
    if (str1[i] === str2[i]) matches++;
  }

  return matches / maxLen;
}

/**
 * Filter array of items by detail level
 */
export function filterArrayByDetailLevel<T extends Record<string, any>>(
  data: T[],
  entityType: keyof typeof DetailFieldMappings,
  detailLevel: DetailLevel,
  fields?: string[],
  exclude?: string[]
): Partial<T>[] {
  return data.map(item =>
    filterByDetailLevel(item, entityType, detailLevel, fields, exclude)
  );
}

/**
 * Check if error is due to enterprise feature limitation
 */
export function isEnterpriseError(error: any): EnterpriseErrorInfo {
  const errorMessage = error?.message?.toLowerCase() || '';
  const statusCode = error?.response?.status;

  // Common patterns for enterprise feature errors
  const enterprisePatterns = [
    'enterprise',
    'subscription',
    'plan',
    'not available',
    'upgrade required',
    'premium feature',
  ];

  const isEnterprise =
    statusCode === 403 ||
    statusCode === 402 || // Payment Required
    enterprisePatterns.some(pattern => errorMessage.includes(pattern));

  if (isEnterprise) {
    return {
      isEnterpriseFeature: true,
      message:
        'This is an enterprise subscription feature only. Please upgrade your plan to access this functionality.',
      originalError: error,
    };
  }

  return {
    isEnterpriseFeature: false,
    message: error?.message || 'Unknown error occurred',
    originalError: error,
  };
}

/**
 * Convert old pagination params to new format
 */
export function convertPaginationParams(params: any): {
  limit?: number;
  startWith?: number;
} {
  const result: { limit?: number; startWith?: number } = {};

  // Handle pageLimit -> limit conversion
  if ('pageLimit' in params) {
    result.limit = params.pageLimit;
  } else if ('limit' in params) {
    result.limit = params.limit;
  }

  // Handle pageOffset -> startWith conversion
  if ('pageOffset' in params) {
    result.startWith = params.pageOffset;
  } else if ('startWith' in params) {
    result.startWith = params.startWith;
  }

  return result;
}
