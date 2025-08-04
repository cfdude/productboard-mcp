/**
 * Features, Components, and Products management tools
 */
import {
  normalizeListParams,
  normalizeGetParams,
  formatResponse,
  filterArrayByDetailLevel,
  filterByDetailLevel,
  isEnterpriseError,
} from '../utils/parameter-utils.js';
import { UpdateFeatureParams } from '../types/parameter-types.js';
import { fieldSelector } from '../utils/field-selection.js';
import { withContext } from '../utils/tool-wrapper.js';
import { ProductboardError, ValidationError } from '../errors/index.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * Features Tools
 */
export function setupFeaturesTools() {
  return [
    ...getFeatureToolSchemas(),
    ...getComponentToolSchemas(),
    ...getProductToolSchemas(),
    ...getUtilityToolSchemas(),
  ];
}

function getFeatureToolSchemas() {
  return [
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
            description:
              'Feature description (HTML format required, e.g., "<p>Description text</p>")',
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
        additionalProperties: true,
      },
    },
    {
      name: 'get_features',
      description: 'List all features in Productboard',
      inputSchema: {
        type: 'object',
        properties: {
          ...getStandardListProperties(),
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
          timeframeDuration: {
            type: 'string',
            description:
              'Filter by exact timeframe duration (e.g., "2w", "1m", "3w2d"). Range: 1w-12m',
          },
          timeframeDurationMin: {
            type: 'string',
            description:
              'Filter by minimum timeframe duration (e.g., "1w", "2m"). Range: 1w-12m',
          },
          timeframeDurationMax: {
            type: 'string',
            description:
              'Filter by maximum timeframe duration (e.g., "4w", "6m"). Range: 1w-12m',
          },
          ...getResponseOptimizationProperties(),
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
          ...getStandardGetProperties(),
          includeCustomFields: {
            type: 'boolean',
            description:
              'Include available custom fields and their current values for this feature',
          },
          ...getResponseOptimizationProperties(),
        },
        required: ['id'],
      },
    },
    {
      name: 'update_feature',
      description:
        'Update a feature. Supports both standard fields and custom fields - pass custom field names as additional parameters (e.g., "T-Shirt Sizing": "large").',
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
            description:
              'Feature description (HTML format required, e.g., "<p>Description text</p>")',
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
        additionalProperties: true,
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
  ];
}

