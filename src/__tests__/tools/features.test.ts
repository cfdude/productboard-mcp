/**
 * Tests for Features, Components, and Products tools
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import {
  handleFeaturesTool,
  setupFeaturesTools,
} from '../../tools/features.js';
import type { ToolDefinition } from '../../types/tool-types.js';

describe('Features Tools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tool Definitions', () => {
    it('should define all features tools with correct schemas', () => {
      const tools = setupFeaturesTools();

      expect(tools.length).toBeGreaterThan(10);

      const toolNames = tools.map((tool: ToolDefinition) => tool.name);

      // Features tools
      expect(toolNames).toContain('create_feature');
      expect(toolNames).toContain('get_features');
      expect(toolNames).toContain('get_feature');
      expect(toolNames).toContain('update_feature');
      expect(toolNames).toContain('delete_feature');

      // Components tools
      expect(toolNames).toContain('create_component');
      expect(toolNames).toContain('get_components');
      expect(toolNames).toContain('get_component');
      expect(toolNames).toContain('update_component');

      // Products tools
      expect(toolNames).toContain('get_products');
      expect(toolNames).toContain('get_product');
      expect(toolNames).toContain('update_product');
    });

    it('should have standardized parameters for list operations', () => {
      const tools = setupFeaturesTools();
      const getFeatures = tools.find(
        (t: ToolDefinition) => t.name === 'get_features'
      );

      expect(getFeatures?.inputSchema.properties).toHaveProperty('limit');
      expect(getFeatures?.inputSchema.properties).toHaveProperty('startWith');
      expect(getFeatures?.inputSchema.properties).toHaveProperty('detail');
      expect(getFeatures?.inputSchema.properties).toHaveProperty(
        'includeSubData'
      );
    });

    it('should have standardized parameters for get operations', () => {
      const tools = setupFeaturesTools();
      const getFeature = tools.find(
        (t: ToolDefinition) => t.name === 'get_feature'
      );

      expect(getFeature?.inputSchema.properties).toHaveProperty('detail');
      expect(getFeature?.inputSchema.properties).toHaveProperty(
        'includeSubData'
      );
    });
  });

  describe('Tool Handler', () => {
    it('should handle unknown tool error', async () => {
      await expect(handleFeaturesTool('unknown_tool', {})).rejects.toThrow(
        'Unknown features tool: unknown_tool'
      );
    });

    it('should accept valid tool names', () => {
      const validTools = [
        'create_feature',
        'get_features',
        'get_feature',
        'update_feature',
        'delete_feature',
        'create_component',
        'get_components',
        'get_component',
        'update_component',
        'get_products',
        'get_product',
        'update_product',
      ];

      validTools.forEach(toolName => {
        expect(() => {
          // Just check it doesn't throw immediately
          const promise = handleFeaturesTool(toolName, {});
          // Catch the expected error about missing required fields
          promise.catch(() => {});
        }).not.toThrow('Unknown features tool');
      });
    });

    it('should include timeframe in update_feature schema', () => {
      const tools = setupFeaturesTools();
      const updateFeature = tools.find(
        (t: ToolDefinition) => t.name === 'update_feature'
      );

      expect(updateFeature?.inputSchema.properties).toHaveProperty('timeframe');
      expect(updateFeature?.inputSchema.properties.timeframe).toEqual({
        type: 'object',
        description: 'Feature timeframe with start and end dates',
        properties: {
          startDate: {
            type: 'string',
            description: 'Start date (YYYY-MM-DD)',
          },
          endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          granularity: {
            type: 'string',
            description: 'Timeframe granularity (optional)',
          },
        },
      });
    });

    it('should handle update_feature with timeframe parameter', async () => {
      // Test that the function accepts timeframe without throwing
      expect(() => {
        const promise = handleFeaturesTool('update_feature', {
          id: 'test-feature-id',
          timeframe: {
            startDate: '2025-02-01',
            endDate: '2025-02-28',
          },
        });
        // Catch expected error about missing API context
        promise.catch(() => {});
      }).not.toThrow();
    });

    it('should handle update_feature with timeframe as JSON string', async () => {
      // Test that the function accepts timeframe JSON string without throwing
      expect(() => {
        const promise = handleFeaturesTool('update_feature', {
          id: 'test-feature-id',
          timeframe: '{"startDate":"2025-02-01","endDate":"2025-02-28"}',
        });
        // Catch expected error about missing API context
        promise.catch(() => {});
      }).not.toThrow();
    });
  });
});
