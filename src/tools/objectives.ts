/**
 * Objectives, Initiatives, and Key Results management tools
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

export function setupObjectivesTools() {
  return [
    // Objectives operations
    {
      name: 'create_objective',
      description: 'Create a new objective',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Objective name',
          },
          description: {
            type: 'string',
            description: 'Objective description',
          },
          ownerId: {
            type: 'string',
            description: 'ID of the user who owns this objective',
          },
          startDate: {
            type: 'string',
            description: 'Start date (YYYY-MM-DD)',
          },
          endDate: {
            type: 'string',
            description: 'End date (YYYY-MM-DD)',
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
      name: 'get_objectives',
      description: 'List all objectives',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description:
              'Maximum number of objectives to return (1-100, default: 100)',
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
      name: 'get_objective',
      description: 'Get a specific objective by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Objective ID',
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
      name: 'update_objective',
      description: 'Update an existing objective',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Objective ID',
          },
          name: {
            type: 'string',
            description: 'Updated name',
          },
          description: {
            type: 'string',
            description: 'Updated description',
          },
          ownerId: {
            type: 'string',
            description: 'Updated owner ID',
          },
          startDate: {
            type: 'string',
            description: 'Updated start date (YYYY-MM-DD)',
          },
          endDate: {
            type: 'string',
            description: 'Updated end date (YYYY-MM-DD)',
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
      name: 'delete_objective',
      description: 'Delete an objective',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Objective ID',
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

    // Objective linking operations
    {
      name: 'list_links_objective_to_features',
      description: 'List features linked to a specific objective',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Objective ID',
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
      name: 'list_links_objective_to_initiatives',
      description: 'List initiatives linked to a specific objective',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Objective ID',
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
      name: 'create_objective_to_feature_link',
      description: 'Create a new link between an objective and a feature',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Objective ID',
          },
          featureId: {
            type: 'string',
            description: 'Feature ID to link',
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
    {
      name: 'delete_objective_to_feature_link',
      description: 'Delete a link between an objective and a feature',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Objective ID',
          },
          featureId: {
            type: 'string',
            description: 'Feature ID to unlink',
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
    {
      name: 'create_objective_to_initiative_link',
      description: 'Create a new link between an objective and an initiative',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Objective ID',
          },
          initiativeId: {
            type: 'string',
            description: 'Initiative ID to link',
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
        required: ['id', 'initiativeId'],
      },
    },
    {
      name: 'delete_objective_to_initiative_link',
      description: 'Delete a link between an objective and an initiative',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Objective ID',
          },
          initiativeId: {
            type: 'string',
            description: 'Initiative ID to unlink',
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
        required: ['id', 'initiativeId'],
      },
    },

    // Initiatives operations
    {
      name: 'create_initiative',
      description: 'Create a new initiative',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Initiative name',
          },
          description: {
            type: 'string',
            description: 'Initiative description',
          },
          ownerId: {
            type: 'string',
            description: 'ID of the user who owns this initiative',
          },
          status: {
            type: 'string',
            description: 'Initiative status',
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
      name: 'get_initiatives',
      description: 'List all initiatives',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description:
              'Maximum number of initiatives to return (1-100, default: 100)',
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
      name: 'get_initiative',
      description: 'Get a specific initiative by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Initiative ID',
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
      name: 'update_initiative',
      description: 'Update an existing initiative',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Initiative ID',
          },
          name: {
            type: 'string',
            description: 'Updated name',
          },
          description: {
            type: 'string',
            description: 'Updated description',
          },
          ownerId: {
            type: 'string',
            description: 'Updated owner ID',
          },
          status: {
            type: 'string',
            description: 'Updated status',
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
      name: 'delete_initiative',
      description: 'Delete an initiative',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Initiative ID',
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

    // Initiative linking operations
    {
      name: 'list_links_initiative_to_objectives',
      description: 'List objectives linked to a specific initiative',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Initiative ID',
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
      name: 'list_links_initiative_to_features',
      description: 'List features linked to a specific initiative',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Initiative ID',
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
      name: 'create_initiative_to_objective_link',
      description: 'Create a new link between an initiative and an objective',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Initiative ID',
          },
          objectiveId: {
            type: 'string',
            description: 'Objective ID to link',
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
        required: ['id', 'objectiveId'],
      },
    },
    {
      name: 'delete_initiative_to_objective_link',
      description: 'Delete a link between an initiative and an objective',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Initiative ID',
          },
          objectiveId: {
            type: 'string',
            description: 'Objective ID to unlink',
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
        required: ['id', 'objectiveId'],
      },
    },
    {
      name: 'create_initiative_to_feature_link',
      description: 'Create a new link between an initiative and a feature',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Initiative ID',
          },
          featureId: {
            type: 'string',
            description: 'Feature ID to link',
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
    {
      name: 'delete_initiative_to_feature_link',
      description: 'Delete a link between an initiative and a feature',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Initiative ID',
          },
          featureId: {
            type: 'string',
            description: 'Feature ID to unlink',
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

    // Key Results operations
    {
      name: 'create_key_result',
      description: 'Create a new key result',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Key result name',
          },
          objectiveId: {
            type: 'string',
            description: 'ID of the objective this key result belongs to',
          },
          type: {
            type: 'string',
            enum: ['number', 'percentage', 'currency', 'boolean'],
            description: 'Type of key result metric',
          },
          startValue: {
            type: 'number',
            description: 'Starting value',
          },
          targetValue: {
            type: 'number',
            description: 'Target value',
          },
          currentValue: {
            type: 'number',
            description: 'Current value',
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
        required: ['name', 'objectiveId', 'type', 'targetValue'],
      },
    },
    {
      name: 'get_key_results',
      description: 'List all key results',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description:
              'Maximum number of key results to return (1-100, default: 100)',
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
      name: 'get_key_result',
      description: 'Get a specific key result by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Key result ID',
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
      name: 'update_key_result',
      description: 'Update an existing key result',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Key result ID',
          },
          name: {
            type: 'string',
            description: 'Updated name',
          },
          currentValue: {
            type: 'number',
            description: 'Updated current value',
          },
          targetValue: {
            type: 'number',
            description: 'Updated target value',
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
      name: 'delete_key_result',
      description: 'Delete a key result',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Key result ID',
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

export async function handleObjectivesTool(name: string, args: any) {
  try {
    switch (name) {
      // Objectives
      case 'create_objective':
        return await createObjective(args);
      case 'get_objectives':
        return await listObjectives(args);
      case 'get_objective':
        return await getObjective(args);
      case 'update_objective':
        return await updateObjective(args);
      case 'delete_objective':
        return await deleteObjective(args);

      // Objective links
      case 'list_links_objective_to_features':
        return await listLinksObjectiveToFeatures(args);
      case 'list_links_objective_to_initiatives':
        return await listLinksObjectiveToInitiatives(args);
      case 'create_objective_to_feature_link':
        return await createObjectiveToFeatureLink(args);
      case 'delete_objective_to_feature_link':
        return await deleteObjectiveToFeatureLink(args);
      case 'create_objective_to_initiative_link':
        return await createObjectiveToInitiativeLink(args);
      case 'delete_objective_to_initiative_link':
        return await deleteObjectiveToInitiativeLink(args);

      // Initiatives
      case 'create_initiative':
        return await createInitiative(args);
      case 'get_initiatives':
        return await listInitiatives(args);
      case 'get_initiative':
        return await getInitiative(args);
      case 'update_initiative':
        return await updateInitiative(args);
      case 'delete_initiative':
        return await deleteInitiative(args);

      // Initiative links
      case 'list_links_initiative_to_objectives':
        return await listLinksInitiativeToObjectives(args);
      case 'list_links_initiative_to_features':
        return await listLinksInitiativeToFeatures(args);
      case 'create_initiative_to_objective_link':
        return await createInitiativeToObjectiveLink(args);
      case 'delete_initiative_to_objective_link':
        return await deleteInitiativeToObjectiveLink(args);
      case 'create_initiative_to_feature_link':
        return await createInitiativeToFeatureLink(args);
      case 'delete_initiative_to_feature_link':
        return await deleteInitiativeToFeatureLink(args);

      // Key Results
      case 'create_key_result':
        return await createKeyResult(args);
      case 'get_key_results':
        return await listKeyResults(args);
      case 'get_key_result':
        return await getKeyResult(args);
      case 'update_key_result':
        return await updateKeyResult(args);
      case 'delete_key_result':
        return await deleteKeyResult(args);

      default:
        throw new Error(`Unknown objectives tool: ${name}`);
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

// Objectives implementations
async function createObjective(args: any) {
  return await withContext(
    async context => {
      const body: any = {
        name: args.name,
      };

      if (args.description) body.description = args.description;
      if (args.ownerId) body.owner = { id: args.ownerId };
      if (args.startDate || args.endDate) {
        body.timeframe = {};
        if (args.startDate) body.timeframe.startDate = args.startDate;
        if (args.endDate) body.timeframe.endDate = args.endDate;
      }

      const response = await context.axios.post('/objectives', { data: body });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              objective: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function listObjectives(args: StandardListParams & any) {
  return await withContext(
    async context => {
      const normalized = normalizeListParams(args);
      const params: any = {};

      // Use proper pagination handler to fetch all pages
      const paginatedResponse = await fetchAllPages(
        context.axios,
        '/objectives',
        params,
        {
          maxItems: normalized.limit > 100 ? normalized.limit : undefined,
          onPageFetched: (_pageData, _pageNum, _totalSoFar) => {
            // Page fetched successfully
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
          'objective',
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

async function getObjective(
  args: StandardGetParams & {
    id: string;
    instance?: string;
    workspaceId?: string;
  }
) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/objectives/${args.id}`);

      let result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(
          result,
          'objective',
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

async function updateObjective(args: any) {
  return await withContext(
    async context => {
      const body: any = {};

      if (args.name) body.name = args.name;
      if (args.description) body.description = args.description;
      if (args.ownerId) body.owner = { id: args.ownerId };
      if (args.startDate || args.endDate) {
        body.timeframe = {};
        if (args.startDate) body.timeframe.startDate = args.startDate;
        if (args.endDate) body.timeframe.endDate = args.endDate;
      }

      const response = await context.axios.patch(`/objectives/${args.id}`, {
        data: body,
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              objective: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deleteObjective(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/objectives/${args.id}`);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Objective ${args.id} deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// Objective linking implementations
async function listLinksObjectiveToFeatures(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(
        `/objectives/${args.id}/links/features`
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

async function listLinksObjectiveToInitiatives(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(
        `/objectives/${args.id}/links/initiatives`
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

async function createObjectiveToFeatureLink(args: any) {
  return await withContext(
    async context => {
      await context.axios.post(
        `/objectives/${args.id}/links/features/${args.featureId}`,
        { data: {} }
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Linked objective ${args.id} to feature ${args.featureId}`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deleteObjectiveToFeatureLink(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(
        `/objectives/${args.id}/links/features/${args.featureId}`
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Unlinked objective ${args.id} from feature ${args.featureId}`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function createObjectiveToInitiativeLink(args: any) {
  return await withContext(
    async context => {
      await context.axios.post(
        `/objectives/${args.id}/links/initiatives/${args.initiativeId}`,
        { data: {} }
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Linked objective ${args.id} to initiative ${args.initiativeId}`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deleteObjectiveToInitiativeLink(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(
        `/objectives/${args.id}/links/initiatives/${args.initiativeId}`
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Unlinked objective ${args.id} from initiative ${args.initiativeId}`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// Initiatives implementations
async function createInitiative(args: any) {
  return await withContext(
    async context => {
      const body: any = {
        name: args.name,
      };

      if (args.description) body.description = args.description;
      if (args.ownerId) body.owner = { id: args.ownerId };
      if (args.status) body.status = args.status;

      const response = await context.axios.post('/initiatives', { data: body });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              initiative: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function listInitiatives(args: StandardListParams & any) {
  return await withContext(
    async context => {
      const normalized = normalizeListParams(args);
      const params: any = {};

      // Use proper pagination handler to fetch all pages
      const paginatedResponse = await fetchAllPages(
        context.axios,
        '/initiatives',
        params,
        {
          maxItems: normalized.limit > 100 ? normalized.limit : undefined,
          onPageFetched: (_pageData, _pageNum, _totalSoFar) => {
            // Page fetched successfully
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
          'initiative',
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

async function getInitiative(
  args: StandardGetParams & {
    id: string;
    instance?: string;
    workspaceId?: string;
  }
) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/initiatives/${args.id}`);

      let result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(
          result,
          'initiative',
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

async function updateInitiative(args: any) {
  return await withContext(
    async context => {
      const body: any = {};

      if (args.name) body.name = args.name;
      if (args.description) body.description = args.description;
      if (args.ownerId) body.owner = { id: args.ownerId };
      if (args.status) body.status = args.status;

      const response = await context.axios.patch(`/initiatives/${args.id}`, {
        data: body,
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              initiative: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deleteInitiative(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/initiatives/${args.id}`);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Initiative ${args.id} deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// Initiative linking implementations
async function listLinksInitiativeToObjectives(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(
        `/initiatives/${args.id}/links/objectives`
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

async function listLinksInitiativeToFeatures(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(
        `/initiatives/${args.id}/links/features`
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

async function createInitiativeToObjectiveLink(args: any) {
  return await withContext(
    async context => {
      await context.axios.post(
        `/initiatives/${args.id}/links/objectives/${args.objectiveId}`,
        { data: {} }
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Linked initiative ${args.id} to objective ${args.objectiveId}`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deleteInitiativeToObjectiveLink(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(
        `/initiatives/${args.id}/links/objectives/${args.objectiveId}`
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Unlinked initiative ${args.id} from objective ${args.objectiveId}`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function createInitiativeToFeatureLink(args: any) {
  return await withContext(
    async context => {
      await context.axios.post(
        `/initiatives/${args.id}/links/features/${args.featureId}`,
        { data: {} }
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Linked initiative ${args.id} to feature ${args.featureId}`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deleteInitiativeToFeatureLink(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(
        `/initiatives/${args.id}/links/features/${args.featureId}`
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Unlinked initiative ${args.id} from feature ${args.featureId}`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// Key Results implementations
async function createKeyResult(args: any) {
  return await withContext(
    async context => {
      const body: any = {
        name: args.name,
        objective: { id: args.objectiveId },
        type: args.type,
        targetValue: args.targetValue,
      };

      if (args.startValue !== undefined) body.startValue = args.startValue;
      if (args.currentValue !== undefined)
        body.currentValue = args.currentValue;

      const response = await context.axios.post('/key-results', { data: body });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              keyResult: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function listKeyResults(args: StandardListParams & any) {
  return await withContext(
    async context => {
      const normalized = normalizeListParams(args);
      const params: any = {};

      // Use proper pagination handler to fetch all pages
      const paginatedResponse = await fetchAllPages(
        context.axios,
        '/key-results',
        params,
        {
          maxItems: normalized.limit > 100 ? normalized.limit : undefined,
          onPageFetched: (_pageData, _pageNum, _totalSoFar) => {
            // Page fetched successfully
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
          'keyResult',
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

async function getKeyResult(
  args: StandardGetParams & {
    id: string;
    instance?: string;
    workspaceId?: string;
  }
) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/key-results/${args.id}`);

      let result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(
          result,
          'keyResult',
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

async function updateKeyResult(args: any) {
  return await withContext(
    async context => {
      const body: any = {};

      if (args.name) body.name = args.name;
      if (args.currentValue !== undefined)
        body.currentValue = args.currentValue;
      if (args.targetValue !== undefined) body.targetValue = args.targetValue;

      const response = await context.axios.patch(`/key-results/${args.id}`, {
        data: body,
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              keyResult: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deleteKeyResult(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/key-results/${args.id}`);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Key result ${args.id} deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}
