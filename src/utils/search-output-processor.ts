/**
 * Processes search results based on output parameter specifications
 */
import { EntityType, OutputMode } from '../types/search-types.js';
import { EntityFieldMappings } from './search-field-mappings.js';

export class OutputProcessor {
  private entityMappings = EntityFieldMappings;

  /**
   * Process search results based on output specification
   */
  processOutput(
    data: any[],
    entityType: EntityType,
    output: string[] | OutputMode
  ): any[] {
    if (output === 'full') {
      return data;
    }

    if (output === 'ids-only') {
      return data.map(item => item.id);
    }

    if (output === 'summary') {
      return this.applySummaryOutput(data, entityType);
    }

    if (Array.isArray(output)) {
      return this.applyFieldSelection(data, output);
    }

    console.error(
      '[DEBUG OutputProcessor] No matching output mode, returning full data. Output was:',
      output
    );
    return data;
  }

  /**
   * Apply summary output mode
   */
  private applySummaryOutput(data: any[], entityType: EntityType): any[] {
    const entityConfig = this.entityMappings[entityType];
    if (!entityConfig || !entityConfig.summaryFields) {
      // Fallback to basic fields
      return data.map(item => ({
        id: item.id,
        name: item.name || item.title,
        ...(item.status && { status: item.status }),
      }));
    }

    return this.applyFieldSelection(data, entityConfig.summaryFields);
  }

  /**
   * Apply field selection to data
   */
  private applyFieldSelection(data: any[], fields: string[]): any[] {
    return data.map(item => this.extractFields(item, fields));
  }

  /**
   * Extract specific fields from an object, supporting dot notation
   */
  private extractFields(obj: any, fields: string[]): any {
    const result: any = {};

    for (const field of fields) {
      const value = this.getNestedValue(obj, field);
      this.setNestedValue(result, field, value);
    }

    return result;
  }

  /**
   * Get nested value using dot notation (e.g., "owner.email")
   */
  private getNestedValue(obj: any, path: string): any {
    if (!obj || !path) return undefined;

    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[key];
    }

    return current;
  }

  /**
   * Set nested value using dot notation
   */
  private setNestedValue(obj: any, path: string, value: any): void {
    if (!path) return;

    const keys = path.split('.');
    const lastKey = keys.pop()!;
    let current = obj;

    // Create nested structure
    for (const key of keys) {
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[lastKey] = value;
  }

  /**
   * Check if field exists in data structure
   */
  isFieldAvailable(obj: any, field: string): boolean {
    return this.getNestedValue(obj, field) !== undefined;
  }

  /**
   * Get all available fields in an object (for debugging/validation)
   */
  getAvailableFields(obj: any, prefix: string = ''): string[] {
    const fields: string[] = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const fullPath = prefix ? `${prefix}.${key}` : key;

        if (
          obj[key] !== null &&
          typeof obj[key] === 'object' &&
          !Array.isArray(obj[key])
        ) {
          // Recursively get nested fields
          fields.push(...this.getAvailableFields(obj[key], fullPath));
        } else {
          fields.push(fullPath);
        }
      }
    }

    return fields;
  }

  /**
   * Validate that requested fields are available in the data
   */
  validateFieldsAvailability(
    data: any[],
    fields: string[]
  ): {
    availableFields: string[];
    missingFields: string[];
  } {
    if (data.length === 0) {
      return {
        availableFields: [],
        missingFields: fields,
      };
    }

    const sampleItem = data[0];
    const availableFields = this.getAvailableFields(sampleItem);

    const missingFields = fields.filter(
      field =>
        !availableFields.includes(field) &&
        this.getNestedValue(sampleItem, field) === undefined
    );

    return {
      availableFields: availableFields.filter(field => fields.includes(field)),
      missingFields,
    };
  }
}
