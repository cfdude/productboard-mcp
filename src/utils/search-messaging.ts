/**
 * Intelligent message generation for search results
 */
import { SearchContext, EntityType } from '../types/search-types.js';
import { EntityFieldMappings } from './search-field-mappings.js';

export class SearchMessageGenerator {
  private entityMappings = EntityFieldMappings;

  /**
   * Generate comprehensive message for search results
   */
  generateMessage(context: SearchContext): string {
    const parts: string[] = [];

    // Core result summary
    parts.push(this.generateResultSummary(context));

    // Filter explanation
    if (Object.keys(context.filters).length > 0) {
      parts.push(this.generateFilterDescription(context));
    }

    // Parameter conflicts/warnings
    if (context.warnings.length > 0) {
      parts.push(this.generateWarningsMessage(context));
    }

    // Pagination info
    if (context.hasMore) {
      parts.push(this.generatePaginationHint(context));
    }

    return parts.join('. ');
  }

  /**
   * Generate contextual hints for better usage
   */
  generateContextualHints(context: SearchContext): string[] {
    const hints: string[] = [];

    // Suggest output optimization for large results
    if (context.returnedRecords > 20 && context.output === 'full') {
      hints.push(
        `Consider using output parameter to select only needed fields for better performance (e.g., output: ["id", "name"])`
      );
    }

    // Usage estimation warnings
    const estimatedUsage = this.estimateUsageMetrics(context);
    if (estimatedUsage > 50000) {
      hints.push(
        `⚠️  Large response detected (~${Math.round(estimatedUsage / 1000)}k units) - consider using output field selection or pagination to reduce size`
      );
    } else if (estimatedUsage > 20000) {
      hints.push(
        `Response size is significant (~${Math.round(estimatedUsage / 1000)}k units) - consider field selection for better efficiency`
      );
    }

    // Suggest pagination for large result sets
    if (context.totalRecords > 100 && context.returnedRecords === 100) {
      hints.push(
        `Large result set detected - consider using pagination with startWith parameter or more specific filters`
      );
    }

    // Performance hints
    if (context.queryTimeMs > 5000) {
      hints.push(
        `Query took ${context.queryTimeMs}ms - consider adding more specific filters or using pagination`
      );
    }

    // No results hints
    if (context.totalRecords === 0) {
      hints.push(...this.generateNoResultsHints(context));
    }

    // Filter combination suggestions
    if (Object.keys(context.filters).length > 5) {
      hints.push(
        `Complex filter combination detected - if results are unexpected, try simplifying filters`
      );
    }

    return hints;
  }

  /**
   * Generate result summary based on counts
   */
  private generateResultSummary(context: SearchContext): string {
    const { entityType, totalRecords, returnedRecords } = context;

    // Handle multiple entity types
    const entityTypeDisplay = Array.isArray(entityType)
      ? entityType.join(', ')
      : entityType;
    const isMultipleTypes = Array.isArray(entityType);

    if (totalRecords === 0) {
      return `No ${entityTypeDisplay} found matching the search criteria`;
    }

    let message: string;
    if (totalRecords === returnedRecords) {
      message = isMultipleTypes
        ? `Found ${totalRecords} items across ${entityTypeDisplay}`
        : `Found ${totalRecords} ${entityType}`;
    } else {
      message = isMultipleTypes
        ? `Found ${totalRecords} items across ${entityTypeDisplay}, returning first ${returnedRecords}`
        : `Found ${totalRecords} ${entityType}, returning first ${returnedRecords}`;
    }

    return message;
  }

  /**
   * Generate description of applied filters
   */
  private generateFilterDescription(context: SearchContext): string {
    const descriptions: string[] = [];

    for (const [field, value] of Object.entries(context.filters)) {
      descriptions.push(this.describeFilter(field, value, context.entityType));
    }

    if (descriptions.length === 1) {
      return `Filtered by: ${descriptions[0]}`;
    }

    return `Filtered by: ${descriptions.join(', ')}`;
  }

