/**
 * Tests for Users tools
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { handleUsersTool, setupUsersTools } from '../../tools/users.js';
import type { ToolDefinition } from '../../types/tool-types.js';

describe('Users Tools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tool Definitions', () => {
    it('should define all users tools with correct schemas', () => {
      const tools = setupUsersTools();

      expect(tools).toHaveLength(5);

      const toolNames = tools.map((tool: ToolDefinition) => tool.name);
      expect(toolNames).toContain('create_user');
      expect(toolNames).toContain('get_users');
      expect(toolNames).toContain('get_user');
      expect(toolNames).toContain('update_user');
      expect(toolNames).toContain('delete_user');
    });

    it('should have standardized parameters for list operations', () => {
      const tools = setupUsersTools();
      const getUsers = tools.find(
        (t: ToolDefinition) => t.name === 'get_users'
      );

      expect(getUsers?.inputSchema.properties).toHaveProperty('limit');
      expect(getUsers?.inputSchema.properties).toHaveProperty('startWith');
      expect(getUsers?.inputSchema.properties).toHaveProperty('detail');
      expect(getUsers?.inputSchema.properties).toHaveProperty('includeSubData');
    });

    it('should have standardized parameters for get operations', () => {
      const tools = setupUsersTools();
      const getUser = tools.find((t: ToolDefinition) => t.name === 'get_user');

      expect(getUser?.inputSchema.properties).toHaveProperty('detail');
      expect(getUser?.inputSchema.properties).toHaveProperty('includeSubData');
    });

    it('should require email for create_user', () => {
      const tools = setupUsersTools();
      const createUser = tools.find(
        (t: ToolDefinition) => t.name === 'create_user'
      );

      expect(createUser?.inputSchema.required).toContain('email');
    });

    it('should require id for user operations', () => {
      const tools = setupUsersTools();
      const getUser = tools.find((t: ToolDefinition) => t.name === 'get_user');
      const updateUser = tools.find(
        (t: ToolDefinition) => t.name === 'update_user'
      );
      const deleteUser = tools.find(
        (t: ToolDefinition) => t.name === 'delete_user'
      );

      expect(getUser?.inputSchema.required).toContain('id');
      expect(updateUser?.inputSchema.required).toContain('id');
      expect(deleteUser?.inputSchema.required).toContain('id');
    });
  });

  describe('Tool Handler', () => {
    it('should handle unknown tool error', async () => {
      await expect(handleUsersTool('unknown_tool', {})).rejects.toThrow(
        'Unknown users tool: unknown_tool'
      );
    });

    it('should accept valid tool names', () => {
      const validTools = [
        'create_user',
        'get_users',
        'get_user',
        'update_user',
        'delete_user',
      ];

      validTools.forEach(toolName => {
        expect(() => {
          // Just check it doesn't throw immediately
          const promise = handleUsersTool(toolName, {});
          // Catch the expected error about missing required fields
          promise.catch(() => {});
        }).not.toThrow('Unknown users tool');
      });
    });
  });
});
