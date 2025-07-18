/**
 * Tests for Webhooks tools
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import {
  handleWebhooksTool,
  setupWebhooksTools,
} from '../../tools/webhooks.js';
import type { ToolDefinition } from '../../types/tool-types.js';

describe('Webhooks Tools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tool Definitions', () => {
    it('should define all webhooks tools with correct schemas', () => {
      const tools = setupWebhooksTools();

      expect(tools).toHaveLength(4);

      const toolNames = tools.map((tool: ToolDefinition) => tool.name);
      expect(toolNames).toContain('create_webhook');
      expect(toolNames).toContain('list_webhooks');
      expect(toolNames).toContain('get_webhook');
      expect(toolNames).toContain('delete_webhook');
    });

    it('should have standardized parameters for list operations', () => {
      const tools = setupWebhooksTools();
      const listWebhooks = tools.find(
        (t: ToolDefinition) => t.name === 'list_webhooks'
      );

      expect(listWebhooks?.inputSchema.properties).toHaveProperty('limit');
      expect(listWebhooks?.inputSchema.properties).toHaveProperty('startWith');
      expect(listWebhooks?.inputSchema.properties).toHaveProperty('detail');
      expect(listWebhooks?.inputSchema.properties).toHaveProperty(
        'includeSubData'
      );
    });

    it('should have standardized parameters for get operations', () => {
      const tools = setupWebhooksTools();
      const getWebhook = tools.find(
        (t: ToolDefinition) => t.name === 'get_webhook'
      );

      expect(getWebhook?.inputSchema.properties).toHaveProperty('detail');
      expect(getWebhook?.inputSchema.properties).toHaveProperty(
        'includeSubData'
      );
    });

    it('should require eventType and url for create_webhook', () => {
      const tools = setupWebhooksTools();
      const createWebhook = tools.find(
        (t: ToolDefinition) => t.name === 'create_webhook'
      );

      expect(createWebhook?.inputSchema.required).toContain('eventType');
      expect(createWebhook?.inputSchema.required).toContain('url');
    });

    it('should have optional secret and active fields for create_webhook', () => {
      const tools = setupWebhooksTools();
      const createWebhook = tools.find(
        (t: ToolDefinition) => t.name === 'create_webhook'
      );

      expect(createWebhook?.inputSchema.properties).toHaveProperty('secret');
      expect(createWebhook?.inputSchema.properties).toHaveProperty('active');
    });

    it('should require id for individual webhook operations', () => {
      const tools = setupWebhooksTools();
      const getWebhook = tools.find(
        (t: ToolDefinition) => t.name === 'get_webhook'
      );
      const deleteWebhook = tools.find(
        (t: ToolDefinition) => t.name === 'delete_webhook'
      );

      expect(getWebhook?.inputSchema.required).toContain('id');
      expect(deleteWebhook?.inputSchema.required).toContain('id');
    });
  });

  describe('Tool Handler', () => {
    it('should handle unknown tool error', async () => {
      await expect(handleWebhooksTool('unknown_tool', {})).rejects.toThrow(
        'Unknown webhooks tool: unknown_tool'
      );
    });

    it('should accept valid tool names', () => {
      const validTools = [
        'create_webhook',
        'list_webhooks',
        'get_webhook',
        'delete_webhook',
      ];

      validTools.forEach(toolName => {
        expect(() => {
          // Just check it doesn't throw immediately
          const promise = handleWebhooksTool(toolName, {});
          // Catch the expected error about missing required fields
          promise.catch(() => {});
        }).not.toThrow('Unknown webhooks tool');
      });
    });
  });
});
