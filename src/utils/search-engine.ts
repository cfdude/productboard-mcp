/**
 * Core search engine that handles entity searches and result processing
 */
import {
  SearchParams,
  NormalizedSearchParams,
  SearchResults,
  EntityType,
  FilterValidationResult,
} from '../types/search-types.js';
import { ValidationError } from '../errors/index.js';
import { EntityFieldMappings } from './search-field-mappings.js';
import { OutputProcessor } from './search-output-processor.js';
import { handleFeaturesTool } from '../tools/features.js';
import { handleNotesTool } from '../tools/notes.js';
import { handleCompaniesTool } from '../tools/companies.js';
import { handleUsersTool } from '../tools/users.js';
import { handleReleasesTool } from '../tools/releases.js';
import { handleObjectivesTool } from '../tools/objectives.js';
import { handleCustomFieldsTool } from '../tools/custom-fields.js';
import { handleWebhooksTool } from '../tools/webhooks.js';
import { handlePluginIntegrationsTool } from '../tools/plugin-integrations.js';
import { handleJiraIntegrationsTool } from '../tools/jira-integrations.js';

export class SearchEngine {
  private entityMappings = EntityFieldMappings;
  private outputProcessor = new OutputProcessor();
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 300000; // 5 minutes

  /**
   * Validate and normalize search parameters
   */
  async validateAndNormalizeParams(
    params: SearchParams
  ): Promise<NormalizedSearchParams> {
    // Validate entity type
    if (!this.entityMappings[params.entityType]) {
      throw new ValidationError(
        `Unsupported entity type: ${params.entityType}. Supported types: ${Object.keys(this.entityMappings).join(', ')}`,
        'entityType'
      );
    }

    // Output parameter is already parsed at the index.ts level
    let output = params.output || 'full';

    // Additional safety check: if output is still a stringified array, parse it here
    if (
      typeof output === 'string' &&
      output.startsWith('[') &&
      output.endsWith(']')
    ) {
      try {
        const parsed = JSON.parse(output);
        if (Array.isArray(parsed)) {
          output = parsed;
          console.error(
            '[DEBUG SearchEngine] Emergency parsed stringified array:',
            parsed
          );
        }
      } catch (e) {
        console.error(
          '[DEBUG SearchEngine] Failed emergency parse:',
          (e as Error).message
        );
      }
    }

    // Normalize parameters with defaults
    const normalized: NormalizedSearchParams = {
      entityType: params.entityType,
      filters: params.filters || {},
      operators: params.operators || {},
      output: output,
      limit: Math.min(Math.max(params.limit || 50, 1), 100), // Ensure minimum limit of 1
      startWith: Math.max(params.startWith || 0, 0),
      detail: params.detail || 'standard',
      includeSubData: params.includeSubData || false,
      instance: params.instance,
      workspaceId: params.workspaceId,
    };

    // Validate filters
    const filterValidation = this.validateFilters(
      normalized.entityType,
      normalized.filters
    );
    if (!filterValidation.isValid) {
      throw new ValidationError(
        `Invalid filters: ${filterValidation.errors.join(', ')}`,
        'filters'
      );
    }

    // Use normalized filters
    normalized.filters = filterValidation.normalizedFilters;

    // Validate operators
    const operatorValidation = this.validateOperators(normalized.operators);
    if (!operatorValidation.isValid) {
      throw new ValidationError(
        `Invalid operators: ${operatorValidation.errors.join(', ')}`,
        'operators'
      );
    }

    // Validate output parameter
    if (Array.isArray(normalized.output)) {
      const outputValidation = this.validateOutputFields(
        normalized.entityType,
        normalized.output
      );
      if (!outputValidation.isValid) {
        throw new ValidationError(
          `Invalid output fields: ${outputValidation.errors.join(', ')}`,
          'output'
        );
      }
    }

    return normalized;
  }

