/**
 * Utilities for handling standardized parameters
 */

import {
  StandardListParams,
  StandardGetParams,
  DetailLevel,
  DetailFieldMappings,
  EnterpriseErrorInfo,
  OutputFormat,
  ResponseOptimizationParams,
  CustomFieldInclusion,
} from '../types/parameter-types.js';
import { API_LIMITS } from '../constants.js';
import { ValidationError } from '../errors/index.js';
import { fieldSelector } from './field-selection.js';

/**
 * Apply default values and validate list parameters
 */
export function normalizeListParams(
  params: StandardListParams = {}
): StandardListParams & {
  limit: number;
  startWith: number;
  detail: DetailLevel;
  includeSubData: boolean;
  fields: string[];
  exclude: string[];
  validateFields: boolean;
  outputFormat: OutputFormat;
  truncateFields: string[];
  truncateIndicator: string;
  includeDescription: boolean;
  includeCustomFields: CustomFieldInclusion;
  includeCustomFieldsStrategy: CustomFieldInclusion;
  includeLinks: boolean;
  includeEmpty: boolean;
  includeMetadata: boolean;
} {
  const normalized = {
    limit: params.limit ?? API_LIMITS.DEFAULT_PAGE_SIZE,
    startWith: params.startWith ?? API_LIMITS.DEFAULT_OFFSET,
    detail: params.detail ?? 'basic',
    includeSubData: params.includeSubData ?? false,
    fields: params.fields ?? [],
    exclude: params.exclude ?? [],
    validateFields: params.validateFields ?? true,
    outputFormat: params.outputFormat ?? 'json',
    // Optimization parameters
    ...(params.maxLength !== undefined && { maxLength: params.maxLength }),
    truncateFields: params.truncateFields ?? [],
    truncateIndicator: params.truncateIndicator ?? '...',
    includeDescription: params.includeDescription ?? true,
    includeCustomFields: params.includeCustomFieldsStrategy ?? 'all',
    includeCustomFieldsStrategy: params.includeCustomFieldsStrategy ?? 'all',
    includeLinks: params.includeLinks ?? true,
    includeEmpty: params.includeEmpty ?? true,
    includeMetadata: params.includeMetadata ?? true,
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

  // Validate output format
  if (
    !['json', 'markdown', 'csv', 'summary'].includes(normalized.outputFormat)
  ) {
    throw new ValidationError(
      'Output format must be one of: json, markdown, csv, summary',
      'outputFormat'
    );
  }

  // Validate fields array
  if (normalized.fields.length > 0 && normalized.exclude.length > 0) {
    throw new ValidationError(
      'Cannot specify both fields and exclude parameters',
      'fields'
    );
  }

  // Validate optimization parameters
  if (normalized.maxLength !== undefined) {
    if (normalized.maxLength < 100 || normalized.maxLength > 50000) {
      throw new ValidationError(
        'maxLength must be between 100 and 50000 characters',
        'maxLength'
      );
    }
  }

  if (
    !['all', 'onlyWithValues', 'none'].includes(normalized.includeCustomFields)
  ) {
    throw new ValidationError(
      'includeCustomFieldsStrategy must be one of: all, onlyWithValues, none',
      'includeCustomFieldsStrategy'
    );
  }

  return normalized;
}

/**
 * Apply default values and validate get parameters
 */
export function normalizeGetParams(
  params: StandardGetParams = {}
): StandardGetParams & {
  detail: DetailLevel;
  includeSubData: boolean;
  fields: string[];
  exclude: string[];
  validateFields: boolean;
  outputFormat: OutputFormat;
  truncateFields: string[];
  truncateIndicator: string;
  includeDescription: boolean;
  includeCustomFields: CustomFieldInclusion;
  includeCustomFieldsStrategy: CustomFieldInclusion;
  includeLinks: boolean;
  includeEmpty: boolean;
  includeMetadata: boolean;
} {
  const normalized = {
    detail: params.detail ?? 'standard',
    includeSubData: params.includeSubData ?? false,
    fields: params.fields ?? [],
    exclude: params.exclude ?? [],
    validateFields: params.validateFields ?? true,
    outputFormat: params.outputFormat ?? 'json',
    // Optimization parameters
    ...(params.maxLength !== undefined && { maxLength: params.maxLength }),
    truncateFields: params.truncateFields ?? [],
    truncateIndicator: params.truncateIndicator ?? '...',
    includeDescription: params.includeDescription ?? true,
    includeCustomFields: params.includeCustomFieldsStrategy ?? 'all',
    includeCustomFieldsStrategy: params.includeCustomFieldsStrategy ?? 'all',
    includeLinks: params.includeLinks ?? true,
    includeEmpty: params.includeEmpty ?? true,
    includeMetadata: params.includeMetadata ?? true,
  };

  // Validate detail level
  if (!['basic', 'standard', 'full'].includes(normalized.detail)) {
    throw new ValidationError(
      'Detail must be one of: basic, standard, full',
      'detail'
    );
  }

  // Validate output format
  if (
    !['json', 'markdown', 'csv', 'summary'].includes(normalized.outputFormat)
  ) {
    throw new ValidationError(
      'Output format must be one of: json, markdown, csv, summary',
      'outputFormat'
    );
  }

  // Validate fields array
  if (normalized.fields.length > 0 && normalized.exclude.length > 0) {
    throw new ValidationError(
      'Cannot specify both fields and exclude parameters',
      'fields'
    );
  }

  // Validate optimization parameters
  if (normalized.maxLength !== undefined) {
    if (normalized.maxLength < 100 || normalized.maxLength > 50000) {
      throw new ValidationError(
        'maxLength must be between 100 and 50000 characters',
        'maxLength'
      );
    }
  }

  if (
    !['all', 'onlyWithValues', 'none'].includes(normalized.includeCustomFields)
  ) {
    throw new ValidationError(
      'includeCustomFieldsStrategy must be one of: all, onlyWithValues, none',
      'includeCustomFieldsStrategy'
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
  exclude?: string[],
  outputFormat?: OutputFormat,
  optimization?: ResponseOptimizationParams
): Partial<T> | string {
  let filteredData: Partial<T>;

  // If explicit fields are specified, use dynamic field selection
  if (fields && fields.length > 0) {
    // Validate fields if requested
    const validation = fieldSelector.validateFields(String(entityType), fields);
    if (!validation.valid && validation.suggestions) {
      // Log field validation issues for development (removed console.warn for production)
      // Invalid fields will be handled by the field selector internally
    }

    const selectConfig: {
      fields: string[];
      validateFields: true;
      exclude?: string[];
    } = {
      fields,
      validateFields: true,
    };
    if (exclude) {
      selectConfig.exclude = exclude;
    }
    filteredData = fieldSelector.selectFields(data, selectConfig) as Partial<T>;
  }
  // If exclude fields are specified, apply exclusion
  else if (exclude && exclude.length > 0) {
    filteredData = fieldSelector.selectFields(data, {
      exclude,
      validateFields: true,
    }) as Partial<T>;
  }
  // Fall back to detail level filtering with essential fields
  else {
    let fieldsToUse: string[];

    const predefinedFields = DetailFieldMappings[entityType]?.[detailLevel];
    if (predefinedFields) {
      fieldsToUse = [...predefinedFields];
    } else {
      // Use essential fields as fallback when no predefined mapping exists
      fieldsToUse = fieldSelector.getEssentialFields(String(entityType));
    }

    const selectConfig2: {
      fields: string[];
      validateFields: false;
      exclude?: string[];
    } = {
      fields: fieldsToUse,
      validateFields: false, // Skip validation for predefined fields
    };
    if (exclude) {
      selectConfig2.exclude = exclude;
    }
    filteredData = fieldSelector.selectFields(
      data,
      selectConfig2
    ) as Partial<T>;
  }

  // Apply response optimization if specified
  if (optimization) {
    filteredData = optimizeResponse(filteredData, optimization) as Partial<T>;
  }

  // Apply output formatting if specified
  if (outputFormat && outputFormat !== 'json') {
    return formatResponse(filteredData, outputFormat, String(entityType));
  }

  return filteredData;
}

/**
 * Filter object by specific fields, supporting dot notation for nested fields
 */
/**
 * @deprecated Use fieldSelector.selectFields() from field-selection.ts instead
 * Legacy field filtering function - kept for backward compatibility
 */
export function filterByFields<T extends Record<string, any>>(
  data: T,
  fields: string[]
): Partial<T> {
  return fieldSelector.selectFields(data, { fields }) as Partial<T>;
}

/**
 * Filter object by excluding specific fields
 */
/**
 * @deprecated Use fieldSelector.selectFields() with exclude option from field-selection.ts instead
 * Legacy field exclusion function - kept for backward compatibility
 */
export function filterByExclusion<T extends Record<string, any>>(
  data: T,
  excludeFields: string[]
): Partial<T> {
  return fieldSelector.selectFields(data, {
    exclude: excludeFields,
  }) as Partial<T>;
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

// Removed unused helper functions - functionality moved to field-selection.ts

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
  exclude?: string[],
  outputFormat?: OutputFormat,
  optimization?: ResponseOptimizationParams
): (Partial<T> | string)[] {
  return data.map(item =>
    filterByDetailLevel(
      item,
      entityType,
      detailLevel,
      fields,
      exclude,
      outputFormat,
      optimization
    )
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

/**
 * Format response data according to the specified output format
 */
export function formatResponse<T>(
  data: T,
  format: OutputFormat = 'json',
  entityType: string
): string | T {
  if (format === 'json') return JSON.stringify(data, null, 2);

  try {
    const formatters = {
      markdown: formatAsMarkdown,
      csv: formatAsCSV,
      summary: formatAsSummary,
    };

    return formatters[format](data, entityType);
  } catch {
    // Format conversion failed, fallback to JSON (removed console.warn for production)
    return JSON.stringify(data, null, 2); // Fallback to JSON string
  }
}

/**
 * Format data as Markdown
 */
function formatAsMarkdown(data: any, entityType: string): string {
  if (Array.isArray(data)) {
    return data
      .map(item => formatSingleItemMarkdown(item, entityType))
      .join('\n---\n');
  }
  return formatSingleItemMarkdown(data, entityType);
}

/**
 * Format single item as Markdown
 */
function formatSingleItemMarkdown(item: any, entityType: string): string {
  const templates: Record<string, (item: any) => string> = {
    feature: item =>
      `## ${item.name || item.id}\n**Status:** ${
        item.status?.name || 'N/A'
      }\n**Owner:** ${
        item.owner?.email || 'Unassigned'
      }\n**Description:** ${truncate(item.description, 100)}`,
    component: item =>
      `## ${item.name || item.id}\n**Product:** ${
        item.productId || 'N/A'
      }\n**Description:** ${item.description || 'No description'}`,
    note: item =>
      `## ${item.title || item.id}\n**Source:** ${
        item.source || 'Unknown'
      }\n**Content:** ${truncate(item.content, 150)}`,
    product: item =>
      `## ${item.name || item.id}\n**Description:** ${
        item.description || 'No description'
      }`,
    company: item =>
      `## ${item.name || item.id}\n**Domain:** ${
        item.domain || 'N/A'
      }\n**Description:** ${item.description || 'No description'}`,
    user: item =>
      `## ${item.name || item.email || item.id}\n**Email:** ${
        item.email || 'N/A'
      }\n**Company:** ${item.companyId || 'N/A'}`,
  };

  const formatter = templates[entityType];
  if (formatter) {
    return formatter(item);
  }

  // Generic markdown format for unknown entity types
  const title = item.name || item.title || item.id || 'Unknown';
  const fields = Object.entries(item)
    .filter(([key, value]) => key !== 'name' && key !== 'title' && value)
    .slice(0, 5) // Limit to first 5 fields
    .map(([key, value]) => `**${key}:** ${truncate(String(value), 50)}`)
    .join('\n');

  return `## ${title}\n${fields}`;
}

/**
 * Format data as CSV
 */
function formatAsCSV(data: any): string {
  if (!Array.isArray(data) || data.length === 0) return '';

  // Flatten nested objects using dot notation
  const flattened = data.map(item => flattenObject(item));
  const headers = Object.keys(flattened[0]);

  const csvContent = [
    headers.join(','),
    ...flattened.map(row =>
      headers.map(header => escapeCsvValue(row[header])).join(',')
    ),
  ].join('\n');

  return csvContent;
}

/**
 * Flatten nested object using dot notation
 */
function flattenObject(obj: any, prefix = ''): any {
  const flattened: any = {};
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      continue;
    }

    const newKey = prefix ? `${prefix}.${key}` : key;
    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      Object.assign(flattened, flattenObject(obj[key], newKey));
    } else {
      flattened[newKey] = Array.isArray(obj[key])
        ? obj[key].join('|')
        : obj[key];
    }
  }
  return flattened;
}

/**
 * Escape CSV values
 */
function escapeCsvValue(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Format data as Summary
 */
function formatAsSummary(data: any, entityType: string): string {
  if (Array.isArray(data)) {
    const count = data.length;
    const summaryStats = generateSummaryStats(data, entityType);
    return `📋 ${count} ${entityType}s found\n${summaryStats}\n\nItems:\n${data
      .map(item => `• ${item.name || item.title || item.id}`)
      .join('\n')}`;
  }

  // Single item summary
  const essential = extractEssentialFields(data, entityType);
  return Object.entries(essential)
    .map(([key, value]) => `${key}: ${value}`)
    .join(' | ');
}

/**
 * Generate summary statistics for array data
 */
function generateSummaryStats(data: any[], entityType: string): string {
  const stats: string[] = [];

  if (entityType === 'feature') {
    const statusCounts = countBy(data, 'status.name');
    if (statusCounts && Object.keys(statusCounts).length > 0) {
      stats.push(
        `Status: ${Object.entries(statusCounts)
          .map(([status, count]) => `${status}(${count})`)
          .join(', ')}`
      );
    }
  }

  if (entityType === 'note') {
    const sourceCounts = countBy(data, 'source');
    if (sourceCounts && Object.keys(sourceCounts).length > 0) {
      stats.push(
        `Sources: ${Object.entries(sourceCounts)
          .map(([source, count]) => `${source}(${count})`)
          .join(', ')}`
      );
    }
  }

  return stats.join('\n');
}

/**
 * Extract essential fields for summary view
 */
function extractEssentialFields(data: any, entityType: string): any {
  const fieldMaps: Record<string, string[]> = {
    feature: ['name', 'status.name', 'owner.email'],
    component: ['name', 'productId'],
    note: ['title', 'source'],
    product: ['name'],
    company: ['name', 'domain'],
    user: ['name', 'email'],
  };

  const essentialFields = fieldMaps[entityType] || ['name', 'id'];
  const result: any = {};

  essentialFields.forEach(field => {
    const value = getNestedValue(data, field.split('.'));
    if (value) {
      result[field] = value;
    }
  });

  return result;
}

/**
 * Count items by field value
 */
function countBy(data: any[], field: string): Record<string, number> {
  const counts: Record<string, number> = {};
  data.forEach(item => {
    const value = getNestedValue(item, field.split('.')) || 'Unknown';
    counts[value] = (counts[value] || 0) + 1;
  });
  return counts;
}

/**
 * Truncate text to specified length
 */
function truncate(text: string | null | undefined, length: number): string {
  if (!text) return 'N/A';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Response Optimization Functions
 */

/**
 * Optimize response data using truncation and conditional inclusion
 */
export function optimizeResponse<T>(
  data: T,
  optimization: ResponseOptimizationParams = {}
): T {
  if (!optimization || Object.keys(optimization).length === 0) {
    return data; // No optimization requested
  }

  let result = data;

  // Apply conditional inclusion first
  result = conditionallyIncludeFields(result, optimization);

  // Apply field truncation if specified
  result = applyFieldTruncation(result, optimization);

  return result;
}

/**
 * Apply conditional field inclusion based on optimization settings
 */
function conditionallyIncludeFields<T>(
  data: T,
  optimization: ResponseOptimizationParams
): T {
  if (!data || typeof data !== 'object') return data;

  let result = { ...data } as any;

  // Remove description if not included
  if (optimization.includeDescription === false) {
    delete result.description;
  }

  // Handle custom fields
  if (optimization.includeCustomFieldsStrategy === 'none') {
    delete result.customFields;
  } else if (optimization.includeCustomFieldsStrategy === 'onlyWithValues') {
    if (result.customFields && typeof result.customFields === 'object') {
      result.customFields = Object.entries(result.customFields)
        .filter(
          ([_, value]) => value !== null && value !== '' && value !== undefined
        )
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      // Remove customFields if no values remain
      if (Object.keys(result.customFields).length === 0) {
        delete result.customFields;
      }
    }
  }

  // Remove links if not included
  if (optimization.includeLinks === false) {
    delete result.links;
    delete result.relationships;
  }

  // Remove metadata if not included
  if (optimization.includeMetadata === false) {
    delete result.createdAt;
    delete result.updatedAt;
    delete result.version;
    delete result.lastModified;
    delete result.createdBy;
    delete result.updatedBy;
  }

  // Remove empty fields if not included
  if (optimization.includeEmpty === false) {
    result = removeEmptyFields(result);
  }

  return result;
}

/**
 * Apply field truncation based on optimization settings
 */
function applyFieldTruncation<T>(
  data: T,
  optimization: ResponseOptimizationParams
): T {
  if (
    !optimization.truncateFields ||
    optimization.truncateFields.length === 0
  ) {
    return data;
  }

  if (!data || typeof data !== 'object') return data;

  let result = { ...data } as any;
  const indicator = optimization.truncateIndicator || '...';

  // If maxLength is specified, calculate proportional truncation
  if (optimization.maxLength) {
    const currentLength = JSON.stringify(result).length;
    if (currentLength > optimization.maxLength) {
      result = proportionalTruncation(result, optimization);
    }
  } else {
    // Apply standard truncation to specified fields
    for (const field of optimization.truncateFields) {
      if (result[field] && typeof result[field] === 'string') {
        result[field] = truncateField(result[field], 500, indicator); // Default 500 char limit
      }
    }
  }

  return result;
}

/**
 * Truncate a single field with word preservation
 */
export function truncateField(
  value: string,
  maxLength: number,
  indicator: string = '...',
  preserveWords: boolean = true
): string {
  if (!value || value.length <= maxLength) return value;

  let truncated = value.substring(0, maxLength - indicator.length);

  if (preserveWords) {
    const lastSpace = truncated.lastIndexOf(' ');
    // Only preserve words if the last space is reasonably close to the end
    if (lastSpace > maxLength * 0.8) {
      truncated = truncated.substring(0, lastSpace);
    }
  }

  return truncated + indicator;
}

/**
 * Apply proportional truncation when total response exceeds maxLength
 */
function proportionalTruncation<T>(
  data: T,
  optimization: ResponseOptimizationParams
): T {
  if (!optimization.maxLength || !optimization.truncateFields) return data;

  const result = { ...data } as any;
  const currentLength = JSON.stringify(result).length;
  const excessLength = currentLength - optimization.maxLength;

  if (excessLength <= 0) return result;

  // Calculate lengths of truncatable fields
  const fieldLengths = optimization.truncateFields
    .map(field => ({
      field,
      length: typeof result[field] === 'string' ? result[field].length : 0,
    }))
    .filter(f => f.length > 0);

  const totalTruncatableLength = fieldLengths.reduce(
    (sum, f) => sum + f.length,
    0
  );

  if (totalTruncatableLength === 0) return result;

  const indicator = optimization.truncateIndicator || '...';

  // Apply proportional reduction to each field
  fieldLengths.forEach(({ field, length }) => {
    const reductionRatio = length / totalTruncatableLength;
    const targetReduction = Math.floor(excessLength * reductionRatio);
    const newLength = Math.max(100, length - targetReduction); // Minimum 100 chars

    if (result[field] && typeof result[field] === 'string') {
      result[field] = truncateField(result[field], newLength, indicator);
    }
  });

  return result;
}

/**
 * Remove fields with null, undefined, or empty string values
 */
function removeEmptyFields<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  const result = {} as any;

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleaned = removeEmptyFields(value);
        if (Object.keys(cleaned).length > 0) {
          result[key] = cleaned;
        }
      } else if (Array.isArray(value)) {
        const cleanedArray = value.filter(
          item => item !== null && item !== undefined && item !== ''
        );
        if (cleanedArray.length > 0) {
          result[key] = cleanedArray;
        }
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

/**
 * Normalize optimization parameters with defaults and validation
 */
export function normalizeOptimizationParams(
  params: ResponseOptimizationParams = {}
): ResponseOptimizationParams {
  const normalized: ResponseOptimizationParams = {
    truncateFields: params.truncateFields || [],
    truncateIndicator: params.truncateIndicator || '...',
    includeDescription: params.includeDescription ?? true,
    includeCustomFieldsStrategy: params.includeCustomFieldsStrategy || 'all',
    includeLinks: params.includeLinks ?? true,
    includeEmpty: params.includeEmpty ?? true,
    includeMetadata: params.includeMetadata ?? true,
  };

  // Only add maxLength if it's defined
  if (params.maxLength !== undefined) {
    normalized.maxLength = params.maxLength;
  }

  // Validate maxLength
  if (normalized.maxLength !== undefined) {
    if (normalized.maxLength < 100 || normalized.maxLength > 50000) {
      throw new ValidationError(
        'maxLength must be between 100 and 50000 characters',
        'maxLength'
      );
    }
  }

  // Validate custom field inclusion
  if (
    normalized.includeCustomFieldsStrategy &&
    !['all', 'onlyWithValues', 'none'].includes(
      normalized.includeCustomFieldsStrategy
    )
  ) {
    throw new ValidationError(
      'includeCustomFieldsStrategy must be one of: all, onlyWithValues, none',
      'includeCustomFieldsStrategy'
    );
  }

  return normalized;
}
