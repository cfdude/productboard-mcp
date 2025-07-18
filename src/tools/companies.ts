/**
 * Companies management tools
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

export function setupCompaniesTools() {
  return [
    {
      name: 'create_company',
      description: 'Create a new company',
      inputSchema: {
        type: 'object',
        properties: {
          body: {
            type: 'object',
            description: 'Company data',
            properties: {
              name: {
                type: 'string',
                description: 'Company name',
              },
              domain: {
                type: 'string',
                description: 'Company domain',
              },
              description: {
                type: 'string',
                description: 'Company description',
              },
            },
            required: ['name'],
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
      name: 'get_companies',
      description: 'List all companies',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of records to return (1-100)',
            default: 100,
            minimum: 1,
            maximum: 100,
          },
          startWith: {
            type: 'number',
            description: 'Number of records to skip',
            default: 0,
            minimum: 0,
          },
          detail: {
            type: 'string',
            description: 'Level of detail (basic, standard, full)',
            default: 'basic',
            enum: ['basic', 'standard', 'full'],
          },
          includeSubData: {
            type: 'boolean',
            description: 'Include nested sub-data',
            default: false,
          },
          featureId: {
            type: 'string',
            description: 'Filter by feature ID',
          },
          hasNotes: {
            type: 'boolean',
            description: 'Filter companies that have notes',
          },
          term: {
            type: 'string',
            description: 'Search term',
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
      name: 'get_company',
      description: 'Retrieve a specific company',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Company ID',
          },
          detail: {
            type: 'string',
            description: 'Level of detail (basic, standard, full)',
            default: 'standard',
            enum: ['basic', 'standard', 'full'],
          },
          includeSubData: {
            type: 'boolean',
            description: 'Include nested sub-data',
            default: false,
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
      name: 'update_company',
      description: 'Update a company',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Company ID',
          },
          body: {
            type: 'object',
            description: 'Company data to update',
            properties: {
              name: {
                type: 'string',
                description: 'Company name',
              },
              domain: {
                type: 'string',
                description: 'Company domain',
              },
              description: {
                type: 'string',
                description: 'Company description',
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
      name: 'delete_company',
      description: 'Delete a company',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Company ID',
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

export async function handleCompaniesTool(name: string, args: any) {
  try {
    switch (name) {
      case 'create_company':
        return await createCompany(args);
      case 'get_companies':
        return await listCompanies(args);
      case 'get_company':
        return await getCompany(args);
      case 'update_company':
        return await updateCompany(args);
      case 'delete_company':
        return await deleteCompany(args);
      default:
        throw new Error(`Unknown companies tool: ${name}`);
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

async function createCompany(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.post(
        '/companies',
        { data: args.body },
        {
          headers: {
            'Productboard-Partner-Id': args['Productboard-Partner-Id'],
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

async function listCompanies(args: StandardListParams & any) {
  return await withContext(
    async context => {
      const normalized = normalizeListParams(args);

      const params: any = {
        pageLimit: normalized.limit,
        pageOffset: normalized.startWith,
      };

      // Add optional filters
      if (args.featureId) params.featureId = args.featureId;
      if (args.hasNotes !== undefined) params.hasNotes = args.hasNotes;
      if (args.term) params.term = args.term;

      const response = await context.axios.get('/companies', { params });

      const data = response.data;

      // Apply detail level filtering
      if (data.data && Array.isArray(data.data)) {
        data.data = filterArrayByDetailLevel(
          data.data,
          'company',
          normalized.detail
        );
      }

      // Remove sub-data if not requested
      if (!normalized.includeSubData && data.data) {
        data.data = data.data.map((item: any) => {
          const filtered = { ...item };
          // Remove complex nested objects
          delete filtered._embedded;
          delete filtered._links;
          return filtered;
        });
      }

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(data),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function getCompany(args: StandardGetParams & { id: string } & any) {
  return await withContext(
    async context => {
      const normalized = normalizeGetParams(args);

      const response = await context.axios.get(`/companies/${args.id}`);

      const data = response.data;

      // Apply detail level filtering
      if (data.data) {
        data.data = filterByDetailLevel(
          data.data,
          'company',
          normalized.detail
        );
      }

      // Remove sub-data if not requested
      if (!normalized.includeSubData && data.data) {
        const filtered = { ...data.data };
        delete filtered._embedded;
        delete filtered._links;
        data.data = filtered;
      }

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(data),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function updateCompany(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.patch(`/companies/${args.id}`, {
        data: args.body,
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

async function deleteCompany(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/companies/${args.id}`);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Company ${args.id} deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}
