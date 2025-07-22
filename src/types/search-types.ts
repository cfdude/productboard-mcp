/**
 * Type definitions for the universal search system
 */

export type EntityType =
  | 'features'
  | 'notes'
  | 'companies'
  | 'users'
  | 'products'
  | 'components'
  | 'releases'
  | 'release_groups'
  | 'objectives'
  | 'initiatives'
  | 'key_results'
  | 'custom_fields'
  | 'webhooks'
  | 'plugin_integrations'
  | 'jira_integrations';

export type SearchOperator =
  | 'equals'
  | 'contains'
  | 'isEmpty'
  | 'startsWith'
  | 'endsWith'
  | 'before'
  | 'after';

export type OutputMode = 'ids-only' | 'summary' | 'full';
export type DetailLevel = 'basic' | 'standard' | 'full';

export interface SearchParams {
  entityType: EntityType;
  filters?: Record<string, any>;
  operators?: Record<string, SearchOperator>;
  output?: string[] | OutputMode;
  limit?: number;
  startWith?: number;
  detail?: DetailLevel;
  includeSubData?: boolean;
  instance?: string;
  workspaceId?: string;
}

export interface NormalizedSearchParams
  extends Required<Omit<SearchParams, 'instance' | 'workspaceId'>> {
  instance?: string;
  workspaceId?: string;
}

export interface SearchContext {
  entityType: EntityType;
  totalRecords: number;
  returnedRecords: number;
  filters: Record<string, any>;
  output?: string[] | OutputMode;
  detail: DetailLevel;
  warnings: string[];
  hasMore: boolean;
  queryTimeMs: number;
}

export interface SearchResults {
  data: any[];
  totalRecords: number;
  hasMore: boolean;
  warnings: string[];
  queryTimeMs: number;
  cacheHit?: boolean;
}

export interface SearchResponse {
  success: boolean;
  data: any[];
  metadata: {
    totalRecords: number;
    returnedRecords: number;
    searchCriteria: {
      entityType: EntityType;
      filters: Record<string, any>;
      output?: string[] | OutputMode;
      detail: DetailLevel;
    };
    message: string;
    warnings?: string[];
    hints?: string[];
    performance: {
      queryTimeMs: number;
      cacheHit: boolean;
    };
  };
  pagination?: {
    hasNext: boolean;
    nextOffset?: number;
    totalPages?: number;
  };
}

export interface EntityFieldMapping {
  [entityType: string]: {
    searchableFields: string[];
    displayNames: Record<string, string>;
    summaryFields: string[];
    endpoint: string;
    listFunction: string;
  };
}

export interface FilterValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  normalizedFilters: Record<string, any>;
}
