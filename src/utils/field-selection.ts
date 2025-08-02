/**
 * Dynamic field selection utilities
 * Provides precise field specification to replace basic/standard/full detail levels
 */

export interface FieldSelectionConfig {
  fields?: string[];
  exclude?: string[];
  validateFields?: boolean;
}

export interface FieldValidationResult {
  valid: boolean;
  invalidFields?: string[];
  suggestions?: string[];
  error?: string;
}

/**
 * Field selection processor for precise response filtering
 */
export class FieldSelector {
  private entityFieldMaps: Map<string, Set<string>> = new Map();

  constructor() {
    this.initializeFieldMaps();
  }

  /**
   * Initialize field mappings for different entity types
   */
  private initializeFieldMaps(): void {
    // Features
    this.entityFieldMaps.set(
      'feature',
      new Set([
        'id',
        'name',
        'description',
        'status',
        'owner',
        'createdAt',
        'updatedAt',
        'timeframe',
        'timeframe.startDate',
        'timeframe.endDate',
        'timeframe.duration',
        'parent',
        'parent.id',
        'parent.name',
        'parent.product',
        'owner.id',
        'owner.email',
        'owner.name',
        'status.id',
        'status.name',
        'status.color',
        'archived',
        'links',
        'customFields',
        'components',
        'releases',
      ])
    );

    // Notes
    this.entityFieldMaps.set(
      'note',
      new Set([
        'id',
        'title',
        'content',
        'owner',
        'user',
        'company',
        'createdAt',
        'updatedAt',
        'owner.id',
        'owner.email',
        'owner.name',
        'user.id',
        'user.email',
        'user.name',
        'user.externalId',
        'company.id',
        'company.name',
        'company.domain',
        'tags',
        'links',
        'displayUrl',
        'source',
      ])
    );

    // Companies
    this.entityFieldMaps.set(
      'company',
      new Set([
        'id',
        'name',
        'description',
        'domain',
        'externalId',
        'createdAt',
        'updatedAt',
        'customFields',
        'hasNotes',
        'notesCount',
      ])
    );

    // Components
    this.entityFieldMaps.set(
      'component',
      new Set([
        'id',
        'name',
        'description',
        'product',
        'createdAt',
        'updatedAt',
        'product.id',
        'product.name',
      ])
    );

    // Products
    this.entityFieldMaps.set(
      'product',
      new Set([
        'id',
        'name',
        'description',
        'createdAt',
        'updatedAt',
        'components',
        'componentsCount',
      ])
    );

    // Users
    this.entityFieldMaps.set(
      'user',
      new Set([
        'id',
        'email',
        'name',
        'role',
        'company',
        'externalId',
        'createdAt',
        'updatedAt',
        'company.id',
        'company.name',
        'company.domain',
      ])
    );

    // Objectives
    this.entityFieldMaps.set(
      'objective',
      new Set([
        'id',
        'name',
        'description',
        'owner',
        'startDate',
        'endDate',
        'createdAt',
        'updatedAt',
        'owner.id',
        'owner.email',
        'owner.name',
        'keyResults',
        'initiatives',
        'features',
      ])
    );

    // Initiatives
    this.entityFieldMaps.set(
      'initiative',
      new Set([
        'id',
        'name',
        'description',
        'owner',
        'status',
        'createdAt',
        'updatedAt',
        'owner.id',
        'owner.email',
        'owner.name',
        'objectives',
        'features',
      ])
    );

    // Key Results
    this.entityFieldMaps.set(
      'keyResult',
      new Set([
        'id',
        'name',
        'objective',
        'type',
        'startValue',
        'currentValue',
        'targetValue',
        'createdAt',
        'updatedAt',
        'objective.id',
        'objective.name',
      ])
    );

    // Releases
    this.entityFieldMaps.set(
      'release',
      new Set([
        'id',
        'name',
        'description',
        'releaseGroup',
        'startDate',
        'releaseDate',
        'state',
        'createdAt',
        'updatedAt',
        'releaseGroup.id',
        'releaseGroup.name',
      ])
    );

    // Release Groups
    this.entityFieldMaps.set(
      'releaseGroup',
      new Set([
        'id',
        'name',
        'description',
        'isDefault',
        'createdAt',
        'updatedAt',
        'releases',
        'releasesCount',
      ])
    );
  }

  /**
   * Validate requested fields against entity schema
   */
  validateFields(
    entityType: string,
    requestedFields: string[]
  ): FieldValidationResult {
    const validFields = this.entityFieldMaps.get(entityType);

    if (!validFields) {
      return {
        valid: false,
        error: `Unknown entity type: ${entityType}`,
      };
    }

    const invalidFields = requestedFields.filter(
      field => !validFields.has(field)
    );

    if (invalidFields.length === 0) {
      return { valid: true };
    }

    // Generate suggestions for invalid fields
    const suggestions = invalidFields
      .map(invalidField =>
        this.suggestSimilarField(invalidField, Array.from(validFields))
      )
      .filter((suggestion): suggestion is string => suggestion !== null);

    return {
      valid: false,
      invalidFields,
      suggestions,
      error: `Invalid fields for ${entityType}: ${invalidFields.join(', ')}`,
    };
  }

