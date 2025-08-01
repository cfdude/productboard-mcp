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
  | 'after'
  | 'regex'
  | 'wildcard';

export type OutputMode = 'ids-only' | 'summary' | 'full';
export type DetailLevel = 'basic' | 'standard' | 'full';

export interface SearchParams {
  entityType: EntityType | EntityType[];
  filters?: Record<string, any>;
  operators?: Record<string, SearchOperator>;
  output?: string[] | OutputMode;
  limit?: number;
  startWith?: number;
  detail?: DetailLevel;
  includeSubData?: boolean;
  includeCustomFields?: boolean;
  instance?: string;
  workspaceId?: string;
  // Enhanced search parameters
  patternMatchMode?: 'exact' | 'wildcard' | 'regex';
  caseSensitive?: boolean;
  suggestAlternatives?: boolean;
  maxSuggestions?: number;
}

export interface NormalizedSearchParams
  extends Required<Omit<SearchParams, 'instance' | 'workspaceId'>> {
  instance?: string;
  workspaceId?: string;
  entityTypes: EntityType[]; // Always normalized to array
}

export interface SearchContext {
  entityType: EntityType | EntityType[];
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
  suggestions?: SearchSuggestion[];
}

/**
 * Enhanced search results with suggestions and pattern information
 */
export interface EnhancedSearchResults extends SearchResults {
  suggestions?: SearchSuggestion[];
  patternInfo?: PatternInfo;
}

/**
 * Search suggestion for alternative queries
 */
export interface SearchSuggestion {
  type: 'field' | 'value' | 'operator' | 'entity';
  original: string;
  suggested: string;
  reason: string;
  confidence: number;
}

/**
 * Information about pattern matching applied to the search
 */
export interface PatternInfo {
  patternsUsed: boolean;
  wildcardFields: string[];
  regexFields: string[];
  complexityScore: number;
}

export interface SearchResponse {
  success: boolean;
  data: any[];
  metadata: {
    totalRecords: number;
    returnedRecords: number;
    searchCriteria: {
      entityType: EntityType | EntityType[];
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