  /**
   * Describe individual filter in human-readable format
   */
  private describeFilter(
    field: string,
    value: any,
    entityType: EntityType | EntityType[]
  ): string {
    // For multiple entity types, use the field name directly
    const fieldDisplayName = Array.isArray(entityType)
      ? field
      : this.getFieldDisplayName(field, entityType);

    // Handle empty/missing value searches
    if (value === '' || value === null || value === undefined) {
      return `missing ${fieldDisplayName}`;
    }

    // Handle array values
    if (Array.isArray(value)) {
      if (value.length === 1) {
        return `${fieldDisplayName} = "${value[0]}"`;
      }
      return `${fieldDisplayName} in [${value.join(', ')}]`;
    }

    // Handle object values (for complex operators)
    if (typeof value === 'object' && value.operator) {
      return this.describeOperatorFilter(fieldDisplayName, value);
    }

    // Handle boolean values
    if (typeof value === 'boolean') {
      return `${fieldDisplayName} = ${value ? 'true' : 'false'}`;
    }

    // Default string representation
    return `${fieldDisplayName} = "${value}"`;
  }

  /**
   * Describe operator-based filters
   */
  private describeOperatorFilter(fieldName: string, filterObj: any): string {
    const { operator, value } = filterObj;

    switch (operator) {
      case 'contains':
        return `${fieldName} contains "${value}"`;
      case 'startsWith':
        return `${fieldName} starts with "${value}"`;
      case 'endsWith':
        return `${fieldName} ends with "${value}"`;
      case 'isEmpty':
        return `missing ${fieldName}`;
      case 'before':
        return `${fieldName} before ${value}`;
      case 'after':
        return `${fieldName} after ${value}`;
      default:
        return `${fieldName} ${operator} "${value}"`;
    }
  }

