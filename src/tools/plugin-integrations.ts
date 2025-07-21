/**
 * Plugin integrations management tools
 */
import { withContext, formatResponse } from '../utils/tool-wrapper.js';
import { isEnterpriseError } from '../utils/parameter-utils.js';
import { ProductboardError } from '../errors/index.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export function setupPluginIntegrationsTools() {
  return [
    {
      name: 'post_plugin_integration',
      description: 'Create a new plugin integration',
      inputSchema: {
        type: 'object',
        properties: {
          body: {
            type: 'object',
            description: 'Plugin integration data',
            properties: {
              type: {
                type: 'string',
                description: 'Type identifier (e.g., "com.mydomain.myservice")',
              },
              name: {
                type: 'string',
                description: 'Display name for the integration',
              },
              integrationStatus: {
                type: 'string',
                description: 'Status of the integration',
                enum: ['enabled', 'disabled'],
              },
              initialState: {
                type: 'object',
                description: 'Initial button state',
                properties: {
                  label: {
                    type: 'string',
                    description: 'Button label',
                  },
                },
              },
              action: {
                type: 'object',
                description: 'Action configuration',
                properties: {
                  url: {
                    type: 'string',
                    description: 'URL to call when button is clicked',
                  },
                  version: {
                    type: 'number',
                    description: 'API version',
                  },
                  headers: {
                    type: 'object',
                    description: 'HTTP headers to include',
                  },
                },
              },
            },
            required: ['type', 'name'],
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
        required: ['body'],
      },
    },
    {
      name: 'get_plugin_integrations',
      description: 'List all plugin integrations',
      inputSchema: {
        type: 'object',
        properties: {
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
      name: 'get_plugin_integration',
      description: 'Retrieve a specific plugin integration',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Plugin integration ID',
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
      name: 'patch_plugin_integration',
      description: 'Update a plugin integration (PATCH)',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Plugin integration ID',
          },
          body: {
            type: 'object',
            description: 'Plugin integration data to update',
            properties: {
              type: {
                type: 'string',
                description: 'Type identifier',
              },
              name: {
                type: 'string',
                description: 'Display name for the integration',
              },
              integrationStatus: {
                type: 'string',
                description: 'Status of the integration',
                enum: ['enabled', 'disabled'],
              },
              initialState: {
                type: 'object',
                description: 'Initial button state',
              },
              action: {
                type: 'object',
                description: 'Action configuration',
              },
            },
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
        required: ['id', 'body'],
      },
    },
    {
      name: 'put_plugin_integration',
      description: 'Update a plugin integration (PUT - deprecated)',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Plugin integration ID',
          },
          body: {
            type: 'object',
            description: 'Complete plugin integration data',
            properties: {
              type: {
                type: 'string',
                description: 'Type identifier',
              },
              name: {
                type: 'string',
                description: 'Display name for the integration',
              },
              integrationStatus: {
                type: 'string',
                description: 'Status of the integration',
                enum: ['enabled', 'disabled'],
              },
              initialState: {
                type: 'object',
                description: 'Initial button state',
              },
              action: {
                type: 'object',
                description: 'Action configuration',
              },
            },
            required: ['type', 'name'],
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
        required: ['id', 'body'],
      },
    },
    {
      name: 'delete_plugin_integration',
      description: 'Delete a plugin integration',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Plugin integration ID',
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
      name: 'get_plugin_integration_connections',
      description:
        'List plugin integration connections for a specific integration',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Plugin integration ID',
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
      name: 'get_plugin_integration_connection',
      description: 'Retrieve a specific plugin integration connection',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Plugin integration ID',
          },
          featureId: {
            type: 'string',
            description: 'Feature ID',
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
        required: ['id', 'featureId'],
      },
    },
    {
      name: 'put_plugin_integration_connection',
      description: 'Set the state of a plugin integration connection',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Plugin integration ID',
          },
          featureId: {
            type: 'string',
            description: 'Feature ID',
          },
          body: {
            type: 'object',
            description: 'Connection configuration',
            properties: {
              connection: {
                type: 'object',
                description: 'Connection state data',
                properties: {
                  state: {
                    type: 'string',
                    description: 'Connection state',
                    enum: ['initial', 'connected', 'error', 'progress'],
                  },
                  label: {
                    type: 'string',
                    description: 'Button label',
                  },
                  hoverLabel: {
                    type: 'string',
                    description: 'Hover text',
                  },
                  tooltip: {
                    type: 'string',
                    description: 'Tooltip text',
                  },
                  color: {
                    type: 'string',
                    description: 'Button color',
                    enum: ['blue', 'green', 'orange', 'red', 'gray'],
                  },
                  targetUrl: {
                    type: 'string',
                    description: 'URL to link to external system',
                  },
                },
                required: ['state'],
              },
            },
            required: ['connection'],
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
        required: ['id', 'featureId', 'body'],
      },
    },
    {
      name: 'delete_plugin_integration_connection',
      description:
        'Delete a plugin integration connection (reset to initial state)',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Plugin integration ID',
          },
          featureId: {
            type: 'string',
            description: 'Feature ID',
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
        required: ['id', 'featureId'],
      },
    },
  ];
}

