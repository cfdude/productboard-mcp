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
  _entityType: keyof typeof DetailFieldMappings,
  _detailLevel: DetailLevel
): Partial<T> {
  // For now, return full data until we have correct field mappings
  // Field mappings will be implemented based on actual API response structure
  return data;
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
