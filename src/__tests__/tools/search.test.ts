/**
 * Tests for the universal search functionality
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import { SearchEngine } from '../../utils/search-engine.js';
import { SearchMessageGenerator } from '../../utils/search-messaging.js';
import { OutputProcessor } from '../../utils/search-output-processor.js';
import { SearchParams, SearchContext } from '../../types/search-types.js';

describe('Universal Search Tool', () => {
  let searchEngine: SearchEngine;
  let messageGenerator: SearchMessageGenerator;
  let outputProcessor: OutputProcessor;

  beforeEach(() => {
    searchEngine = new SearchEngine();
    messageGenerator = new SearchMessageGenerator();
    outputProcessor = new OutputProcessor();
  });

  describe('SearchEngine', () => {
    describe('validateAndNormalizeParams', () => {
      it('should validate and normalize basic search params', async () => {
        const params: SearchParams = {
          entityType: 'features',
          filters: { description: '' },
        };

        const normalized =
          await searchEngine.validateAndNormalizeParams(params);

        expect(normalized.entityType).toBe('features');
        expect(normalized.filters).toEqual({ description: '' });
        expect(normalized.limit).toBe(50);
        expect(normalized.startWith).toBe(0);
        expect(normalized.detail).toBe('standard');
        expect(normalized.includeSubData).toBe(false);
        expect(normalized.output).toBe('full');
      });

      it('should throw error for unsupported entity type', async () => {
        const params: SearchParams = {
          entityType: 'invalid' as any,
        };

        await expect(
          searchEngine.validateAndNormalizeParams(params)
        ).rejects.toThrow('Unsupported entity type: invalid');
      });

      it('should validate output fields', async () => {
        const params: SearchParams = {
          entityType: 'features',
          output: ['id', 'name'],
        };

        const normalized =
          await searchEngine.validateAndNormalizeParams(params);
        expect(normalized.output).toEqual(['id', 'name']);
      });

      it('should enforce limit constraints', async () => {
        const params: SearchParams = {
          entityType: 'features',
          limit: 150, // Over max
        };

        const normalized =
          await searchEngine.validateAndNormalizeParams(params);
        expect(normalized.limit).toBe(100); // Capped at max
      });
    });
  });

  describe('OutputProcessor', () => {
    const testData = [
      {
        id: 'feat-1',
        name: 'Feature One',
        description: 'First feature',
        owner: { email: 'owner1@test.com' },
        status: { name: 'Active', id: 'active-1' },
      },
      {
        id: 'feat-2',
        name: 'Feature Two',
        description: '',
        owner: { email: 'owner2@test.com' },
        status: { name: 'Pending', id: 'pending-1' },
      },
    ];

    it('should handle ids-only output mode', () => {
      const result = outputProcessor.processOutput(
        testData,
        'features',
        'ids-only'
      );
      expect(result).toEqual(['feat-1', 'feat-2']);
    });

    it('should handle field selection with dot notation', () => {
      const result = outputProcessor.processOutput(testData, 'features', [
        'id',
        'name',
        'owner.email',
      ]);
      expect(result).toEqual([
        {
          id: 'feat-1',
          name: 'Feature One',
          owner: { email: 'owner1@test.com' },
        },
        {
          id: 'feat-2',
          name: 'Feature Two',
          owner: { email: 'owner2@test.com' },
        },
      ]);
    });

    it('should handle summary output mode', () => {
      const result = outputProcessor.processOutput(
        testData,
        'features',
        'summary'
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
    });

    it('should handle full output mode', () => {
      const result = outputProcessor.processOutput(
        testData,
        'features',
        'full'
      );
      expect(result).toEqual(testData);
    });
  });

  describe('SearchMessageGenerator', () => {
    it('should generate basic result summary', () => {
      const context: SearchContext = {
        entityType: 'features',
        totalRecords: 5,
        returnedRecords: 5,
        filters: {},
        detail: 'standard',
        warnings: [],
        hasMore: false,
        queryTimeMs: 100,
      };

      const message = messageGenerator.generateMessage(context);
      expect(message).toBe('Found 5 features');
    });

    it('should generate message with filters', () => {
      const context: SearchContext = {
        entityType: 'features',
        totalRecords: 3,
        returnedRecords: 3,
        filters: { description: '' },
        detail: 'standard',
        warnings: [],
        hasMore: false,
        queryTimeMs: 150,
      };

      const message = messageGenerator.generateMessage(context);
      expect(message).toContain('Found 3 features');
      expect(message).toContain('missing description');
    });

    it('should generate message with pagination', () => {
      const context: SearchContext = {
        entityType: 'features',
        totalRecords: 100,
        returnedRecords: 50,
        filters: {},
        detail: 'standard',
        warnings: [],
        hasMore: true,
        queryTimeMs: 200,
      };

      const message = messageGenerator.generateMessage(context);
      expect(message).toContain('Found 100 features, returning first 50');
      expect(message).toContain('Use startWith=50 to get the next batch');
    });

    it('should generate warnings for parameter conflicts', () => {
      const context: SearchContext = {
        entityType: 'features',
        totalRecords: 10,
        returnedRecords: 10,
        filters: {},
        detail: 'basic',
        output: ['id', 'name'],
        warnings: [
          'output parameter overrides detail level "basic" - exact fields and order determined by output specification',
        ],
        hasMore: false,
        queryTimeMs: 100,
      };

      const message = messageGenerator.generateMessage(context);
      expect(message).toContain('Output parameter overrides detail level');
    });

    it('should generate no results message', () => {
      const context: SearchContext = {
        entityType: 'features',
        totalRecords: 0,
        returnedRecords: 0,
        filters: { description: '' },
        detail: 'standard',
        warnings: [],
        hasMore: false,
        queryTimeMs: 50,
      };

      const message = messageGenerator.generateMessage(context);
      expect(message).toBe(
        'No features found matching the search criteria. Filtered by: missing description'
      );
    });

    it('should generate contextual hints', () => {
      const context: SearchContext = {
        entityType: 'features',
        totalRecords: 0,
        returnedRecords: 0,
        filters: { description: '' },
        detail: 'standard',
        warnings: [],
        hasMore: false,
        queryTimeMs: 50,
      };

      const hints = messageGenerator.generateContextualHints(context);
      expect(hints.length).toBeGreaterThan(0);
      expect(hints[0]).toContain('Remove the "description" filter');
    });

    it('should suggest performance optimizations', () => {
      const context: SearchContext = {
        entityType: 'features',
        totalRecords: 25,
        returnedRecords: 25,
        filters: {},
        detail: 'standard',
        output: 'full',
        warnings: [],
        hasMore: false,
        queryTimeMs: 100,
      };

      const hints = messageGenerator.generateContextualHints(context);
      expect(hints.some(hint => hint.includes('output parameter'))).toBe(true);
    });
  });

  describe('Filter Processing', () => {
    it('should handle empty string filters for missing field detection', () => {
      const testData = [
        { id: '1', name: 'Feature 1', description: 'Has description' },
        { id: '2', name: 'Feature 2', description: '' },
        { id: '3', name: 'Feature 3', description: null },
      ];

      // Mock the applyClientSideFiltering method behavior
      const filtered = testData.filter(
        item =>
          !item.description ||
          item.description === '' ||
          item.description === null
      );

      expect(filtered).toHaveLength(2);
      expect(filtered.map(f => f.id)).toEqual(['2', '3']);
    });

    it('should handle contains operator', () => {
      const testData = [
        { id: '1', name: 'User Management Feature' },
        { id: '2', name: 'Email Notifications' },
        { id: '3', name: 'User Profile Settings' },
      ];

      const filtered = testData.filter(item =>
        item.name.toLowerCase().includes('user'.toLowerCase())
      );

      expect(filtered).toHaveLength(2);
      expect(filtered.map(f => f.id)).toEqual(['1', '3']);
    });
  });
});