export async function handlePluginIntegrationsTool(name: string, args: any) {
  try {
    switch (name) {
      case 'post_plugin_integration':
        return await createPluginIntegration(args);
      case 'get_plugin_integrations':
        return await listPluginIntegrations(args);
      case 'get_plugin_integration':
        return await getPluginIntegration(args);
      case 'patch_plugin_integration':
        return await patchPluginIntegration(args);
      case 'put_plugin_integration':
        return await putPluginIntegration(args);
      case 'delete_plugin_integration':
        return await deletePluginIntegration(args);
      case 'get_plugin_integration_connections':
        return await getPluginIntegrationConnections(args);
      case 'get_plugin_integration_connection':
        return await getPluginIntegrationConnection(args);
      case 'put_plugin_integration_connection':
        return await putPluginIntegrationConnection(args);
      case 'delete_plugin_integration_connection':
        return await deletePluginIntegrationConnection(args);
      default:
        throw new Error(`Unknown plugin integrations tool: ${name}`);
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

// Plugin Integration Management Functions

async function createPluginIntegration(args: any) {
  return await withContext(
    async context => {
      // Handle case where body might be passed as a JSON string
      let body = args.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          throw new Error('Invalid JSON in body parameter');
        }
      }

      const response = await context.axios.post('/plugin-integrations', body, {
        headers: {
          'X-Version': '1',
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(response.data),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function listPluginIntegrations(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get('/plugin-integrations', {
        headers: {
          'X-Version': '1',
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(response.data),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function getPluginIntegration(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(
        `/plugin-integrations/${args.id}`,
        {
          headers: {
            'X-Version': '1',
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(response.data),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function patchPluginIntegration(args: any) {
  return await withContext(
    async context => {
      // Handle case where body might be passed as a JSON string
      let body = args.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          throw new Error('Invalid JSON in body parameter');
        }
      }

      const response = await context.axios.patch(
        `/plugin-integrations/${args.id}`,
        body,
        {
          headers: {
            'X-Version': '1',
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(response.data),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function putPluginIntegration(args: any) {
  return await withContext(
    async context => {
      // Handle case where body might be passed as a JSON string
      let body = args.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          throw new Error('Invalid JSON in body parameter');
        }
      }

      const response = await context.axios.put(
        `/plugin-integrations/${args.id}`,
        body,
        {
          headers: {
            'X-Version': '1',
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(response.data),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deletePluginIntegration(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/plugin-integrations/${args.id}`, {
        headers: {
          'X-Version': '1',
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Plugin integration ${args.id} deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// Plugin Integration Connection Functions

async function getPluginIntegrationConnections(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(
        `/plugin-integrations/${args.id}/connections`,
        {
          headers: {
            'X-Version': '1',
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(response.data),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function getPluginIntegrationConnection(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(
        `/plugin-integrations/${args.id}/connections/${args.featureId}`,
        {
          headers: {
            'X-Version': '1',
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(response.data),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function putPluginIntegrationConnection(args: any) {
  return await withContext(
    async context => {
      // Handle case where body might be passed as a JSON string
      let body = args.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          throw new Error('Invalid JSON in body parameter');
        }
      }

      const response = await context.axios.put(
        `/plugin-integrations/${args.id}/connections/${args.featureId}`,
        body,
        {
          headers: {
            'X-Version': '1',
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(response.data),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deletePluginIntegrationConnection(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(
        `/plugin-integrations/${args.id}/connections/${args.featureId}`,
        {
          headers: {
            'X-Version': '1',
          },
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Plugin integration connection deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}
