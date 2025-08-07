/**
 * Users management tools
 */
import { withContext, formatResponse } from '../utils/tool-wrapper.js';
import {
  normalizeListParams,
  normalizeGetParams,
  filterByDetailLevel,
  filterArrayByDetailLevel,
  isEnterpriseError,
} from '../utils/parameter-utils.js';
import { fetchAllPages } from '../utils/pagination-handler.js';
import {
  StandardListParams,
  StandardGetParams,
} from '../types/parameter-types.js';
import { ProductboardError } from '../errors/index.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export function setupUsersTools() {
  return [
    {
      name: 'create_user',
      description: 'Create a new user in Productboard',
      inputSchema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'User email address',
          },
          name: {
            type: 'string',
            description: 'User full name',
          },
          role: {
            type: 'string',
            description: 'User role (e.g., admin, member, viewer)',
          },
          companyId: {
            type: 'string',
            description: 'Company ID to associate with the user',
          },
          externalId: {
            type: 'string',
            description: 'External ID for the user',
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
        required: ['email'],
      },
    },
    {
      name: 'get_users',
      description: 'List all users in Productboard',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description:
              'Maximum number of users to return (1-100, default: 100)',
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
      name: 'get_user',
      description: 'Get a specific user by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'User ID',
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
      name: 'update_user',
      description: 'Update an existing user',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'User ID',
          },
          name: {
            type: 'string',
            description: 'Updated user name',
          },
          role: {
            type: 'string',
            description: 'Updated user role',
          },
          companyId: {
            type: 'string',
            description: 'Updated company ID',
          },
          externalId: {
            type: 'string',
            description: 'Updated external ID',
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
      name: 'delete_user',
      description: 'Delete a user',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'User ID',
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

export async function handleUsersTool(name: string, args: any) {
  try {
    switch (name) {
      case 'create_user':
        return await createUser(args);
      case 'get_users':
        return await listUsers(args);
      case 'get_user':
        return await getUser(args);
      case 'update_user':
        return await updateUser(args);
      case 'delete_user':
        return await deleteUser(args);
      default:
        throw new Error(`Unknown users tool: ${name}`);
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

async function createUser(args: any) {
  return await withContext(
    async context => {
      const body: any = {
        email: args.email,
      };

      if (args.name) body.name = args.name;
      if (args.role) body.role = args.role;
      if (args.companyId) body.company = { id: args.companyId };
      if (args.externalId) body.externalId = args.externalId;

      const response = await context.axios.post('/users', body);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              user: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function listUsers(args: StandardListParams & any) {
  return await withContext(
    async context => {
      const normalized = normalizeListParams(args);
      const params: any = {};

      // Use proper pagination handler to fetch all pages
      const paginatedResponse = await fetchAllPages(
        context.axios,
        '/users',
        params,
        {
          maxItems: normalized.limit > 100 ? normalized.limit : undefined,
          onPageFetched: (pageData, pageNum, totalSoFar) => {
            console.log(
              `📄 Fetched users page ${pageNum}: ${pageData.length} users (total: ${totalSoFar})`
            );
          },
        }
      );

      const result = {
        data: paginatedResponse.data,
        links: paginatedResponse.links,
        meta: {
          ...paginatedResponse.meta,
          totalFetched: paginatedResponse.data.length,
        },
      };

      // Apply detail level filtering after fetching all data
      if (!normalized.includeSubData && result.data) {
        result.data = filterArrayByDetailLevel(
          result.data,
          'user',
          normalized.detail
        );
      }

      // Apply client-side limit after filtering (if requested limit < total available)
      if (normalized.limit && normalized.limit < result.data.length) {
        result.data = result.data.slice(
          normalized.startWith || 0,
          (normalized.startWith || 0) + normalized.limit
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

async function getUser(
  args: StandardGetParams & {
    id: string;
    instance?: string;
    workspaceId?: string;
  }
) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/users/${args.id}`);

      let result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(result, 'user', normalizedParams.detail);
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

async function updateUser(args: any) {
  return await withContext(
    async context => {
      const body: any = {};

      if (args.name) body.name = args.name;
      if (args.role) body.role = args.role;
      if (args.companyId) body.company = { id: args.companyId };
      if (args.externalId) body.externalId = args.externalId;

      const response = await context.axios.patch(`/users/${args.id}`, {
        data: body,
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              user: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deleteUser(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/users/${args.id}`);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `User ${args.id} deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}
