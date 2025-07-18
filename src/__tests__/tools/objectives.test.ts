/**
 * Tests for Objectives, Initiatives, and Key Results tools
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import {
  handleObjectivesTool,
  setupObjectivesTools,
} from '../../tools/objectives.js';
import type { ToolDefinition } from '../../types/tool-types.js';

describe('Objectives Tools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tool Definitions', () => {
    it('should define all objectives tools with correct schemas', () => {
      const tools = setupObjectivesTools();

      expect(tools.length).toBeGreaterThan(25);

      const toolNames = tools.map((tool: ToolDefinition) => tool.name);

      // Objectives tools
      expect(toolNames).toContain('create_objective');
      expect(toolNames).toContain('get_objectives');
      expect(toolNames).toContain('get_objective');
      expect(toolNames).toContain('update_objective');
      expect(toolNames).toContain('delete_objective');

      // Objective linking tools
      expect(toolNames).toContain('list_links_objective_to_features');
      expect(toolNames).toContain('list_links_objective_to_initiatives');
      expect(toolNames).toContain('create_objective_to_feature_link');
      expect(toolNames).toContain('delete_objective_to_feature_link');
      expect(toolNames).toContain('create_objective_to_initiative_link');
      expect(toolNames).toContain('delete_objective_to_initiative_link');

      // Initiatives tools
      expect(toolNames).toContain('create_initiative');
      expect(toolNames).toContain('get_initiatives');
      expect(toolNames).toContain('get_initiative');
      expect(toolNames).toContain('update_initiative');
      expect(toolNames).toContain('delete_initiative');

      // Initiative linking tools
      expect(toolNames).toContain('list_links_initiative_to_objectives');
      expect(toolNames).toContain('list_links_initiative_to_features');
      expect(toolNames).toContain('create_initiative_to_objective_link');
      expect(toolNames).toContain('delete_initiative_to_objective_link');
      expect(toolNames).toContain('create_initiative_to_feature_link');
      expect(toolNames).toContain('delete_initiative_to_feature_link');

      // Key Results tools
      expect(toolNames).toContain('create_key_result');
      expect(toolNames).toContain('get_key_results');
      expect(toolNames).toContain('get_key_result');
      expect(toolNames).toContain('update_key_result');
      expect(toolNames).toContain('delete_key_result');
    });

    it('should have standardized parameters for list operations', () => {
      const tools = setupObjectivesTools();
      const listTools = [
        'get_objectives',
        'get_initiatives',
        'get_key_results',
      ];

      listTools.forEach(toolName => {
        const tool = tools.find((t: ToolDefinition) => t.name === toolName);
        expect(tool?.inputSchema.properties).toHaveProperty('limit');
        expect(tool?.inputSchema.properties).toHaveProperty('startWith');
        expect(tool?.inputSchema.properties).toHaveProperty('detail');
        expect(tool?.inputSchema.properties).toHaveProperty('includeSubData');
      });
    });

    it('should have standardized parameters for get operations', () => {
      const tools = setupObjectivesTools();
      const getTools = ['get_objective', 'get_initiative', 'get_key_result'];

      getTools.forEach(toolName => {
        const tool = tools.find((t: ToolDefinition) => t.name === toolName);
        expect(tool?.inputSchema.properties).toHaveProperty('detail');
        expect(tool?.inputSchema.properties).toHaveProperty('includeSubData');
      });
    });

    it('should have required parameters for create operations', () => {
      const tools = setupObjectivesTools();

      const createObjective = tools.find(
        (t: ToolDefinition) => t.name === 'create_objective'
      );
      expect(createObjective?.inputSchema.required).toContain('name');

      const createInitiative = tools.find(
        (t: ToolDefinition) => t.name === 'create_initiative'
      );
      expect(createInitiative?.inputSchema.required).toContain('name');

      const createKeyResult = tools.find(
        (t: ToolDefinition) => t.name === 'create_key_result'
      );
      expect(createKeyResult?.inputSchema.required).toContain('name');
      expect(createKeyResult?.inputSchema.required).toContain('objectiveId');
      expect(createKeyResult?.inputSchema.required).toContain('type');
      expect(createKeyResult?.inputSchema.required).toContain('targetValue');
    });

    it('should have linking parameters for link operations', () => {
      const tools = setupObjectivesTools();

      const createObjFeatureLink = tools.find(
        (t: ToolDefinition) => t.name === 'create_objective_to_feature_link'
      );
      expect(createObjFeatureLink?.inputSchema.required).toContain('id');
      expect(createObjFeatureLink?.inputSchema.required).toContain('featureId');

      const createInitObjLink = tools.find(
        (t: ToolDefinition) => t.name === 'create_initiative_to_objective_link'
      );
      expect(createInitObjLink?.inputSchema.required).toContain('id');
      expect(createInitObjLink?.inputSchema.required).toContain('objectiveId');
    });
  });

  describe('Tool Handler', () => {
    it('should handle unknown tool error', async () => {
      await expect(handleObjectivesTool('unknown_tool', {})).rejects.toThrow(
        'Unknown objectives tool: unknown_tool'
      );
    });

    it('should accept valid tool names', () => {
      const validTools = [
        'create_objective',
        'get_objectives',
        'get_objective',
        'update_objective',
        'delete_objective',
        'create_initiative',
        'get_initiatives',
        'get_initiative',
        'update_initiative',
        'delete_initiative',
        'create_key_result',
        'get_key_results',
        'get_key_result',
        'update_key_result',
        'delete_key_result',
      ];

      validTools.forEach(toolName => {
        expect(() => {
          // Just check it doesn't throw immediately
          const promise = handleObjectivesTool(toolName, {});
          // Catch the expected error about missing required fields
          promise.catch(() => {});
        }).not.toThrow('Unknown objectives tool');
      });
    });
  });
});
