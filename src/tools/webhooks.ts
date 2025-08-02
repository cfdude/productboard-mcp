/**
 * Webhooks management tools
 */
import { withContext, formatResponse } from '../utils/tool-wrapper.js';
import {
  normalizeListParams,
  normalizeGetParams,
  filterByDetailLevel,
  filterArrayByDetailLevel,
  isEnterpriseError,
} from '../utils/parameter-utils.js';
import {
  StandardListParams,
  StandardGetParams,
} from '../types/parameter-types.js';
import { ProductboardError } from '../errors/index.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export function setupWebhooksTools() {
  return [
    {
      name: 'create_webhook',
      description: 'Create a new webhook subscription',
      inputSchema: {
        type: 'object',
        properties: {
          events: {
            type: 'array',
            description:
              'Array of event types to subscribe to (e.g., [{eventType: "feature.created"}, {eventType: "note.updated"}])',
            items: {
              type: 'object',
              properties: {
                eventType: {
                  type: 'string',
                  description:
                    'Event type (e.g., feature.created, note.updated, objective.created)',
                },
              },
              required: ['eventType'],
            },
          },
          name: {
            type: 'string',
            description: 'Name for the webhook subscription',
          },
          url: {
            type: 'string',
            description: 'Webhook URL to receive notifications',
          },
          headers: {
            type: 'object',
            description:
              'Optional headers to include in webhook requests (e.g., {"X-Custom-Header": "value", "Content-Type": "application/json"})',
          },
          version: {
            type: 'number',
            description: 'Notification version (default: 1)',
          },
          instance: {
            type: 'string',
            description: 'Productboard instance name (optional)',
          },
          workspaceId: {
            type: 'string',
            description: 'Workspace ID (optional)',
          },
        },
        required: ['events', 'name', 'url'],
      },
    },
    {
      name: 'list_webhooks',
      description: 'List all webhook subscriptions',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description:
              'Maximum number of webhooks to return (1-100, default: 100)',
          },
          startWith: {
            type: 'number',
            description: 'Offset for pagination (default: 0)',
          },
          detail: {
            type: 'string',
            enum: ['basic', 'standard', 'full'],
            description: 'Level of detail (default: basic)',
          },
          includeSubData: {
            type: 'boolean',
            description: 'Include nested complex JSON sub-data',
          },
          instance: {
            type: 'string',
            description: 'Productboard instance name (optional)',
          },
          workspaceId: {
            type: 'string',
            description: 'Workspace ID (optional)',
          },
        },
      },
    },
    {
      name: 'get_webhook',
      description: 'Get a specific webhook subscription by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Webhook ID',
          },
          detail: {
            type: 'string',
            enum: ['basic', 'standard', 'full'],
            description: 'Level of detail (default: standard)',
          },
          includeSubData: {
            type: 'boolean',
            description: 'Include nested complex JSON sub-data',
          },
          instance: {
            type: 'string',
            description: 'Productboard instance name (optional)',
          },
          workspaceId: {
            type: 'string',
            description: 'Workspace ID (optional)',
          },
        },
        required: ['id'],
      },
    },
    {
      name: 'delete_webhook',
      description: 'Delete a webhook subscription',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Webhook ID',
          },
          instance: {
            type: 'string',
            description: 'Productboard instance name (optional)',
          },
          workspaceId: {
            type: 'string',
            description: 'Workspace ID (optional)',
          },
        },
        required: ['id'],
      },
    },
  ];
}

export async function handleWebhooksTool(name: string, args: any) {
  try {
    switch (name) {
      case 'create_webhook':
      case 'post_webhook': // Support both names for compatibility
        return await createWebhook(args);
      case 'list_webhooks':
      case 'get_webhooks': // Support both names for compatibility
        return await listWebhooks(args);
      case 'get_webhook':
        return await getWebhook(args);
      case 'delete_webhook':
        return await deleteWebhook(args);
      default:
        throw new Error(`Unknown webhooks tool: ${name}`);
    }
  } catch (error: any) {
    const enterpriseInfo = isEnterpriseError(error);
    if (enterpriseInfo.isEnterpriseFeature) {
      throw new ProductboardError(
        ErrorCode.InvalidRequest,
        enterpriseInfo.message,
        error
      );
    }
    throw error;
  }
}

async function createWebhook(args: any) {
  return await withContext(
    async context => {
      // Handle both direct parameters and body parameter formats
      let webhookParams = args;
      if (args.body) {
        // Parse body if it's a string (from MCP calls)
        webhookParams =
          typeof args.body === 'string' ? JSON.parse(args.body) : args.body;
      }

      // Build the webhook data structure
      const webhookData: any = {
        events: webhookParams.events,
        name: webhookParams.name,
        notification: webhookParams.notification || {
          version: webhookParams.version || 1,
          url: webhookParams.url,
        },
      };

      // Add optional headers if provided
      if (webhookParams.headers && !webhookData.notification.headers) {
        webhookData.notification.headers = webhookParams.headers;
      }

      const response = await context.axios.post('/webhooks', {
        data: webhookData,
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              webhook: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function listWebhooks(args: StandardListParams & any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeListParams(args);
      const params: any = {
        pageLimit: normalizedParams.limit,
        pageOffset: normalizedParams.startWith,
      };

      const response = await context.axios.get('/webhooks', { params });

      const result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData && result.data) {
        result.data = filterArrayByDetailLevel(
          result.data,
          'webhook',
          normalizedParams.detail
        );
      }

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(result),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function getWebhook(
  args: StandardGetParams & {
    id: string;
    instance?: string;
    workspaceId?: string;
  }
) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/webhooks/${args.id}`);

      let result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(
          result,
          'webhook',
          normalizedParams.detail
        );
      }

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(result),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deleteWebhook(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/webhooks/${args.id}`);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Webhook ${args.id} deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}
