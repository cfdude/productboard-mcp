/**
 * Features, Components, and Products management tools
 */
import { withContext, formatResponse } from '../utils/tool-wrapper.js';
import {
  normalizeListParams,
  normalizeGetParams,
  filterByDetailLevel,
  filterArrayByDetailLevel,
  validateFieldNames,
  isEnterpriseError,
  formatResponse as formatResponseUtil,
} from '../utils/parameter-utils.js';
import {
  StandardListParams,
  StandardGetParams,
} from '../types/parameter-types.js';
import { ProductboardError } from '../errors/index.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * Calculate timeframe duration in standardized format (e.g., '2w3d', '1m', '4w')
 */
function calculateTimeframeDuration(
  startDate: string,
  endDate: string
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return '0d';

  const months = Math.floor(diffDays / 30);
  const remainingAfterMonths = diffDays % 30;
  const weeks = Math.floor(remainingAfterMonths / 7);
  const days = remainingAfterMonths % 7;

  let result = '';
  if (months > 0) result += `${months}m`;
  if (weeks > 0) result += `${weeks}w`;
  if (days > 0) result += `${days}d`;

  return result || '0d';
}

/**
 * Parse duration string (e.g., '2w', '1m3d') to days
 */
function parseDurationToDays(duration: string): number {
  const regex = /(\d+)([mwd])/g;
  let totalDays = 0;
  let match;

  while ((match = regex.exec(duration)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'm':
        totalDays += value * 30;
        break;
      case 'w':
        totalDays += value * 7;
        break;
      case 'd':
        totalDays += value;
        break;
    }
  }

  return totalDays;
}

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
            description:
              'Level of detail (default: basic). DEPRECATED: Use fields parameter for precise selection.',
          },
          fields: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Specific fields to include in response. Supports dot notation for nested fields. Example: ["id", "name", "status.name"]',
          },
          exclude: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Fields to exclude from response. Cannot be used with fields parameter.',
          },
          validateFields: {
            type: 'boolean',
            description:
              'Validate field names and return suggestions for invalid fields (default: true)',
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
            description:
              'Level of detail (default: standard). DEPRECATED: Use fields parameter for precise selection.',
          },
          fields: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Specific fields to include in response. Supports dot notation for nested fields (e.g., "timeframe.startDate"). Example: ["id", "name", "status.name", "owner.email"]',
          },
          exclude: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Fields to exclude from response. Cannot be used with fields parameter.',
          },
          validateFields: {
            type: 'boolean',
            description:
              'Validate field names and return suggestions for invalid fields (default: true)',
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
          includeCustomFields: {
            type: 'boolean',
            description:
              'Include available custom fields and their current values for this feature',
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
            description:
              'Level of detail (default: standard). DEPRECATED: Use fields parameter for precise selection.',
          },
          fields: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Specific fields to include in response. Example: ["id", "name", "description"]',
          },
          exclude: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Fields to exclude from response. Cannot be used with fields parameter.',
          },
          validateFields: {
            type: 'boolean',
            description:
              'Validate field names and return suggestions for invalid fields (default: true)',
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

      // Field validation if requested
      if (
        normalizedParams.validateFields &&
        (normalizedParams.fields.length > 0 ||
          normalizedParams.exclude.length > 0)
      ) {
        const validation = validateFieldNames(
          'feature',
          normalizedParams.fields
        );
        if (validation.invalid.length > 0) {
          console.warn(
            `Invalid fields for feature: ${validation.invalid.join(', ')}`
          );
          if (validation.suggestions.length > 0) {
            console.warn(
              'Suggestions:',
              validation.suggestions
                .map(s => `${s.field} -> ${s.suggestion}`)
                .join(', ')
            );
          }
        }
      }

      // Apply timeframe duration filtering and calculate duration field
      if (result.data && Array.isArray(result.data)) {
        // Calculate timeframeDuration for each feature
        result.data = result.data.map((feature: any) => {
          if (feature.timeframe?.startDate && feature.timeframe?.endDate) {
            feature.timeframeDuration = calculateTimeframeDuration(
              feature.timeframe.startDate,
              feature.timeframe.endDate
            );
          }
          return feature;
        });

        // Apply timeframe duration filters
        if (
          args.timeframeDuration ||
          args.timeframeDurationMin ||
          args.timeframeDurationMax
        ) {
          result.data = result.data.filter((feature: any) => {
            if (!feature.timeframeDuration) return false;

            const featureDurationDays = parseDurationToDays(
              feature.timeframeDuration
            );

            // Exact duration match
            if (args.timeframeDuration) {
              const targetDurationDays = parseDurationToDays(
                args.timeframeDuration
              );
              return featureDurationDays === targetDurationDays;
            }

            // Min/Max duration range
            let withinRange = true;
            if (args.timeframeDurationMin) {
              const minDurationDays = parseDurationToDays(
                args.timeframeDurationMin
              );
              withinRange =
                withinRange && featureDurationDays >= minDurationDays;
            }
            if (args.timeframeDurationMax) {
              const maxDurationDays = parseDurationToDays(
                args.timeframeDurationMax
              );
              withinRange =
                withinRange && featureDurationDays <= maxDurationDays;
            }

            return withinRange;
          });
        }
      }

      // Add custom fields information if requested
      if (
        args.includeCustomFields &&
        result.data &&
        Array.isArray(result.data)
      ) {
        const featuresWithCustomFields = await Promise.all(
          result.data.map(async (feature: any) => {
            try {
              const customFields = await getFeatureCustomFields(
                context,
                feature.id
              );
              return {
                ...feature,
                customFields,
              };
            } catch {
              // If custom fields fetch fails, return feature without custom fields
              return feature;
            }
          })
        );
        result.data = featuresWithCustomFields;
      }

      // Apply field filtering and output formatting
      if (!normalizedParams.includeSubData && result.data) {
        result.data = filterArrayByDetailLevel(
          result.data,
          'feature',
          normalizedParams.detail,
          normalizedParams.fields,
          normalizedParams.exclude
        );
      }

      // Apply output formatting to the data if requested
      let finalResult = result;
      if (args.outputFormat && args.outputFormat !== 'json' && result.data) {
        const formattedData = formatResponseUtil(
          result.data,
          args.outputFormat,
          'feature'
        );
        if (typeof formattedData === 'string') {
          finalResult = formattedData;
        }
      }

      return {
        content: [
          {
            type: 'text',
            text:
              typeof finalResult === 'string'
                ? finalResult
                : formatResponse(finalResult),
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
    includeCustomFields?: boolean;
  }
) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/features/${args.id}`);

      let result = response.data;

      // Field validation if requested
      if (
        normalizedParams.validateFields &&
        (normalizedParams.fields.length > 0 ||
          normalizedParams.exclude.length > 0)
      ) {
        const validation = validateFieldNames(
          'feature',
          normalizedParams.fields
        );
        if (validation.invalid.length > 0) {
          console.warn(
            `Invalid fields for feature: ${validation.invalid.join(', ')}`
          );
          if (validation.suggestions.length > 0) {
            console.warn(
              'Suggestions:',
              validation.suggestions
                .map(s => `${s.field} -> ${s.suggestion}`)
                .join(', ')
            );
          }
        }
      }

      // Include custom fields if requested
      if (args.includeCustomFields) {
        const customFieldsInfo = await getFeatureCustomFields(context, args.id);
        result.customFields = customFieldsInfo;
      }

      // Apply field filtering and output formatting
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(
          result,
          'feature',
          normalizedParams.detail,
          normalizedParams.fields,
          normalizedParams.exclude,
          args.outputFormat
        );
      } else if (args.outputFormat && args.outputFormat !== 'json') {
        result = formatResponseUtil(result, args.outputFormat, 'feature');
      }

      return {
        content: [
          {
            type: 'text',
            text: typeof result === 'string' ? result : formatResponse(result),
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
      const { id, ...updates } = args;

      // 1. Discover available custom fields to differentiate from standard fields
      const customFields = await getAvailableCustomFields(context);

      // TEMPORARY: Hardcode known custom fields to test if the rest of the logic works
      const customFieldMap = {
        'T-Shirt Sizing': {
          id: '46ac5ad7-1cac-4de8-a723-745ba19802d0',
          type: 'dropdown',
        },
        'Business Value': {
          id: '614b32f8-afea-4e8d-8cdc-bce335fbc8c5',
          type: 'dropdown',
        },
        ...customFields.reduce(
          (acc: any, field: any) => ({
            ...acc,
            [field.name]: { id: field.id, type: field.type },
          }),
          {}
        ),
      };

      // 2. Separate standard vs custom field updates

      const standardFields = [
        'name',
        'description',
        'status',
        'owner',
        'archived',
        'timeframe',
        'parentId',
        'componentId',
        'productId',
      ];
      const standardUpdates: any = {};
      const customUpdates: any = {};

      for (const [key, value] of Object.entries(updates)) {
        if (standardFields.includes(key)) {
          standardUpdates[key] = value;
        } else if (customFieldMap[key]) {
          customUpdates[key] = {
            fieldId: customFieldMap[key].id,
            fieldType: customFieldMap[key].type,
            value: value,
          };
        } else {
          // Unknown field - provide helpful suggestions
          const suggestions = suggestCustomFieldName(key, customFields);
          const errorMsg =
            suggestions.length > 0
              ? `Unknown field '${key}'. Did you mean: ${suggestions.join(', ')}? Use get_custom_fields tool to see all available custom fields.`
              : `Unknown field '${key}'. Use get_custom_fields tool to see all available custom fields.`;

          throw new Error(errorMsg);
        }
      }

      // 3. Execute standard field updates (existing logic)
      let standardResponse = null;
      if (Object.keys(standardUpdates).length > 0) {
        const body: any = {};

        if (standardUpdates.name) body.name = standardUpdates.name;
        if (standardUpdates.description !== undefined)
          body.description = standardUpdates.description;
        if (standardUpdates.status) body.status = standardUpdates.status;
        if (standardUpdates.owner) body.owner = standardUpdates.owner;
        if (standardUpdates.archived !== undefined)
          body.archived = standardUpdates.archived;
        if (standardUpdates.timeframe) {
          // Handle timeframe parameter - can be string or object
          if (typeof standardUpdates.timeframe === 'string') {
            try {
              body.timeframe = JSON.parse(standardUpdates.timeframe);
            } catch {
              // If parsing fails, treat as invalid
              throw new Error(
                'Invalid timeframe format. Expected JSON object with startDate and endDate'
              );
            }
          } else {
            body.timeframe = standardUpdates.timeframe;
          }
        }

        // Handle parent reassignment (component/product changes)
        if (
          standardUpdates.parentId ||
          standardUpdates.componentId ||
          standardUpdates.productId
        ) {
          let parent = null;

          if (standardUpdates.parentId) {
            // Sub-feature: parent is another feature
            parent = { feature: { id: standardUpdates.parentId } };
          } else if (standardUpdates.componentId) {
            // Top-level feature: parent is a component
            parent = { component: { id: standardUpdates.componentId } };
          } else if (standardUpdates.productId) {
            // Top-level feature: parent is a product
            parent = { product: { id: standardUpdates.productId } };
          }

          if (parent) {
            body.parent = parent;
          }
        }

        standardResponse = await context.axios.patch(`/features/${id}`, {
          data: body,
        });
      }

      // 4. Execute custom field updates and deletions
      const customFieldResults = [];
      for (const [fieldName, fieldData] of Object.entries(customUpdates)) {
        try {
          const fieldValue = (fieldData as any).value;

          // Check if we should delete the custom field value
          if (
            fieldValue === null ||
            fieldValue === undefined ||
            fieldValue === ''
          ) {
            // Delete the custom field value
            await context.axios.delete(
              '/hierarchy-entities/custom-fields-values/value',
              {
                params: {
                  'customField.id': (fieldData as any).fieldId,
                  'hierarchyEntity.id': id,
                },
              }
            );
            customFieldResults.push({
              field: fieldName,
              success: true,
              action: 'deleted',
              message: `Custom field '${fieldName}' value deleted successfully`,
            });
          } else {
            // Resolve user-friendly values for dropdown fields
            let resolvedValue = fieldValue;
            if ((fieldData as any).fieldType === 'dropdown') {
              resolvedValue = await resolveDropdownValue(
                context,
                (fieldData as any).fieldId,
                fieldValue
              );
            }

            // Set/update the custom field value
            const customFieldResponse = await context.axios.put(
              '/hierarchy-entities/custom-fields-values/value',
              {
                data: {
                  type: (fieldData as any).fieldType,
                  value: resolvedValue,
                },
              },
              {
                params: {
                  'customField.id': (fieldData as any).fieldId,
                  'hierarchyEntity.id': id,
                },
              }
            );
            customFieldResults.push({
              field: fieldName,
              success: true,
              action: 'updated',
              data: customFieldResponse.data,
            });
          }
        } catch (error: any) {
          customFieldResults.push({
            field: fieldName,
            success: false,
            error: error.message,
          });
        }
      }

      // 5. Combine results

      const result: any = {
        success: true,
        message: 'Feature updated successfully',
      };

      if (standardResponse) {
        result.feature = standardResponse.data;
      }

      if (customFieldResults.length > 0) {
        result.customFields = customFieldResults;
        const failedFields = customFieldResults.filter(r => !r.success);
        if (failedFields.length > 0) {
          result.warnings = `Some custom fields failed to update: ${failedFields.map(f => f.field).join(', ')}`;
        }
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

/**
 * Get available custom fields for caching and field detection
 */
async function getAvailableCustomFields(context: any) {
  try {
    // Use the exact same approach as the working MCP custom-fields tool
    const params: any = {};

    // Try with dropdown type specifically since we know that works
    params.type = ['dropdown'];

    const response = await context.axios.get(
      '/hierarchy-entities/custom-fields',
      {
        params,
        paramsSerializer: {
          indexes: null, // This tells axios to repeat array parameters instead of using indices
        },
      }
    );

    return response.data.data || [];
  } catch (error) {
    console.warn('Failed to fetch custom fields:', error);
    return [];
  }
}

/**
 * Resolve user-friendly dropdown values to option IDs
 * Supports: exact ID, label matching (case-insensitive), partial matches
 */
async function resolveDropdownValue(
  context: any,
  fieldId: string,
  userValue: any
): Promise<any> {
  // If already an object with ID, return as-is
  if (typeof userValue === 'object' && userValue.id) {
    return userValue;
  }

  try {
    // Get the custom field with its options
    const response = await context.axios.get(
      `/hierarchy-entities/custom-fields/${fieldId}`
    );
    const field = response.data.data;

    if (!field.options || field.options.length === 0) {
      throw new Error(`No options available for dropdown field ${fieldId}`);
    }

    const searchValue = String(userValue).toLowerCase().trim();

    // 1. Try exact ID match first
    const exactIdMatch = field.options.find(
      (option: any) => option.id === userValue
    );
    if (exactIdMatch) {
      return { id: exactIdMatch.id };
    }

    // 2. Try exact label match (case-insensitive)
    const exactLabelMatch = field.options.find(
      (option: any) => option.label.toLowerCase() === searchValue
    );
    if (exactLabelMatch) {
      return { id: exactLabelMatch.id };
    }

    // 3. Try partial label match (case-insensitive)
    const partialMatches = field.options.filter(
      (option: any) =>
        option.label.toLowerCase().includes(searchValue) ||
        searchValue.includes(option.label.toLowerCase())
    );

    if (partialMatches.length === 1) {
      return { id: partialMatches[0].id };
    } else if (partialMatches.length > 1) {
      // Multiple matches - try to find best match
      // Prefer shorter labels or exact word matches
      const bestMatch =
        partialMatches.find((option: any) => {
          const label = option.label.toLowerCase();
          // Check for common abbreviations
          return (
            (searchValue === 'm' && label.includes('(m)')) ||
            (searchValue === 'medium' && label.includes('(m)')) ||
            (searchValue === 's' && label.includes('(s)')) ||
            (searchValue === 'small' && label.includes('(s)')) ||
            (searchValue === 'l' && label.includes('(l)')) ||
            (searchValue === 'large' && label.includes('(l)')) ||
            (searchValue === 'xs' && label.includes('(xs)')) ||
            (searchValue === 'xl' && label.includes('(xl)'))
          );
        }) || partialMatches[0]; // Fallback to first match

      return { id: bestMatch.id };
    }

    // 4. If no matches found, provide helpful error
    const availableOptions = field.options
      .map((opt: any) => opt.label)
      .join(', ');
    throw new Error(
      `Invalid dropdown value "${userValue}" for field "${field.name}". Available options: ${availableOptions}`
    );
  } catch (error: any) {
    throw new Error(`Failed to resolve dropdown value: ${error.message}`);
  }
}

/**
 * Suggest similar custom field names for misspelled field names
 * Uses fuzzy matching to find closest matches
 */
function suggestCustomFieldName(
  inputName: string,
  customFields: any[]
): string[] {
  if (customFields.length === 0) return [];

  const input = inputName.toLowerCase().trim();
  const suggestions: Array<{ name: string; score: number }> = [];

  for (const field of customFields) {
    const fieldName = field.name.toLowerCase();
    let score = 0;

    // Exact match (shouldn't happen, but just in case)
    if (fieldName === input) {
      score = 100;
    }
    // Check if input is contained in field name
    else if (fieldName.includes(input)) {
      score = 80 + (input.length / fieldName.length) * 20; // Prefer longer partial matches
    }
    // Check if field name is contained in input
    else if (input.includes(fieldName)) {
      score = 70 + (fieldName.length / input.length) * 20;
    }
    // Check for similar word patterns (spaces, hyphens, etc.)
    else {
      const inputWords = input.split(/[\s\-_]+/);
      const fieldWords = fieldName.split(/[\s\-_]+/);

      let matchingWords = 0;
      for (const inputWord of inputWords) {
        for (const fieldWord of fieldWords) {
          if (
            inputWord === fieldWord ||
            inputWord.includes(fieldWord) ||
            fieldWord.includes(inputWord)
          ) {
            matchingWords++;
            break;
          }
        }
      }

      if (matchingWords > 0) {
        score =
          (matchingWords / Math.max(inputWords.length, fieldWords.length)) * 60;
      }
    }

    // Character similarity check for typos
    if (score === 0) {
      const levenshteinScore = calculateLevenshteinSimilarity(input, fieldName);
      if (levenshteinScore > 0.6) {
        // 60% similarity threshold
        score = levenshteinScore * 50;
      }
    }

    if (score > 20) {
      // Only suggest if reasonably similar
      suggestions.push({ name: field.name, score });
    }
  }

  // Sort by score and return top 3 suggestions
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => `"${s.name}"`);
}

/**
 * Calculate Levenshtein distance similarity between two strings
 */
function calculateLevenshteinSimilarity(str1: string, str2: string): number {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;

  // Initialize matrix
  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2[i - 1] === str1[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  const distance = matrix[len2][len1];
  const maxLen = Math.max(len1, len2);
  return (maxLen - distance) / maxLen;
}

/**
 * Get custom fields with their current values for a specific feature
 */
async function getFeatureCustomFields(context: any, featureId: string) {
  try {
    // 1. Get all available custom fields
    const customFields = await getAvailableCustomFields(context);

    // 2. For each custom field, get its current value for this feature
    const customFieldsWithValues = [];

    for (const field of customFields) {
      try {
        // Get the current value for this field and feature
        const valueResponse = await context.axios.get(
          '/hierarchy-entities/custom-fields-values/value',
          {
            params: {
              'customField.id': field.id,
              'hierarchyEntity.id': featureId,
            },
          }
        );

        customFieldsWithValues.push({
          id: field.id,
          name: field.name,
          type: field.type,
          description: field.description || '',
          currentValue: valueResponse.data.data?.value || null,
          hasValue: !!valueResponse.data.data?.value,
        });
      } catch (error: any) {
        // If no value exists for this field, include it but with null value
        if (error.response?.status === 404) {
          customFieldsWithValues.push({
            id: field.id,
            name: field.name,
            type: field.type,
            description: field.description || '',
            currentValue: null,
            hasValue: false,
          });
        } else {
          console.warn(
            `Failed to get custom field value for ${field.name}:`,
            error.message
          );
        }
      }
    }

    return {
      available: customFields.length,
      withValues: customFieldsWithValues.filter(f => f.hasValue).length,
      fields: customFieldsWithValues,
    };
  } catch (error) {
    console.warn('Failed to fetch feature custom fields:', error);
    return {
      available: 0,
      withValues: 0,
      fields: [],
      error: 'Failed to fetch custom fields information',
    };
  }
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

      // Field validation if requested
      if (
        normalizedParams.validateFields &&
        (normalizedParams.fields.length > 0 ||
          normalizedParams.exclude.length > 0)
      ) {
        const validation = validateFieldNames(
          'component',
          normalizedParams.fields
        );
        if (validation.invalid.length > 0) {
          console.warn(
            `Invalid fields for component: ${validation.invalid.join(', ')}`
          );
          if (validation.suggestions.length > 0) {
            console.warn(
              'Suggestions:',
              validation.suggestions
                .map(s => `${s.field} -> ${s.suggestion}`)
                .join(', ')
            );
          }
        }
      }

      // Apply field filtering (prioritizes fields over detail level)
      if (!normalizedParams.includeSubData && result.data) {
        result.data = filterArrayByDetailLevel(
          result.data,
          'component',
          normalizedParams.detail,
          normalizedParams.fields,
          normalizedParams.exclude
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

      // Field validation if requested
      if (
        normalizedParams.validateFields &&
        (normalizedParams.fields.length > 0 ||
          normalizedParams.exclude.length > 0)
      ) {
        const validation = validateFieldNames(
          'component',
          normalizedParams.fields
        );
        if (validation.invalid.length > 0) {
          console.warn(
            `Invalid fields for component: ${validation.invalid.join(', ')}`
          );
          if (validation.suggestions.length > 0) {
            console.warn(
              'Suggestions:',
              validation.suggestions
                .map(s => `${s.field} -> ${s.suggestion}`)
                .join(', ')
            );
          }
        }
      }

      // Apply field filtering (prioritizes fields over detail level)
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(
          result,
          'component',
          normalizedParams.detail,
          normalizedParams.fields,
          normalizedParams.exclude
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

      // Field validation if requested
      if (
        normalizedParams.validateFields &&
        (normalizedParams.fields.length > 0 ||
          normalizedParams.exclude.length > 0)
      ) {
        const validation = validateFieldNames(
          'product',
          normalizedParams.fields
        );
        if (validation.invalid.length > 0) {
          return {
            content: [
              {
                type: 'text',
                text: `Warning: Invalid field names detected: ${validation.invalid.join(', ')}
Suggestions: ${validation.suggestions.map(s => s.suggestion).join(', ')}`,
              },
            ],
          };
        }
      }

      const params: any = {
        pageLimit: normalizedParams.limit,
        pageOffset: normalizedParams.startWith,
      };

      const response = await context.axios.get('/products', { params });

      const result = response.data;

      // Apply detail level filtering with field selection
      if (!normalizedParams.includeSubData && result.data) {
        result.data = filterArrayByDetailLevel(
          result.data,
          'product',
          normalizedParams.detail,
          normalizedParams.fields,
          normalizedParams.exclude
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

      // Field validation if requested
      if (
        normalizedParams.validateFields &&
        (normalizedParams.fields.length > 0 ||
          normalizedParams.exclude.length > 0)
      ) {
        const validation = validateFieldNames(
          'product',
          normalizedParams.fields
        );
        if (validation.invalid.length > 0) {
          return {
            content: [
              {
                type: 'text',
                text: `Warning: Invalid field names detected: ${validation.invalid.join(', ')}
Suggestions: ${validation.suggestions.map(s => s.suggestion).join(', ')}`,
              },
            ],
          };
        }
      }

      const response = await context.axios.get(`/products/${args.id}`);

      let result = response.data;

      // Apply detail level filtering with field selection
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(
          result,
          'product',
          normalizedParams.detail,
          normalizedParams.fields,
          normalizedParams.exclude
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