  /**
   * Apply field selection to response data
   */
  selectFields(data: unknown, config: FieldSelectionConfig): unknown {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.selectFieldsFromObject(item, config));
    }

    return this.selectFieldsFromObject(data, config);
  }

  /**
   * Select fields from a single object
   */
  private selectFieldsFromObject(obj: any, config: FieldSelectionConfig): any {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const { fields, exclude = [] } = config;

    // If no fields specified, return all except excluded
    if (!fields || fields.length === 0) {
      if (exclude.length === 0) {
        return obj;
      }
      return this.excludeFields(obj, exclude);
    }

    // Build result with only requested fields
    const result: any = {};

    for (const fieldPath of fields) {
      if (exclude.includes(fieldPath)) {
        continue; // Skip excluded fields
      }

      const value = this.getNestedValue(obj, fieldPath);
      if (value !== undefined) {
        this.setNestedValue(result, fieldPath, value);
      }
    }

    return result;
  }

  /**
   * Exclude specific fields from object
   */
  private excludeFields(obj: any, excludeFields: string[]): any {
    const result = { ...obj };

    for (const fieldPath of excludeFields) {
      this.deleteNestedValue(result, fieldPath);
    }

    return result;
  }

  /**
   * Get nested value using dot notation (e.g., "owner.email")
   */
  private getNestedValue(obj: any, path: string): any {
    if (!path.includes('.')) {
      return obj[path];
    }

    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (
        current === null ||
        current === undefined ||
        typeof current !== 'object'
      ) {
        return undefined;
      }
      current = current[part];
    }

    return current;
  }

  /**
   * Set nested value using dot notation
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    if (!path.includes('.')) {
      obj[path] = value;
      return;
    }

    const parts = path.split('.');
    const lastPart = parts.pop()!;
    let current = obj;

    for (const part of parts) {
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }

    current[lastPart] = value;
  }

  /**
   * Delete nested value using dot notation
   */
  private deleteNestedValue(obj: any, path: string): void {
    if (!path.includes('.')) {
      delete obj[path];
      return;
    }

    const parts = path.split('.');
    const lastPart = parts.pop()!;
    let current = obj;

    for (const part of parts) {
      if (!current[part] || typeof current[part] !== 'object') {
        return; // Path doesn't exist
      }
      current = current[part];
    }

    delete current[lastPart];
  }

  /**
   * Suggest similar field names for typos
   */
  private suggestSimilarField(
    invalidField: string,
    validFields: string[]
  ): string | null {
    const lowerInvalid = invalidField.toLowerCase();

    // Exact case-insensitive match
    const exactMatch = validFields.find(
      field => field.toLowerCase() === lowerInvalid
    );
    if (exactMatch) {
      return exactMatch;
    }

    // Partial matches
    const partialMatches = validFields.filter(
      field =>
        field.toLowerCase().includes(lowerInvalid) ||
        lowerInvalid.includes(field.toLowerCase())
    );

    if (partialMatches.length > 0) {
      return partialMatches[0];
    }

    // Levenshtein distance for typos
    let closestField = null;
    let minDistance = Infinity;

    for (const field of validFields) {
      const distance = this.levenshteinDistance(
        lowerInvalid,
        field.toLowerCase()
      );
      if (
        distance < minDistance &&
        distance <= Math.max(2, invalidField.length * 0.3)
      ) {
        minDistance = distance;
        closestField = field;
      }
    }

    return closestField;
  }

  /**
   * Calculate Levenshtein distance for typo suggestions
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Get essential fields for an entity type (used as smart defaults)
   */
  getEssentialFields(entityType: string): string[] {
    const essentialFieldMaps: Record<string, string[]> = {
      feature: ['id', 'name', 'status.name', 'owner.email'],
      note: ['id', 'title', 'owner.email', 'createdAt'],
      company: ['id', 'name', 'domain'],
      component: ['id', 'name', 'product.name'],
      product: ['id', 'name'],
      user: ['id', 'email', 'name', 'role'],
      objective: ['id', 'name', 'owner.email', 'startDate', 'endDate'],
      initiative: ['id', 'name', 'owner.email', 'status'],
      keyResult: ['id', 'name', 'currentValue', 'targetValue'],
      release: ['id', 'name', 'releaseDate', 'state'],
      releaseGroup: ['id', 'name', 'isDefault'],
    };

    return essentialFieldMaps[entityType] || ['id', 'name'];
  }

  /**
   * Get all available fields for an entity type
   */
  getAvailableFields(entityType: string): string[] {
    const fields = this.entityFieldMaps.get(entityType);
    return fields ? Array.from(fields).sort() : [];
  }
}

// Export singleton instance
export const fieldSelector = new FieldSelector();
