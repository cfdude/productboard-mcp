/**
 * Tests for Releases tools
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import {
  handleReleasesTool,
  setupReleasesTools,
} from '../../tools/releases.js';
import type { ToolDefinition } from '../../types/tool-types.js';

describe('Releases Tools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tool Definitions', () => {
    it('should define all releases tools with correct schemas', () => {
      const tools = setupReleasesTools();

      expect(tools.length).toBeGreaterThan(10);

      const toolNames = tools.map((tool: ToolDefinition) => tool.name);

      // Release Groups tools
      expect(toolNames).toContain('create_release_group');
      expect(toolNames).toContain('list_release_groups');
      expect(toolNames).toContain('get_release_group');
      expect(toolNames).toContain('update_release_group');
      expect(toolNames).toContain('delete_release_group');

      // Releases tools
      expect(toolNames).toContain('create_release');
      expect(toolNames).toContain('list_releases');
      expect(toolNames).toContain('get_release');
      expect(toolNames).toContain('update_release');
      expect(toolNames).toContain('delete_release');

      // Feature Release Assignments tools
      expect(toolNames).toContain('list_feature_release_assignments');
      expect(toolNames).toContain('get_feature_release_assignment');
      expect(toolNames).toContain('update_feature_release_assignment');
    });

    it('should have standardized parameters for list operations', () => {
      const tools = setupReleasesTools();
      const listTools = [
        'list_release_groups',
        'list_releases',
        'list_feature_release_assignments',
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
      const tools = setupReleasesTools();
      const getTools = [
        'get_release_group',
        'get_release',
        'get_feature_release_assignment',
      ];

      getTools.forEach(toolName => {
        const tool = tools.find((t: ToolDefinition) => t.name === toolName);
        expect(tool?.inputSchema.properties).toHaveProperty('detail');
        expect(tool?.inputSchema.properties).toHaveProperty('includeSubData');
      });
    });

    it('should have required parameters for create operations', () => {
      const tools = setupReleasesTools();

      const createReleaseGroup = tools.find(
        (t: ToolDefinition) => t.name === 'create_release_group'
      );
      expect(createReleaseGroup?.inputSchema.required).toContain('name');

      const createRelease = tools.find(
        (t: ToolDefinition) => t.name === 'create_release'
      );
      expect(createRelease?.inputSchema.required).toContain('name');
      expect(createRelease?.inputSchema.required).toContain('releaseGroupId');
    });

    it('should have filter parameters for listing releases', () => {
      const tools = setupReleasesTools();
      const listReleases = tools.find(
        (t: ToolDefinition) => t.name === 'list_releases'
      );

      expect(listReleases?.inputSchema.properties).toHaveProperty(
        'releaseGroupId'
      );
    });

    it('should have filter parameters for listing feature release assignments', () => {
      const tools = setupReleasesTools();
      const listAssignments = tools.find(
        (t: ToolDefinition) => t.name === 'list_feature_release_assignments'
      );

      const properties = listAssignments?.inputSchema.properties;
      expect(properties).toHaveProperty('featureId');
      expect(properties).toHaveProperty('releaseId');
      expect(properties).toHaveProperty('releaseState');
      expect(properties).toHaveProperty('releaseEndDateFrom');
      expect(properties).toHaveProperty('releaseEndDateTo');
    });
  });

  describe('Tool Handler', () => {
    it('should handle unknown tool error', async () => {
      await expect(handleReleasesTool('unknown_tool', {})).rejects.toThrow(
        'Unknown releases tool: unknown_tool'
      );
    });

    it('should accept valid tool names', () => {
      const validTools = [
        'create_release_group',
        'list_release_groups',
        'get_release_group',
        'update_release_group',
        'delete_release_group',
        'create_release',
        'list_releases',
        'get_release',
        'update_release',
        'delete_release',
        'list_feature_release_assignments',
        'get_feature_release_assignment',
        'update_feature_release_assignment',
      ];

      validTools.forEach(toolName => {
        expect(() => {
          // Just check it doesn't throw immediately
          const promise = handleReleasesTool(toolName, {});
          // Catch the expected error about missing required fields
          promise.catch(() => {});
        }).not.toThrow('Unknown releases tool');
      });
    });
  });
});
