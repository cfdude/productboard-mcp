/**
 * Features, Components, and Products management tools
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

/**
 * Features Tools
 */
export function setupFeaturesTools() {
  return [
    // Features
    {
      name: 'create_feature',
      description: 'Create a new feature in Productboard',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Feature name',
          },
          description: {
            type: 'string',
            description: 'Feature description',
          },
          status: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Status ID' },
              name: { type: 'string', description: 'Status name' },
            },
          },
          owner: {
            type: 'object',
            properties: {
              email: { type: 'string', description: 'Owner email' },
            },
          },
          parent: {
            type: 'object',
            description: 'Parent entity to associate this feature with',
            properties: {
              id: {
                type: 'string',
                description:
                  'ID of the parent entity (product, component, or feature)',
              },
              type: {
                type: 'string',
                enum: ['product', 'component', 'feature'],
                description: 'Type of parent entity',
              },
            },
            required: ['id', 'type'],
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
      name: 'get_features',
      description: 'List all features in Productboard',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description:
              'Maximum number of features to return (1-100, default: 100)',
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
          archived: {
            type: 'boolean',
            description: 'Filter by archived status',
          },
          noteId: {
            type: 'string',
            description: 'Filter by associated note ID',
          },
          ownerEmail: {
            type: 'string',
            description: 'Filter by owner email',
          },
          parentId: {
            type: 'string',
            description: 'Filter by parent feature ID',
          },
          statusId: {
            type: 'string',
            description: 'Filter by status ID',
          },
          statusName: {
            type: 'string',
            description: 'Filter by status name',
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
      name: 'get_feature',
      description: 'Get a specific feature by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Feature ID',
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
      name: 'update_feature',
      description: 'Update a feature',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Feature ID',
          },
          name: {
            type: 'string',
            description: 'Feature name',
          },
          description: {
            type: 'string',
            description: 'Feature description',
          },
          status: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Status ID' },
              name: { type: 'string', description: 'Status name' },
            },
          },
          owner: {
            type: 'object',
            properties: {
              email: { type: 'string', description: 'Owner email' },
            },
          },
          archived: {
            type: 'boolean',
            description: 'Archive status',
          },
          timeframe: {
            type: 'object',
            description: 'Feature timeframe with start and end dates',
            properties: {
              startDate: {
                type: 'string',
                description: 'Start date (YYYY-MM-DD)',
              },
              endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
              granularity: {
                type: 'string',
                description: 'Timeframe granularity (optional)',
              },
            },
          },
          parentId: {
            type: 'string',
            description: 'Parent feature ID (for sub-features)',
          },
          componentId: {
            type: 'string',
            description:
              'Component ID (to move feature to a different component)',
          },
          productId: {
            type: 'string',
            description: 'Product ID (to move feature to a different product)',
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
      name: 'delete_feature',
      description: 'Delete a feature',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
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
        required: ['id'],
      },
    },

    // Components
    {
      name: 'create_component',
      description: 'Create a new component in Productboard',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Component name',
          },
          description: {
            type: 'string',
            description: 'Component description',
          },
          productId: {
            type: 'string',
            description: 'Product ID this component belongs to',
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
      name: 'get_components',
      description: 'List all components in Productboard',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description:
              'Maximum number of components to return (1-100, default: 100)',
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
          productId: {
            type: 'string',
            description: 'Filter by product ID',
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
      name: 'get_component',
      description: 'Get a specific component by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Component ID',
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
      name: 'update_component',
      description: 'Update a component',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Component ID',
          },
          name: {
            type: 'string',
            description: 'Component name',
          },
          description: {
            type: 'string',
            description: 'Component description',
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

    // Products
    {
      name: 'get_products',
      description: 'List all products in Productboard',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description:
              'Maximum number of products to return (1-100, default: 100)',
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
      name: 'get_product',
      description: 'Get a specific product by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Product ID',
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
      name: 'update_product',
      description: 'Update a product',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Product ID',
          },
          name: {
            type: 'string',
            description: 'Product name',
          },
          description: {
            type: 'string',
            description: 'Product description',
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

export async function handleFeaturesTool(name: string, args: any) {
  try {
    switch (name) {
      // Features
      case 'create_feature':
        return await createFeature(args);
      case 'get_features':
        return await listFeatures(args);
      case 'get_feature':
        return await getFeature(args);
      case 'update_feature':
      case 'update_feature_deprecated':
        return await updateFeature(args);
      case 'delete_feature':
        return await deleteFeature(args);

      // Components
      case 'create_component':
        return await createComponent(args);
      case 'get_components':
        return await listComponents(args);
      case 'get_component':
        return await getComponent(args);
      case 'update_component':
      case 'update_component_deprecated':
        return await updateComponent(args);

      // Products
      case 'get_products':
        return await listProducts(args);
      case 'get_product':
        return await getProduct(args);
      case 'update_product':
      case 'update_product_deprecated':
        return await updateProduct(args);

      // Feature linking (implement basic stubs for now)
      case 'list_links_to_initiatives':
      case 'create_initiative_link':
      case 'delete_initiative_link':
      case 'list_links_to_objectives':
      case 'create_objective_link':
      case 'delete_objective_link':
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Feature linking not yet implemented',
              }),
            },
          ],
        };

      // Feature statuses
      case 'get_feature_statuses':
        return await getFeatureStatuses(args);

      default:
        throw new Error(`Unknown features tool: ${name}`);
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

// Features operations
async function createFeature(args: any) {
  return await withContext(
    async context => {
      // Debug logging disabled for production

      // Determine parent structure - required per Productboard hierarchy
      let parent = null;

      if (args.parentId) {
        // Sub-feature: parent is another feature
        parent = { feature: { id: args.parentId } };
        // Using parentId
      } else if (args.componentId) {
        // Top-level feature: parent is a component
        parent = { component: { id: args.componentId } };
        // Using componentId
      } else if (args.productId) {
        // Top-level feature: parent is a product
        parent = { product: { id: args.productId } };
        // Using productId
      } else {
        // Parent is required - try to get first available component as fallback
        try {
          const componentsResponse = await context.axios.get('/components', {
            params: { pageLimit: 1 },
          });
          if (
            componentsResponse.data.data &&
            componentsResponse.data.data.length > 0
          ) {
            const firstComponent = componentsResponse.data.data[0];
            parent = { component: { id: firstComponent.id } };
          } else {
            // If no components, try to get first product
            const productsResponse = await context.axios.get('/products', {
              params: { pageLimit: 1 },
            });
            if (
              productsResponse.data.data &&
              productsResponse.data.data.length > 0
            ) {
              const firstProduct = productsResponse.data.data[0];
              parent = { product: { id: firstProduct.id } };
            }
          }
        } catch {
          // If we can't find a parent, this will fail at API level with proper error
        }
      }

      // Validate that we have a parent (required by Productboard hierarchy)
      if (!parent) {
        throw new Error(
          'Parent is required for features. Provide parentId (for sub-features), componentId, or productId.'
        );
      }

      const body: any = {
        data: {
          name: args.name,
          type: 'feature', // API requires this field
          description: args.description ? `<p>${args.description}</p>` : '', // API expects HTML content
          status: args.status || { name: 'Candidate' }, // API requires this field with default
        },
      };

      // Only add parent if we have one
      if (parent) {
        body.data.parent = parent;
        // Adding parent to body
      } else {
        // No parent found
      }

      // Final body prepared

      if (args.owner) body.data.owner = args.owner;

      const response = await context.axios.post('/features', body);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              feature: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function listFeatures(args: StandardListParams & any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeListParams(args);
      const params: any = {
        pageLimit: normalizedParams.limit,
        pageOffset: normalizedParams.startWith,
      };

      // Add filters
      if (args.archived !== undefined) params.archived = args.archived;
      if (args.noteId) params['note.id'] = args.noteId;
      if (args.ownerEmail) params['owner.email'] = args.ownerEmail;
      if (args.parentId) params['parent.id'] = args.parentId;
      if (args.statusId) params['status.id'] = args.statusId;
      if (args.statusName) params['status.name'] = args.statusName;

      const response = await context.axios.get('/features', { params });

      const result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData && result.data) {
        result.data = filterArrayByDetailLevel(
          result.data,
          'feature',
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

async function getFeature(
  args: StandardGetParams & {
    id: string;
    instance?: string;
    workspaceId?: string;
  }
) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/features/${args.id}`);

      let result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(
          result,
          'feature',
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

async function updateFeature(args: any) {
  return await withContext(
    async context => {
      const body: any = {};

      if (args.name) body.name = args.name;
      if (args.description !== undefined) body.description = args.description;
      if (args.status) body.status = args.status;
      if (args.owner) body.owner = args.owner;
      if (args.archived !== undefined) body.archived = args.archived;
      if (args.timeframe) {
        // Handle timeframe parameter - can be string or object
        if (typeof args.timeframe === 'string') {
          try {
            body.timeframe = JSON.parse(args.timeframe);
          } catch {
            // If parsing fails, treat as invalid
            throw new Error(
              'Invalid timeframe format. Expected JSON object with startDate and endDate'
            );
          }
        } else {
          body.timeframe = args.timeframe;
        }
      }

      // Handle parent reassignment (component/product changes)
      if (args.parentId || args.componentId || args.productId) {
        let parent = null;

        if (args.parentId) {
          // Sub-feature: parent is another feature
          parent = { feature: { id: args.parentId } };
        } else if (args.componentId) {
          // Top-level feature: parent is a component
          parent = { component: { id: args.componentId } };
        } else if (args.productId) {
          // Top-level feature: parent is a product
          parent = { product: { id: args.productId } };
        }

        if (parent) {
          body.parent = parent;
        }
      }

      const response = await context.axios.patch(`/features/${args.id}`, {
        data: body,
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              feature: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deleteFeature(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/features/${args.id}`);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Feature ${args.id} deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// Components operations
async function createComponent(args: any) {
  return await withContext(
    async context => {
      const body: any = {
        name: args.name,
      };

      if (args.description) body.description = args.description;
      if (args.productId) body.product = { id: args.productId };

      const response = await context.axios.post('/components', body);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              component: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function listComponents(args: StandardListParams & any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeListParams(args);
      const params: any = {
        pageLimit: normalizedParams.limit,
        pageOffset: normalizedParams.startWith,
      };

      if (args.productId) params['product.id'] = args.productId;

      const response = await context.axios.get('/components', { params });

      const result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData && result.data) {
        result.data = filterArrayByDetailLevel(
          result.data,
          'component',
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

async function getComponent(
  args: StandardGetParams & {
    id: string;
    instance?: string;
    workspaceId?: string;
  }
) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/components/${args.id}`);

      let result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(
          result,
          'component',
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

async function updateComponent(args: any) {
  return await withContext(
    async context => {
      const body: any = {};

      if (args.name) body.name = args.name;
      if (args.description !== undefined) body.description = args.description;

      const response = await context.axios.patch(`/components/${args.id}`, {
        data: body,
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              component: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// Products operations
async function listProducts(args: StandardListParams & any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeListParams(args);
      const params: any = {
        pageLimit: normalizedParams.limit,
        pageOffset: normalizedParams.startWith,
      };

      const response = await context.axios.get('/products', { params });

      const result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData && result.data) {
        result.data = filterArrayByDetailLevel(
          result.data,
          'product',
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

async function getProduct(
  args: StandardGetParams & {
    id: string;
    instance?: string;
    workspaceId?: string;
  }
) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/products/${args.id}`);

      let result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(
          result,
          'product',
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

async function updateProduct(args: any) {
  return await withContext(
    async context => {
      const body: any = {};

      if (args.name) body.name = args.name;
      if (args.description !== undefined) body.description = args.description;

      const response = await context.axios.patch(`/products/${args.id}`, {
        data: body,
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              product: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function getFeatureStatuses(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get('/feature-statuses');

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