function getComponentToolSchemas() {
  return [
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
            description:
              'Component description (HTML format required, e.g., "<p>Description text</p>")',
          },
          parent: {
            type: 'object',
            description: 'Parent entity to associate this component with',
            properties: {
              product: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'ID of the parent product',
                  },
                },
                required: ['id'],
                description: 'Parent product information',
              },
            },
            required: ['product'],
          },
          ownerEmail: {
            type: 'string',
            description: 'Owner email for the component (optional)',
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
        additionalProperties: true,
      },
    },
    {
      name: 'get_components',
      description: 'List all components in Productboard',
      inputSchema: {
        type: 'object',
        properties: {
          ...getStandardListProperties(),
          productId: {
            type: 'string',
            description: 'Filter by product ID',
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
          ...getStandardGetProperties(),
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
            description:
              'Component description (HTML format required, e.g., "<p>Description text</p>")',
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

function getProductToolSchemas() {
  return [
    {
      name: 'get_products',
      description: 'List all products in Productboard',
      inputSchema: {
        type: 'object',
        properties: {
          ...getStandardListProperties(),
          ...getFieldSelectionProperties(),
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
          ...getStandardGetProperties(),
          ...getFieldSelectionProperties(),
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
            description:
              'Product description (HTML format required, e.g., "<p>Description text</p>")',
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

function getUtilityToolSchemas() {
  return [
    {
      name: 'get_available_fields',
      description:
        'Get available fields for precise field selection. Shows all possible fields for an entity type with examples and usage patterns.',
      inputSchema: {
        type: 'object',
        properties: {
          entityType: {
            type: 'string',
            enum: [
              'feature',
              'note',
              'company',
              'component',
              'product',
              'user',
              'objective',
              'initiative',
              'keyResult',
              'release',
              'releaseGroup',
            ],
            description: 'Entity type to get available fields for',
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
        required: ['entityType'],
      },
    },
  ];
}

function getStandardListProperties() {
  return {
    limit: {
      type: 'number',
      description: 'Maximum number of items to return (1-100, default: 100)',
    },
    startWith: {
      type: 'number',
      description: 'Offset for pagination (default: 0)',
    },
    detail: {
      type: 'string',
      enum: ['basic', 'standard', 'full'],
      description:
        'Level of detail (default: basic). DEPRECATED: Use fields parameter for precise selection.',
    },
    outputFormat: {
      type: 'string',
      enum: ['json', 'markdown', 'csv', 'summary'],
      description:
        'Output format for response data. JSON (default), Markdown (human-readable), CSV (tabular), Summary (condensed)',
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
  };
}

function getStandardGetProperties() {
  return {
    detail: {
      type: 'string',
      enum: ['basic', 'standard', 'full'],
      description:
        'Level of detail (default: standard). DEPRECATED: Use fields parameter for precise selection.',
    },
    outputFormat: {
      type: 'string',
      enum: ['json', 'markdown', 'csv', 'summary'],
      description:
        'Output format for response data. JSON (default), Markdown (human-readable), CSV (tabular), Summary (condensed)',
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
  };
}

function getFieldSelectionProperties() {
  return {
    fields: {
      type: 'array',
      items: { type: 'string' },
      description:
        'Specific fields to include (dot notation supported for nested fields, e.g., "owner.email")',
    },
    exclude: {
      type: 'array',
      items: { type: 'string' },
      description: 'Fields to exclude from response',
    },
    validateFields: {
      type: 'boolean',
      description:
        'Validate field names and return suggestions for invalid fields',
    },
  };
}

function getResponseOptimizationProperties() {
  return {
    maxLength: {
      type: 'number',
      description:
        'Maximum response length in characters (100-50000). Enables smart truncation of long fields.',
    },
    truncateFields: {
      type: 'array',
      items: { type: 'string' },
      description:
        'Fields to truncate if response is too long (e.g., ["description", "notes"])',
    },
    truncateIndicator: {
      type: 'string',
      description: 'Indicator to append to truncated fields (default: "...")',
    },
    includeDescription: {
      type: 'boolean',
      description: 'Include description fields in response (default: true)',
    },
    includeCustomFieldsStrategy: {
      type: 'string',
      enum: ['all', 'onlyWithValues', 'none'],
      description: 'Custom field inclusion strategy (default: "all")',
    },
    includeLinks: {
      type: 'boolean',
      description:
        'Include links and relationships in response (default: true)',
    },
    includeEmpty: {
      type: 'boolean',
      description: 'Include fields with empty values (default: true)',
    },
    includeMetadata: {
      type: 'boolean',
      description:
        'Include metadata fields like createdAt, updatedAt (default: true)',
    },
  };
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
        return await updateComponent(args);

      // Products
      case 'get_products':
        return await listProducts(args);
      case 'get_product':
        return await getProduct(args);
      case 'update_product':
        return await updateProduct(args);

      // Available fields
      case 'get_available_fields':
        return await getAvailableFields(args);

      default:
        throw new ProductboardError(
          ErrorCode.InvalidRequest,
          `Unknown tool: ${name}`
        );
    }
  } catch (error: any) {
    if (isEnterpriseError(error)) {
      throw new ProductboardError(
        ErrorCode.InvalidRequest,
        error.message,
        error
      );
    }
    throw error;
  }
}

/**
 * Create a new component in Productboard
 */
async function createComponent(args: any) {
  return await withContext(
    async context => {
      try {
        // Validate required fields with helpful error messages
        if (!args.name) {
          throw new ValidationError(
            'Component name is required. Example: { "name": "Frontend UI", "description": "<p>React components with <b>modern</b> design</p>", "parent": { "product": { "id": "12345" } } }',
            'name'
          );
        }

        const body: any = {
          name: args.name,
        };

        if (args.description) body.description = args.description;
        if (args.parent) body.parent = args.parent;

        // Add owner email if provided (as shown in API example)
        if (args.ownerEmail) {
          body.owner = { email: args.ownerEmail };
        }

        const response = await context.axios.post('/components', {
          data: body,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                formatResponse(
                  {
                    success: true,
                    component: response.data,
                  },
                  'json',
                  'component'
                )
              ),
            },
          ],
        };
      } catch (error: any) {
        // Enhanced error handling for HTML validation errors
        if (
          error.response?.data &&
          typeof error.response.data === 'string' &&
          error.response.data.includes('cvc-complex-type')
        ) {
          throw new ValidationError(
            `HTML validation failed in description field. Productboard only allows these exact HTML tags: <b>, <i>, <s>, <u>, <br>, <a>, <code>, <img>. Replace <strong> with <b>, <em> with <i>, etc. Example: "<p>Component with <b>bold text</b> and <i>italic text</i></p>"`,
            'html_tags'
          );
        }

        // Enhanced error handling for common 404 scenarios
        if (error.response?.status === 404) {
          throw new ValidationError(
            `Component creation failed - endpoint not found. Ensure you're using the correct format: { "name": "Component Name", "parent": { "product": { "id": "valid-product-id" } } }. Use 'get_products()' to find valid product IDs.`,
            'request_format'
          );
        }

        if (error.response?.status === 400) {
          const apiError =
            error.response.data?.message || 'Invalid request format';

          // Check if it's an HTML validation error specifically
          if (
            apiError.includes('cvc-complex-type') ||
            apiError.includes('Invalid content was found')
          ) {
            throw new ValidationError(
              `HTML validation error: ${apiError}. Productboard only allows these HTML tags: <b>, <i>, <s>, <u>, <br>, <a>, <code>, <img>. Avoid <strong>, <em>, <div>, <span>, etc. Use: "<p>Text with <b>bold</b> and <i>italic</i> formatting</p>"`,
              'html_validation'
            );
          }

          throw new ValidationError(
            `${apiError}. Required format: { "name": "string", "parent": { "product": { "id": "string" } } (optional), "description": "string with allowed HTML tags: <b>, <i>, <s>, <u>, <br>, <a>, <code>, <img>" (optional) }`,
            'request_body'
          );
        }

        throw error;
      }
    },
    args.instance,
    args.workspaceId,
    'create_component'
  );
}

/**
 * Get available fields for field selection
 */
/**
 * Create a new feature in Productboard
 */
async function createFeature(args: any) {
  return await withContext(
    async context => {
      const body: any = {
        name: args.name,
      };

      if (args.description) body.description = args.description;
      if (args.status) body.status = args.status;
      if (args.owner) body.owner = args.owner;
      if (args.parent) body.parent = args.parent;

      const response = await context.axios.post('/features', { data: body });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              formatResponse(
                {
                  success: true,
                  feature: response.data,
                },
                'json',
                'feature'
              )
            ),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
    'create_feature'
  );
}

/**
 * List features in Productboard
 */
async function listFeatures(args: any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeListParams(args);
      const params: any = {
        pageLimit: normalizedParams.limit,
        pageOffset: normalizedParams.startWith,
      };

      // Add filters
      if (args.archived !== undefined) params.archived = args.archived;
      if (args.noteId) params['linkedNote.id'] = args.noteId;
      if (args.ownerEmail) params['owner.email'] = args.ownerEmail;
      if (args.parentId) params['parent.id'] = args.parentId;
      if (args.statusId) params['status.id'] = args.statusId;
      if (args.statusName) params['status.name'] = args.statusName;

      const response = await context.axios.get('/features', { params });

      const result = filterArrayByDetailLevel(
        response.data.data,
        'feature',
        normalizedParams.detail
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(
              result,
              args.outputFormat || 'json',
              'feature'
            ),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
    'get_features'
  );
}

/**
 * Get a specific feature by ID
 */
async function getFeature(args: any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const params: any = {};

      if (args.includeCustomFields) params.includeCustomFields = true;

      const response = await context.axios.get(`/features/${args.id}`, {
        params,
      });

      const result = filterByDetailLevel(
        response.data,
        'feature',
        normalizedParams.detail
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(
              result,
              args.outputFormat || 'json',
              'feature'
            ),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
    'get_feature'
  );
}

/**
 * Update an existing feature
 */
async function updateFeature(args: UpdateFeatureParams) {
  return await withContext(
    async context => {
      const { id, ...updateData } = args;

      const response = await context.axios.patch(`/features/${id}`, updateData);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(
              {
                success: true,
                feature: response.data,
              },
              'json',
              'feature'
            ),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
    'update_feature'
  );
}

/**
 * Delete a feature
 */
async function deleteFeature(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/features/${args.id}`);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(
              {
                success: true,
                message: `Feature ${args.id} deleted successfully`,
              },
              'json',
              'feature'
            ),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
    'delete_feature'
  );
}

/**
 * List components in Productboard
 */
async function listComponents(args: any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeListParams(args);
      const params: any = {
        pageLimit: normalizedParams.limit,
        pageOffset: normalizedParams.startWith,
      };

      if (args.productId) params['product.id'] = args.productId;

      const response = await context.axios.get('/components', { params });

      const result = filterArrayByDetailLevel(
        response.data.data,
        'component',
        normalizedParams.detail
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(
              result,
              args.outputFormat || 'json',
              'component'
            ),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
    'get_components'
  );
}

/**
 * Get a specific component by ID
 */
async function getComponent(args: any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/components/${args.id}`);

      const result = filterByDetailLevel(
        response.data,
        'component',
        normalizedParams.detail
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(
              result,
              args.outputFormat || 'json',
              'component'
            ),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
    'get_component'
  );
}

/**
 * Update a component
 */
async function updateComponent(args: any) {
  return await withContext(
    async context => {
      const { id, ...updateData } = args;

      const response = await context.axios.patch(
        `/components/${id}`,
        updateData
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(
              {
                success: true,
                component: response.data,
              },
              'json',
              'component'
            ),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
    'update_component'
  );
}

/**
 * List products in Productboard
 */
async function listProducts(args: any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeListParams(args);
      const params: any = {
        pageLimit: normalizedParams.limit,
        pageOffset: normalizedParams.startWith,
      };

      const response = await context.axios.get('/products', { params });

      const result = filterArrayByDetailLevel(
        response.data.data,
        'product',
        normalizedParams.detail
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(
              result,
              args.outputFormat || 'json',
              'product'
            ),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
    'get_products'
  );
}

/**
 * Get a specific product by ID
 */
async function getProduct(args: any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/products/${args.id}`);

      const result = filterByDetailLevel(
        response.data,
        'product',
        normalizedParams.detail
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(
              result,
              args.outputFormat || 'json',
              'product'
            ),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
    'get_product'
  );
}

/**
 * Update a product
 */
async function updateProduct(args: any) {
  return await withContext(
    async context => {
      const { id, ...updateData } = args;

      const response = await context.axios.patch(`/products/${id}`, updateData);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse(
              {
                success: true,
                product: response.data,
              },
              'json',
              'product'
            ),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
    'update_product'
  );
}

async function getAvailableFields(args: {
  entityType: string;
  instance?: string;
  workspaceId?: string;
}): Promise<{ content: Array<{ type: string; text: string }> }> {
  const { entityType } = args;

  // Validate entity type
  const supportedEntities = [
    'feature',
    'note',
    'company',
    'component',
    'product',
    'user',
    'objective',
    'initiative',
    'keyResult',
    'release',
    'releaseGroup',
  ];
  if (!supportedEntities.includes(entityType)) {
    throw new Error(
      `Unsupported entity type: ${entityType}. Supported types: ${supportedEntities.join(', ')}`
    );
  }

  const availableFields = fieldSelector.getAvailableFields(entityType);
  const essentialFields = fieldSelector.getEssentialFields(entityType);

  const result = {
    entityType,
    availableFields: availableFields.sort(),
    essentialFields,
    fieldCount: availableFields.length,
    examples: {
      basicSelection: essentialFields,
      nestedSelection: availableFields
        .filter(field => field.includes('.'))
        .slice(0, 5),
      commonFields: ['id', 'name', 'createdAt', 'updatedAt'].filter(field =>
        availableFields.includes(field)
      ),
    },
    usage: {
      includeSpecific: `fields: ["id", "name", "status.name"]`,
      excludeFields: `exclude: ["description", "customFields"]`,
      nestedAccess: `fields: ["owner.email", "timeframe.startDate"]`,
    },
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
