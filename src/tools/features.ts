/**
 * Features management tools
 */
import {
  normalizeListParams,
  normalizeGetParams,
  formatResponse,
  filterArrayByDetailLevel,
  filterByDetailLevel,
  isEnterpriseError,
} from '../utils/parameter-utils.js';
import { fetchAllPages } from '../utils/pagination-handler.js';
import { UpdateFeatureParams } from '../types/parameter-types.js';
import { fieldSelector } from '../utils/field-selection.js';
import { withContext } from '../utils/tool-wrapper.js';
import { ProductboardError } from '../errors/index.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * Features Tools
 */
export function setupFeaturesTools() {
  return [...getFeatureToolSchemas(), ...getUtilityToolSchemas()];
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
            description:
              'Feature status (required - use get_feature_statuses to see available options)',
            properties: {
              id: { type: 'string', description: 'Status ID (UUID)' },
              name: { type: 'string', description: 'Status name' },
            },
            required: ['id', 'name'],
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
        required: ['name', 'status'],
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
        type: 'feature', // Required field for ProductBoard API
        status: args.status, // Required field - must have both id and name
      };

      if (args.description) body.description = args.description;
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
      const params: any = {};

      // Add filters (no pagination parameters - handled by fetchAllPages)
      if (args.archived !== undefined) params.archived = args.archived;
      if (args.noteId) params['linkedNote.id'] = args.noteId;
      if (args.ownerEmail) params['owner.email'] = args.ownerEmail;
      if (args.parentId) params['parent.id'] = args.parentId;
      if (args.statusId) params['status.id'] = args.statusId;
      if (args.statusName) params['status.name'] = args.statusName;

      // Use proper pagination handler to fetch all pages
      const paginatedResponse = await fetchAllPages(
        context.axios,
        '/features',
        params,
        {
          maxItems:
            normalizedParams.limit > 100 ? normalizedParams.limit : undefined,
          onPageFetched: (pageData, pageNum, totalSoFar) => {
            console.log(
              `📄 Fetched page ${pageNum}: ${pageData.length} features (total: ${totalSoFar})`
            );
          },
        }
      );

      const result = filterArrayByDetailLevel(
        paginatedResponse.data,
        'feature',
        normalizedParams.detail
      );

      // Return complete response structure with proper pagination info
      const responseData = {
        data: result,
        meta: {
          totalRecords: result.length,
          totalPages: paginatedResponse.meta?.totalPages || 1,
          wasLimited: paginatedResponse.meta?.wasLimited || false,
        },
        links: {}, // Links are no longer relevant since we fetched all pages
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(responseData),
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

      const response = await context.axios.patch(`/features/${id}`, {
        data: updateData,
      });

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
        text: JSON.stringify(result),
      },
    ],
  };
}
