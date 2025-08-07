/**
 * Products management tools
 */
import {
  normalizeListParams,
  normalizeGetParams,
  filterArrayByDetailLevel,
  filterByDetailLevel,
  isEnterpriseError,
} from '../utils/parameter-utils.js';
import { withContext, formatResponse } from '../utils/tool-wrapper.js';
import { fetchAllPages } from '../utils/pagination-handler.js';
import { ProductboardError } from '../errors/index.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * Products Tools
 */
export function setupProductsTools() {
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

export async function handleProductsTool(name: string, args: any) {
  try {
    switch (name) {
      case 'get_products':
        return await listProducts(args);
      case 'get_product':
        return await getProduct(args);
      case 'update_product':
        return await updateProduct(args);
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
 * List products in Productboard
 */
async function listProducts(args: any) {
  return await withContext(
    async context => {
      const normalized = normalizeListParams(args);
      const params: any = {};

      // Use proper pagination handler to fetch all pages
      const paginatedResponse = await fetchAllPages(
        context.axios,
        '/products',
        params,
        {
          maxItems: normalized.limit > 100 ? normalized.limit : undefined,
          onPageFetched: (pageData, pageNum, totalSoFar) => {
            console.log(
              `📄 Fetched products page ${pageNum}: ${pageData.length} products (total: ${totalSoFar})`
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
          'product',
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
            text: formatResponse(result),
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
            text: formatResponse({
              success: true,
              product: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
    'update_product'
  );
}
