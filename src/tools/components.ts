/**
 * Components management tools
 */
import {
  normalizeListParams,
  normalizeGetParams,
  filterArrayByDetailLevel,
  filterByDetailLevel,
  isEnterpriseError,
} from '../utils/parameter-utils.js';
import { withContext, formatResponse } from '../utils/tool-wrapper.js';
import { ProductboardError, ValidationError } from '../errors/index.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * Components Tools
 */
export function setupComponentsTools() {
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

export async function handleComponentsTool(name: string, args: any) {
  try {
    switch (name) {
      case 'create_component':
        return await createComponent(args);
      case 'get_components':
        return await listComponents(args);
      case 'get_component':
        return await getComponent(args);
      case 'update_component':
        return await updateComponent(args);
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
              text: formatResponse({
                success: true,
                component: response.data,
              }),
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

      // Return the full response object with data array, matching companies pattern
      const data = response.data;

      // Apply detail level filtering if needed
      if (data.data && Array.isArray(data.data)) {
        data.data = filterArrayByDetailLevel(
          data.data,
          'component',
          normalizedParams.detail
        );
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
            text: formatResponse(result),
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
            text: formatResponse({
              success: true,
              component: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
    'update_component'
  );
}
