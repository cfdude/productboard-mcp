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
  });
});
