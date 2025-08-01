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
    outputFormat: params.outputFormat ?? 'json',
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
    outputFormat: params.outputFormat ?? 'json',
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
  outputFormat?: OutputFormat
): Partial<T> | string {
  // Apply field filtering first
  let filteredData: Partial<T>;

  // If explicit fields are specified, use dynamic field selection
  if (fields && fields.length > 0) {
    filteredData = filterByFields(data, fields);
  }
  // If exclude fields are specified, apply exclusion
  else if (exclude && exclude.length > 0) {
    filteredData = filterByExclusion(data, exclude);
  }
  // Fall back to detail level filtering
  else {
    const fieldsForLevel = DetailFieldMappings[entityType]?.[detailLevel];
    if (!fieldsForLevel) {
      // If no mapping exists, return full data
      filteredData = data;
    } else {
      filteredData = filterByFields(data, [...fieldsForLevel]);
    }
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
  exclude?: string[],
  outputFormat?: OutputFormat
): (Partial<T> | string)[] {
  return data.map(item =>
    filterByDetailLevel(
      item,
      entityType,
      detailLevel,
      fields,
      exclude,
      outputFormat
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
  if (format === 'json') return data;

  try {
    const formatters = {
      markdown: formatAsMarkdown,
      csv: formatAsCSV,
      summary: formatAsSummary,
    };

    return formatters[format](data, entityType);
  } catch (error) {
    console.warn(
      `Format conversion failed for ${format}, falling back to JSON:`,
      error
    );
    return data; // Fallback to JSON
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