  /**
   * Execute search against the appropriate entity endpoint
   */
  async executeEntitySearch(
    context: any,
    params: NormalizedSearchParams
  ): Promise<SearchResults> {
    const startTime = Date.now();

    // Generate cache key
    const cacheKey = this.generateCacheKey(params);

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return {
          ...cached.data,
          queryTimeMs: Date.now() - startTime,
          cacheHit: true,
        };
      } else {
        this.cache.delete(cacheKey);
      }
    }

    try {
      const entityConfig = this.entityMappings[params.entityType];

      // Build parameters for the underlying list function
      const listParams = this.buildListParams(params);

      // Route to appropriate handler based on entity type
      const response = await this.routeToEntityHandler(
        params.entityType,
        entityConfig.listFunction,
        listParams
      );

      // Parse response from the handler
      const parsedResponse = this.parseHandlerResponse(response);

      const queryTime = Date.now() - startTime;

      const results = {
        data: parsedResponse.data || [],
        totalRecords:
          parsedResponse.totalRecords || parsedResponse.data?.length || 0,
        hasMore: parsedResponse.hasMore || false,
        warnings: parsedResponse.warnings || [],
        queryTimeMs: queryTime,
      };

      // Cache the results
      this.cache.set(cacheKey, {
        data: results,
        timestamp: Date.now(),
      });

      return results;
    } catch (error: any) {
      // Re-throw with additional context
      throw new Error(
        `Entity search failed for ${params.entityType}: ${error.message}`
      );
    }
  }

  /**
   * Process raw results with filtering and output formatting
   */
  async processResults(
    rawResults: SearchResults,
    params: NormalizedSearchParams
  ): Promise<SearchResults> {
    let processedData = rawResults.data;
    const warnings = [...rawResults.warnings];

    // Apply client-side filtering for complex operators
    processedData = this.applyClientSideFiltering(processedData, params);

    // Check for parameter conflicts and add warnings
    if (params.output !== 'full' && params.detail !== 'standard') {
      warnings.push(
        `output parameter overrides detail level "${params.detail}" - exact fields and order determined by output specification`
      );
    }

    // Apply output processing
    if (params.output !== 'full') {
      console.error(
        '[DEBUG SearchEngine processResults] About to call outputProcessor.processOutput with:',
        params.output,
        'type:',
        typeof params.output,
        'isArray:',
        Array.isArray(params.output)
      );

      processedData = this.outputProcessor.processOutput(
        processedData,
        params.entityType,
        params.output
      );

      console.error(
        '[DEBUG SearchEngine processResults] After outputProcessor, got',
        processedData.length,
        'items. First item keys:',
        processedData.length > 0 ? Object.keys(processedData[0]) : 'none'
      );
    }

    return {
      ...rawResults,
      data: processedData,
      warnings,
    };
  }

  /**
   * Validate filter fields and values
   */
  private validateFilters(
    entityType: EntityType,
    filters: Record<string, any>
  ): FilterValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const normalizedFilters: Record<string, any> = {};

    for (const [field, value] of Object.entries(filters)) {
      // Check if field is searchable
      if (!this.isFieldSearchable(entityType, field)) {
        errors.push(`Field "${field}" is not searchable for ${entityType}`);
        continue;
      }

      // Normalize filter value
      normalizedFilters[field] = this.normalizeFilterValue(value);

      // Add warnings for potentially problematic filters
      if (value === '' || value === null || value === undefined) {
        warnings.push(`Searching for empty/missing values in field "${field}"`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      normalizedFilters,
    };
  }

  /**
   * Check if a field is searchable for the given entity type
   */
  private isFieldSearchable(entityType: EntityType, field: string): boolean {
    const entityConfig = this.entityMappings[entityType];
    if (!entityConfig) return false;

    // Direct field match
    if (entityConfig.searchableFields.includes(field)) {
      return true;
    }

    // Check for dot notation fields (e.g., "owner.email")
    const baseField = field.split('.')[0];
    return entityConfig.searchableFields.some(
      searchableField =>
        searchableField.startsWith(baseField + '.') ||
        searchableField === baseField
    );
  }

  /**
   * Validate output fields
   */
  private validateOutputFields(
    entityType: EntityType,
    fields: string[]
  ): FilterValidationResult {
    const errors: string[] = [];

    for (const field of fields) {
      if (!this.isFieldSearchable(entityType, field)) {
        errors.push(
          `Output field "${field}" is not available for ${entityType}`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
      normalizedFilters: {},
    };
  }

  /**
   * Validate operator fields and values
   */
  private validateOperators(
    operators: Record<string, string>
  ): FilterValidationResult {
    const validOperators = [
      'equals',
      'contains',
      'isEmpty',
      'startsWith',
      'endsWith',
      'before',
      'after',
    ];
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const [field, operator] of Object.entries(operators)) {
      if (!validOperators.includes(operator)) {
        errors.push(
          `Invalid operator "${operator}" for field "${field}". Valid operators: ${validOperators.join(', ')}`
        );
      }

      // Add warnings for operators that might not work as expected
      if (operator === 'isEmpty' && field in operators) {
        warnings.push(
          `Using "isEmpty" operator for field "${field}" - filter value will be ignored`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      normalizedFilters: {},
    };
  }

  /**
   * Build parameters for the underlying list function
   */
  private buildListParams(params: NormalizedSearchParams): any {
    const listParams: any = {
      limit: params.limit,
      startWith: params.startWith,
      detail: params.detail,
      includeSubData: params.includeSubData,
      instance: params.instance,
      workspaceId: params.workspaceId,
    };

    // Add entity-specific filters
    for (const [field, value] of Object.entries(params.filters)) {
      if (this.canFilterServerSide(params.entityType, field)) {
        listParams[this.mapFilterToApiParam(params.entityType, field)] = value;
      }
    }

    return listParams;
  }

  /**
   * Check if a filter can be applied server-side
   */
  private canFilterServerSide(entityType: EntityType, field: string): boolean {
    const entityConfig = this.entityMappings[entityType];
    return entityConfig.serverSideFilters?.includes(field) || false;
  }

  /**
   * Map filter field to API parameter name
   */
  private mapFilterToApiParam(entityType: EntityType, field: string): string {
    const entityConfig = this.entityMappings[entityType];
    return entityConfig.filterMappings?.[field] || field;
  }

  /**
   * Route to appropriate entity handler
   */
  private async routeToEntityHandler(
    entityType: EntityType,
    functionName: string,
    params: any
  ): Promise<any> {
    switch (entityType) {
      case 'features':
      case 'products':
      case 'components':
        return await handleFeaturesTool(functionName, params);

      case 'notes':
        return await handleNotesTool(functionName, params);

      case 'companies':
        return await handleCompaniesTool(functionName, params);

      case 'users':
        return await handleUsersTool(functionName, params);

      case 'releases':
      case 'release_groups':
        return await handleReleasesTool(functionName, params);

      case 'objectives':
      case 'initiatives':
      case 'key_results':
        return await handleObjectivesTool(functionName, params);

      case 'custom_fields':
        return await handleCustomFieldsTool(functionName, params);

      case 'webhooks':
        return await handleWebhooksTool(functionName, params);

      case 'plugin_integrations':
        return await handlePluginIntegrationsTool(functionName, params);

      case 'jira_integrations':
        return await handleJiraIntegrationsTool(functionName, params);

      default:
        throw new Error(`No handler available for entity type: ${entityType}`);
    }
  }

  /**
   * Parse response from tool handlers
   */
  private parseHandlerResponse(response: any): any {
    if (response?.content?.[0]?.text) {
      try {
        const parsed = JSON.parse(response.content[0].text);
        return parsed;
      } catch {
        return { data: [], totalRecords: 0, hasMore: false };
      }
    }
    return { data: [], totalRecords: 0, hasMore: false };
  }

  /**
   * Apply client-side filtering for complex operators
   */
  private applyClientSideFiltering(
    data: any[],
    params: NormalizedSearchParams
  ): any[] {
    let filtered = data;

    for (const [field, value] of Object.entries(params.filters)) {
      if (this.canFilterServerSide(params.entityType, field)) {
        continue; // Already filtered server-side
      }

      const operator = params.operators[field] || 'equals';
      filtered = filtered.filter(item =>
        this.applyFilter(item, field, value, operator)
      );
    }

    return filtered;
  }

  /**
   * Apply individual filter to an item
   */
  private applyFilter(
    item: any,
    field: string,
    value: any,
    operator: string
  ): boolean {
    const fieldValue = this.getNestedFieldValue(item, field);

    switch (operator) {
      case 'equals':
        return fieldValue === value;

      case 'contains':
        return (
          fieldValue &&
          fieldValue
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase())
        );

      case 'isEmpty':
        return (
          !fieldValue ||
          fieldValue === '' ||
          fieldValue === null ||
          fieldValue === undefined
        );

      case 'startsWith':
        return (
          fieldValue &&
          fieldValue
            .toString()
            .toLowerCase()
            .startsWith(value.toString().toLowerCase())
        );

      case 'endsWith':
        return (
          fieldValue &&
          fieldValue
            .toString()
            .toLowerCase()
            .endsWith(value.toString().toLowerCase())
        );

      default:
        return fieldValue === value;
    }
  }

  /**
   * Get nested field value using dot notation
   */
  private getNestedFieldValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Normalize filter values
   */
  private normalizeFilterValue(value: any): any {
    if (value === '' || value === null || value === undefined) {
      return '';
    }
    return value;
  }

  /**
   * Generate cache key from search parameters
   */
  private generateCacheKey(params: NormalizedSearchParams): string {
    return JSON.stringify({
      entityType: params.entityType,
      filters: params.filters,
      operators: params.operators,
      output: params.output,
      limit: params.limit,
      startWith: params.startWith,
      detail: params.detail,
      includeSubData: params.includeSubData,
      instance: params.instance,
      workspaceId: params.workspaceId,
    });
  }
}
