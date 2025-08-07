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
import { fetchAllPages } from '../utils/pagination-handler.js';

export function setupCompaniesTools() {
  return [
    {
      name: 'create_company',
      description: 'Create a new company',
      inputSchema: {
        type: 'object',
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
          externalId: {
            type: 'string',
            description: 'External ID for the company',
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
        required: ['name'],
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
    // Company Field Management Tools
    {
      name: 'create_company_field',
      description: 'Create a new custom field for companies',
      inputSchema: {
        type: 'object',
        properties: {
          body: {
            type: 'object',
            description: 'Company field data',
            properties: {
              name: {
                type: 'string',
                description: 'Field name (max 255 characters)',
                maxLength: 255,
              },
              type: {
                type: 'string',
                description: 'Field type',
                enum: ['text', 'number'],
              },
            },
            required: ['name', 'type'],
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
      name: 'list_company_fields',
      description: 'List all custom fields for companies',
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
      name: 'get_company_field',
      description: 'Retrieve a specific company custom field',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Company field ID',
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
      name: 'update_company_field',
      description: 'Update a company custom field',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Company field ID',
          },
          body: {
            type: 'object',
            description: 'Company field data to update',
            properties: {
              name: {
                type: 'string',
                description: 'Field name (max 255 characters)',
                maxLength: 255,
              },
              type: {
                type: 'string',
                description: 'Field type',
                enum: ['text', 'number'],
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
      name: 'delete_company_field',
      description: 'Delete a company custom field',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Company field ID',
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
      name: 'get_company_field_value',
      description: 'Get the value of a custom field for a specific company',
      inputSchema: {
        type: 'object',
        properties: {
          companyId: {
            type: 'string',
            description: 'Company ID',
          },
          companyCustomFieldId: {
            type: 'string',
            description: 'Company custom field ID',
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
        required: ['companyId', 'companyCustomFieldId'],
      },
    },
    {
      name: 'set_company_field_value',
      description: 'Set the value of a custom field for a specific company',
      inputSchema: {
        type: 'object',
        properties: {
          companyId: {
            type: 'string',
            description: 'Company ID',
          },
          companyCustomFieldId: {
            type: 'string',
            description: 'Company custom field ID',
          },
          body: {
            type: 'object',
            description: 'Field value',
            properties: {
              value: {
                type: ['string', 'number'],
                description:
                  'The value to set (string for text fields, number for number fields)',
              },
            },
            required: ['value'],
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
        required: ['companyId', 'companyCustomFieldId', 'body'],
      },
    },
    {
      name: 'delete_company_field_value',
      description: 'Delete the value of a custom field for a specific company',
      inputSchema: {
        type: 'object',
        properties: {
          companyId: {
            type: 'string',
            description: 'Company ID',
          },
          companyCustomFieldId: {
            type: 'string',
            description: 'Company custom field ID',
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
        required: ['companyId', 'companyCustomFieldId'],
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
      // Company Field Management
      case 'create_company_field':
        return await createCompanyField(args);
      case 'list_company_fields':
        return await listCompanyFields(args);
      case 'get_company_field':
        return await getCompanyField(args);
      case 'update_company_field':
        return await updateCompanyField(args);
      case 'delete_company_field':
        return await deleteCompanyField(args);
      case 'get_company_field_value':
        return await getCompanyFieldValue(args);
      case 'set_company_field_value':
        return await setCompanyFieldValue(args);
      case 'delete_company_field_value':
        return await deleteCompanyFieldValue(args);

      // User management tools
      case 'get_users':
        return await getUsers(args);
      case 'create_user':
        return await createUser(args);
      case 'get_user':
        return await getUser(args);
      case 'update_user':
        return await updateUser(args);
      case 'delete_user':
        return await deleteUser(args);
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
      const body: any = {
        name: args.name,
      };

      if (args.domain) body.domain = args.domain;
      if (args.description) body.description = args.description;
      if (args.externalId) body.externalId = args.externalId;

      const response = await context.axios.post(
        '/companies',
        { data: body },
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

      const params: any = {};
      // Add filters (no pagination parameters - handled by fetchAllPages)
      if (args.featureId) params.featureId = args.featureId;
      if (args.hasNotes !== undefined) params.hasNotes = args.hasNotes;
      if (args.term) params.term = args.term;

      // Use proper pagination handler to fetch all pages
      const paginatedResponse = await fetchAllPages(
        context.axios,
        '/companies',
        params,
        {
          maxItems: normalized.limit > 100 ? normalized.limit : undefined,
          onPageFetched: (_pageData, _pageNum, _totalSoFar) => {
            // Page fetched successfully
          },
        }
      );

      const result = filterArrayByDetailLevel(
        paginatedResponse.data,
        'company',
        normalized.detail
      );

      // Remove sub-data if not requested
      const processedData = !normalized.includeSubData
        ? result.map((item: any) => {
            const filtered = { ...item };
            // Remove complex nested objects
            delete filtered._embedded;
            delete filtered._links;
            return filtered;
          })
        : result;

      // Return complete response structure with proper pagination info
      const responseData = {
        data: processedData,
        meta: {
          totalRecords: processedData.length,
          totalPages: paginatedResponse.meta?.totalPages || 1,
          wasLimited: paginatedResponse.meta?.wasLimited || false,
        },
        links: {}, // Links are no longer relevant since we fetched all pages
      };

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(responseData),
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
      // Handle case where body might be passed as a JSON string
      let body = args.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          throw new Error('Invalid JSON in body parameter');
        }
      }

      const response = await context.axios.patch(`/companies/${args.id}`, {
        data: body,
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

// Company Field Management Functions

async function createCompanyField(args: any) {
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

      const response = await context.axios.post('/companies/custom-fields', {
        data: body,
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

async function listCompanyFields(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get('/companies/custom-fields');

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

async function getCompanyField(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(
        `/companies/custom-fields/${args.id}`
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

async function updateCompanyField(args: any) {
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
        `/companies/custom-fields/${args.id}`,
        {
          data: body,
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

async function deleteCompanyField(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/companies/custom-fields/${args.id}`);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Company field ${args.id} deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function getCompanyFieldValue(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(
        `/companies/${args.companyId}/custom-fields/${args.companyCustomFieldId}/value`
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

async function setCompanyFieldValue(args: any) {
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
        `/companies/${args.companyId}/custom-fields/${args.companyCustomFieldId}/value`,
        {
          data: body,
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

async function deleteCompanyFieldValue(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(
        `/companies/${args.companyId}/custom-fields/${args.companyCustomFieldId}/value`
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Company field value deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// User management functions
async function getUsers(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get('/users');
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

async function createUser(args: any) {
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

      const response = await context.axios.post('/users', { data: body });
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

async function getUser(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(`/users/${args.id}`);
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

async function updateUser(args: any) {
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

      const response = await context.axios.put(`/users/${args.id}`, {
        data: body,
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

async function deleteUser(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/users/${args.id}`);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
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
