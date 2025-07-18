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
  };

  // Validate detail level
  if (!['basic', 'standard', 'full'].includes(normalized.detail)) {
    throw new ValidationError(
      'Detail must be one of: basic, standard, full',
      'detail'
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
  detailLevel: DetailLevel
): Partial<T> {
  const fieldMapping = DetailFieldMappings[entityType];
  if (!fieldMapping) {
    // If no mapping exists, return full data
    return data;
  }

  const fields = fieldMapping[detailLevel];
  if (!fields) {
    return data;
  }

  const result: Record<string, any> = {};

  for (const field of fields) {
    if (field.includes('.')) {
      // Handle nested fields like 'status.name'
      const parts = field.split('.');
      let value = data;
      let currentPath = '';

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        currentPath = currentPath ? `${currentPath}.${part}` : part;

        if (i === parts.length - 1) {
          // Last part - set the value
          setNestedValue(result, currentPath, value?.[part]);
        } else {
          // Intermediate part - traverse
          value = value?.[part];
          if (!value) break;
        }
      }
    } else {
      // Simple field
      if (field in data) {
        result[field] = data[field];
      }
    }
  }

  return result as Partial<T>;
}

/**
 * Set a nested value in an object using dot notation
 */
function setNestedValue(
  obj: Record<string, any>,
  path: string,
  value: any
): void {
  const parts = path.split('.');
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
}

/**
 * Filter array of items by detail level
 */
export function filterArrayByDetailLevel<T extends Record<string, any>>(
  data: T[],
  entityType: keyof typeof DetailFieldMappings,
  detailLevel: DetailLevel
): Partial<T>[] {
  return data.map(item => filterByDetailLevel(item, entityType, detailLevel));
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