  /**
   * Get human-readable field name
   */
  private getFieldDisplayName(field: string, entityType: EntityType): string {
    const entityConfig = this.entityMappings[entityType];

    if (entityConfig?.displayNames?.[field]) {
      return entityConfig.displayNames[field];
    }

    // Convert camelCase to readable format
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toLowerCase())
      .replace(/\./g, ' ');
  }

  /**
   * Generate warnings message
   */
  private generateWarningsMessage(context: SearchContext): string {
    const warningParts = context.warnings.map(warning => {
      // Make warnings more user-friendly
      return warning.charAt(0).toUpperCase() + warning.slice(1);
    });

    if (warningParts.length === 1) {
      return `Note: ${warningParts[0]}`;
    }

    return `Notes: ${warningParts.join('; ')}`;
  }

  /**
   * Generate pagination hint
   */
  private generatePaginationHint(context: SearchContext): string {
    const nextOffset =
      (context.returnedRecords || 0) + (context.filters['startWith'] || 0);
    return `Use startWith=${nextOffset} to get the next batch`;
  }

  /**
   * Generate hints when no results are found
   */
  private generateNoResultsHints(context: SearchContext): string[] {
    const suggestions: string[] = [];

    // Check for common empty value patterns
    for (const [field, value] of Object.entries(context.filters)) {
      if (value === '' || value === null) {
        const fieldDisplayName = Array.isArray(context.entityType)
          ? field
          : this.getFieldDisplayName(field, context.entityType);
        suggestions.push(
          `Remove the "${fieldDisplayName}" filter to see all ${context.entityType}, then filter client-side if needed`
        );
      }
    }

    // Check for overly restrictive combinations
    if (Object.keys(context.filters).length > 3) {
      suggestions.push(`Try removing some filters to broaden the search scope`);
    }

    // Entity-specific suggestions (only for single entity type)
    const entitySpecificSuggestions = Array.isArray(context.entityType)
      ? []
      : this.getEntitySpecificSuggestions(context);
    suggestions.push(...entitySpecificSuggestions);

    if (suggestions.length === 0) {
      suggestions.push(
        `Try using broader search criteria or check if the ${context.entityType} exist in your workspace`
      );
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions to avoid overwhelming
  }

  /**
   * Get entity-specific suggestions for no results scenarios
   */
  private getEntitySpecificSuggestions(context: SearchContext): string[] {
    const suggestions: string[] = [];

    switch (context.entityType) {
      case 'features':
        suggestions.push(
          `Try searching without the "archived" filter to include archived features`
        );
        if (context.filters['status.name']) {
          suggestions.push(
            `Check if the status "${context.filters['status.name']}" exists in your workspace`
          );
        }
        break;

      case 'notes':
        if (context.filters['company.domain']) {
          suggestions.push(`Try searching by company name instead of domain`);
        }
        break;

      case 'users':
        suggestions.push(
          `Try searching without role or active status filters to see all users`
        );
        break;

      case 'releases':
        if (context.filters['state']) {
          suggestions.push(
            `Try searching without state filter - valid states are usually: planned, in_progress, released`
          );
        }
        break;

      default:
        break;
    }

    return suggestions;
  }

  /**
   * Generate performance metrics message
   */
  generatePerformanceMessage(context: SearchContext): string | null {
    if (context.queryTimeMs < 1000) {
      return null; // Don't mention good performance
    }

    if (context.queryTimeMs < 5000) {
      return `Query completed in ${context.queryTimeMs}ms`;
    }

    return `Query took ${context.queryTimeMs}ms - consider optimizing with more specific filters`;
  }

  /**
   * Estimate usage metrics for response data
   */
  private estimateUsageMetrics(context: SearchContext): number {
    // Base estimation: 1 unit ≈ 4 characters for typical JSON data

    // Estimate based on entity type and output mode
    let baseUnitsPerRecord = 0;

    // For multi-entity search, use a default estimate
    const entityTypeForEstimate = Array.isArray(context.entityType)
      ? 'default'
      : context.entityType;

    switch (entityTypeForEstimate) {
      case 'features':
        baseUnitsPerRecord = context.output === 'full' ? 300 : 50;
        break;
      case 'notes':
        baseUnitsPerRecord = context.output === 'full' ? 400 : 60;
        break;
      case 'companies':
        baseUnitsPerRecord = context.output === 'full' ? 200 : 40;
        break;
      case 'users':
        baseUnitsPerRecord = context.output === 'full' ? 150 : 30;
        break;
      case 'releases':
        baseUnitsPerRecord = context.output === 'full' ? 250 : 45;
        break;
      default:
        baseUnitsPerRecord = context.output === 'full' ? 200 : 40;
        break;
    }

    // Adjust for output mode
    if (context.output === 'ids-only') {
      baseUnitsPerRecord = 10;
    } else if (context.output === 'summary') {
      baseUnitsPerRecord = Math.floor(baseUnitsPerRecord * 0.3);
    } else if (Array.isArray(context.output)) {
      // Field selection - estimate based on number of fields
      const fieldCount = context.output.length;
      baseUnitsPerRecord = Math.min(baseUnitsPerRecord, fieldCount * 15);
    }

    // Total estimated usage
    const dataUnits = context.returnedRecords * baseUnitsPerRecord;

    // Add metadata overhead (message, hints, etc.)
    const metadataUnits = 200;

    return dataUnits + metadataUnits;
  }

  /**
   * Generate success metrics for the response
   */
  generateSuccessMetrics(context: SearchContext): Record<string, any> {
    return {
      efficiency: context.returnedRecords / Math.max(context.totalRecords, 1),
      resultDensity: context.totalRecords > 0 ? 'results_found' : 'no_results',
      filterComplexity: Object.keys(context.filters).length,
      hasOptimalPagination: context.returnedRecords <= 50,
      queryPerformance:
        context.queryTimeMs < 2000
          ? 'fast'
          : context.queryTimeMs < 5000
            ? 'moderate'
            : 'slow',
    };
  }
}
