/**
 * JIRA integrations management tools
 */
import { withContext, formatResponse } from '../utils/tool-wrapper.js';
import { isEnterpriseError } from '../utils/parameter-utils.js';
import { ProductboardError } from '../errors/index.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export function setupJiraIntegrationsTools() {
  return [
    {
      name: 'get_jira_integrations',
      description: 'List all JIRA integrations',
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
      name: 'get_jira_integration',
      description: 'Retrieve a specific JIRA integration',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'JIRA integration ID',
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
      name: 'get_jira_integration_connections',
      description:
        'List all JIRA integration connections for a specific integration',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'JIRA integration ID',
          },
          'connection.issueKey': {
            type: 'string',
            description: 'Filter by JIRA issue key (e.g., "JIRA-123")',
          },
          'connection.issueId': {
            type: 'string',
            description: 'Filter by JIRA issue ID (e.g., "123456")',
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
      name: 'get_jira_integration_connection',
      description:
        'Retrieve a specific JIRA integration connection between a feature and JIRA issue',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'JIRA integration ID',
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

export async function handleJiraIntegrationsTool(name: string, args: any) {
  try {
    switch (name) {
      case 'get_jira_integrations':
        return await getJiraIntegrations(args);
      case 'get_jira_integration':
        return await getJiraIntegration(args);
      case 'get_jira_integration_connections':
        return await getJiraIntegrationConnections(args);
      case 'get_jira_integration_connection':
        return await getJiraIntegrationConnection(args);
      default:
        throw new Error(`Unknown JIRA integrations tool: ${name}`);
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

// JIRA Integration Functions

async function getJiraIntegrations(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get('/jira-integrations', {
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

async function getJiraIntegration(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(
        `/jira-integrations/${args.id}`,
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

async function getJiraIntegrationConnections(args: any) {
  return await withContext(
    async context => {
      const params: any = {};

      // Add optional filter parameters
      if (args['connection.issueKey']) {
        params['connection.issueKey'] = args['connection.issueKey'];
      }
      if (args['connection.issueId']) {
        params['connection.issueId'] = args['connection.issueId'];
      }

      const response = await context.axios.get(
        `/jira-integrations/${args.id}/connections`,
        {
          params,
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

async function getJiraIntegrationConnection(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(
        `/jira-integrations/${args.id}/connections/${args.featureId}`,
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
