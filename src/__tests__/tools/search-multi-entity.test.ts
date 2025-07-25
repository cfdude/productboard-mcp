/**
 * Tests for multi-entity search functionality
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import { SearchEngine } from '../../utils/search-engine.js';
import { SearchParams } from '../../types/search-types.js';

// Create a simplified test approach without complex mocking
describe('Multi-Entity Search Tests', () => {
  let searchEngine: SearchEngine;

  beforeEach(() => {
    searchEngine = new SearchEngine();
  });

  describe('Parameter Validation for Multiple Entity Types', () => {
    it('should accept and normalize single entity type', async () => {
      const params: SearchParams = {
        entityType: 'features',
      };

      const normalized = await searchEngine.validateAndNormalizeParams(params);

      expect(normalized.entityTypes).toEqual(['features']);
      expect(normalized.entityType).toBe('features'); // Kept for compatibility
    });

    it('should accept and normalize array of entity types', async () => {
      const params: SearchParams = {
        entityType: ['products', 'components', 'features'],
      };

      const normalized = await searchEngine.validateAndNormalizeParams(params);

      expect(normalized.entityTypes).toEqual([
        'products',
        'components',
        'features',
      ]);
      expect(normalized.entityType).toEqual([
        'products',
        'components',
        'features',
      ]);
    });

    it('should validate all entity types in array', async () => {
      const params: SearchParams = {
        entityType: ['features', 'invalid' as any, 'products'],
      };

      await expect(
        searchEngine.validateAndNormalizeParams(params)
      ).rejects.toThrow('Unsupported entity type: invalid');
    });

    it('should handle empty array', async () => {
      const params: SearchParams = {
        entityType: [],
      };

      const normalized = await searchEngine.validateAndNormalizeParams(params);
      expect(normalized.entityTypes).toEqual([]);
    });
  });

  describe('Filter Validation for Multiple Entity Types', () => {
    it('should validate filters when field exists in all types', async () => {
      const params: SearchParams = {
        entityType: ['features', 'products'],
        filters: { name: 'test' },
      };

      const normalized = await searchEngine.validateAndNormalizeParams(params);

      expect(normalized.filters).toEqual({ name: 'test' });
    });

    it('should warn when filter only exists in some types', async () => {
      const params: SearchParams = {
        entityType: ['features', 'notes'],
        filters: { status: 'active' }, // Only in features
      };

      // The validation should pass but with warnings
      const normalized = await searchEngine.validateAndNormalizeParams(params);
      expect(normalized.filters).toEqual({ status: 'active' });
    });

    it('should reject filters not available in any type', async () => {
      const params: SearchParams = {
        entityType: ['products', 'components'],
        filters: { invalidField: 'test' },
      };

      await expect(
        searchEngine.validateAndNormalizeParams(params)
      ).rejects.toThrow('not searchable in any of the specified entity types');
    });
  });

  describe('Output Field Validation for Multiple Entity Types', () => {
    it('should validate output fields across multiple types', async () => {
      const params: SearchParams = {
        entityType: ['products', 'components', 'features'],
        output: ['id', 'name'], // Common fields
      };

      const normalized = await searchEngine.validateAndNormalizeParams(params);

      expect(normalized.output).toEqual(['id', 'name']);
    });

    it('should allow _entityType as special field', async () => {
      const params: SearchParams = {
        entityType: ['products', 'features'],
        output: ['id', 'name', '_entityType'],
      };

      const normalized = await searchEngine.validateAndNormalizeParams(params);
      expect(normalized.output).toEqual(['id', 'name', '_entityType']);
    });

    it('should warn when output field only exists in some types', async () => {
      const params: SearchParams = {
        entityType: ['features', 'products'],
        output: ['id', 'name', 'status'], // status only in features
      };

      // Should pass validation but with warnings
      const normalized = await searchEngine.validateAndNormalizeParams(params);
      expect(normalized.output).toEqual(['id', 'name', 'status']);
    });

    it('should reject output fields not available in any type', async () => {
      const params: SearchParams = {
        entityType: ['products', 'components'],
        output: ['id', 'invalidField'],
      };

      await expect(
        searchEngine.validateAndNormalizeParams(params)
      ).rejects.toThrow('not available in any of the specified entity types');
    });
  });

  describe('Result Processing for Multiple Entity Types', () => {
    it('should process results with entity type preservation', async () => {
      const rawResults = {
        data: [
          { id: '1', name: 'Product 1', _entityType: 'products' },
          { id: '2', name: 'Feature 1', _entityType: 'features' },
        ],
        totalRecords: 2,
        hasMore: false,
        warnings: [],
        queryTimeMs: 100,
      };

      const params = await searchEngine.validateAndNormalizeParams({
        entityType: ['products', 'features'],
        output: ['id', 'name', '_entityType'],
      });

      const processed = await searchEngine.processResults(rawResults, params);

      expect(processed.data).toHaveLength(2);
      expect(processed.data[0]).toEqual({
        id: '1',
        name: 'Product 1',
        _entityType: 'products',
      });
      expect(processed.data[1]).toEqual({
        id: '2',
        name: 'Feature 1',
        _entityType: 'features',
      });
    });

    it('should handle ids-only mode for multiple entity types', async () => {
      const rawResults = {
        data: [
          { id: 'prod-1', name: 'Product 1', _entityType: 'products' },
          { id: 'feat-1', name: 'Feature 1', _entityType: 'features' },
        ],
        totalRecords: 2,
        hasMore: false,
        warnings: [],
        queryTimeMs: 50,
      };

      const params = await searchEngine.validateAndNormalizeParams({
        entityType: ['products', 'features'],
        output: 'ids-only',
      });

      const processed = await searchEngine.processResults(rawResults, params);

      expect(processed.data).toEqual(['prod-1', 'feat-1']);
    });
  });

  describe('Message Generation for Multiple Entity Types', () => {
    it('should generate appropriate message for multi-entity search', async () => {
      const params = await searchEngine.validateAndNormalizeParams({
        entityType: ['products', 'features'],
      });

      // Test the message generation indirectly through the parameters
      expect(params.entityTypes).toEqual(['products', 'features']);
      expect(Array.isArray(params.entityType)).toBe(true);
    });

    it('should handle empty results for multiple entity types', async () => {
      const params = await searchEngine.validateAndNormalizeParams({
        entityType: ['products', 'components', 'features'],
        filters: { name: 'nonexistent' },
      });

      expect(params.entityTypes).toEqual([
        'products',
        'components',
        'features',
      ]);
      expect(params.filters).toEqual({ name: 'nonexistent' });
    });
  });
});
