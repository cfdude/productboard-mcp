/**
 * Releases and Release Groups management tools
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

export function setupReleasesTools() {
  return [
    // Release Groups operations
    {
      name: 'create_release_group',
      description: 'Create a new release group',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Release group name',
          },
          description: {
            type: 'string',
            description: 'Release group description',
          },
          isDefault: {
            type: 'boolean',
            description: 'Whether this is the default release group',
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
      name: 'list_release_groups',
      description: 'List all release groups',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description:
              'Maximum number of release groups to return (1-100, default: 100)',
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
      name: 'get_release_group',
      description: 'Get a specific release group by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Release group ID',
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
      name: 'update_release_group',
      description: 'Update an existing release group',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Release group ID',
          },
          name: {
            type: 'string',
            description: 'Updated release group name',
          },
          description: {
            type: 'string',
            description: 'Updated description',
          },
          isDefault: {
            type: 'boolean',
            description: 'Updated default status',
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
      name: 'delete_release_group',
      description: 'Delete a release group',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Release group ID',
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

    // Releases operations
    {
      name: 'create_release',
      description: 'Create a new release',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Release name',
          },
          releaseGroupId: {
            type: 'string',
            description: 'Release group ID',
          },
          state: {
            type: 'string',
            enum: ['future', 'in_progress', 'released', 'archived'],
            description: 'Release state',
          },
          description: {
            type: 'string',
            description: 'Release description',
          },
          startDate: {
            type: 'string',
            description: 'Release start date (YYYY-MM-DD)',
          },
          releaseDate: {
            type: 'string',
            description: 'Release date (YYYY-MM-DD)',
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
        required: ['name', 'releaseGroupId'],
      },
    },
    {
      name: 'list_releases',
      description: 'List all releases',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description:
              'Maximum number of releases to return (1-100, default: 100)',
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
          releaseGroupId: {
            type: 'string',
            description: 'Filter by release group ID',
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
      name: 'get_release',
      description: 'Get a specific release by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Release ID',
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
      name: 'update_release',
      description: 'Update an existing release',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Release ID',
          },
          name: {
            type: 'string',
            description: 'Updated release name',
          },
          state: {
            type: 'string',
            enum: ['future', 'in_progress', 'released', 'archived'],
            description: 'Updated release state',
          },
          description: {
            type: 'string',
            description: 'Updated description',
          },
          startDate: {
            type: 'string',
            description: 'Updated start date (YYYY-MM-DD)',
          },
          releaseDate: {
            type: 'string',
            description: 'Updated release date (YYYY-MM-DD)',
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
      name: 'delete_release',
      description: 'Delete a release',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Release ID',
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

    // Feature Release Assignments
    {
      name: 'list_feature_release_assignments',
      description: 'List all feature release assignments',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description:
              'Maximum number of assignments to return (1-100, default: 100)',
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
          featureId: {
            type: 'string',
            description: 'Filter by feature ID',
          },
          releaseId: {
            type: 'string',
            description: 'Filter by release ID',
          },
          releaseState: {
            type: 'string',
            description: 'Filter by release state',
          },
          releaseEndDateFrom: {
            type: 'string',
            description: 'Filter by release end date from (YYYY-MM-DD)',
          },
          releaseEndDateTo: {
            type: 'string',
            description: 'Filter by release end date to (YYYY-MM-DD)',
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
      name: 'get_feature_release_assignment',
      description: 'Get a specific feature release assignment',
      inputSchema: {
        type: 'object',
        properties: {
          featureId: {
            type: 'string',
            description: 'Feature ID',
          },
          releaseId: {
            type: 'string',
            description: 'Release ID',
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
        required: ['featureId', 'releaseId'],
      },
    },
    {
      name: 'update_feature_release_assignment',
      description: 'Update or create a feature release assignment',
      inputSchema: {
        type: 'object',
        properties: {
          featureId: {
            type: 'string',
            description: 'Feature ID',
          },
          releaseId: {
            type: 'string',
            description: 'Release ID',
          },
          isAssigned: {
            type: 'boolean',
            description: 'Whether the feature is assigned to the release',
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
        required: ['featureId', 'releaseId', 'isAssigned'],
      },
    },
  ];
}

export async function handleReleasesTool(name: string, args: any) {
  try {
    switch (name) {
      // Release Groups
      case 'create_release_group':
        return await createReleaseGroup(args);
      case 'list_release_groups':
        return await listReleaseGroups(args);
      case 'get_release_group':
        return await getReleaseGroup(args);
      case 'update_release_group':
        return await updateReleaseGroup(args);
      case 'delete_release_group':
        return await deleteReleaseGroup(args);

      // Releases
      case 'create_release':
        return await createRelease(args);
      case 'list_releases':
        return await listReleases(args);
      case 'get_release':
        return await getRelease(args);
      case 'update_release':
        return await updateRelease(args);
      case 'delete_release':
        return await deleteRelease(args);

      // Feature Release Assignments
      case 'list_feature_release_assignments':
        return await listFeatureReleaseAssignments(args);
      case 'get_feature_release_assignment':
        return await getFeatureReleaseAssignment(args);
      case 'update_feature_release_assignment':
        return await updateFeatureReleaseAssignment(args);

      default:
        throw new Error(`Unknown releases tool: ${name}`);
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

// Release Groups implementations
async function createReleaseGroup(args: any) {
  return await withContext(
    async context => {
      const body: any = {
        name: args.name,
      };

      if (args.description) body.description = args.description;
      if (args.isDefault !== undefined) body.isDefault = args.isDefault;

      const response = await context.axios.post('/release-groups', {
        data: body,
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              releaseGroup: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function listReleaseGroups(args: StandardListParams & any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeListParams(args);
      const params: any = {
        pageLimit: normalizedParams.limit,
        pageOffset: normalizedParams.startWith,
      };

      const response = await context.axios.get('/release-groups', { params });

      const result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData && result.data) {
        result.data = filterArrayByDetailLevel(
          result.data,
          'releaseGroup',
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

async function getReleaseGroup(
  args: StandardGetParams & {
    id: string;
    instance?: string;
    workspaceId?: string;
  }
) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/release-groups/${args.id}`);

      let result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(
          result,
          'releaseGroup',
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

async function updateReleaseGroup(args: any) {
  return await withContext(
    async context => {
      const body: any = {};

      if (args.name) body.name = args.name;
      if (args.description) body.description = args.description;
      if (args.isDefault !== undefined) body.isDefault = args.isDefault;

      const response = await context.axios.patch(`/release-groups/${args.id}`, {
        data: body,
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              releaseGroup: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deleteReleaseGroup(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/release-groups/${args.id}`);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Release group ${args.id} deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// Releases implementations
async function createRelease(args: any) {
  return await withContext(
    async context => {
      const body: any = {
        name: args.name,
        releaseGroup: { id: args.releaseGroupId },
      };

      if (args.state) body.state = args.state;
      if (args.description) body.description = args.description;
      if (args.startDate)
        body.timeframe = { ...body.timeframe, startDate: args.startDate };
      if (args.releaseDate)
        body.timeframe = { ...body.timeframe, endDate: args.releaseDate };

      const response = await context.axios.post('/releases', { data: body });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              release: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function listReleases(args: StandardListParams & any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeListParams(args);
      const params: any = {
        pageLimit: normalizedParams.limit,
        pageOffset: normalizedParams.startWith,
      };

      if (args.releaseGroupId) params['releaseGroup.id'] = args.releaseGroupId;

      const response = await context.axios.get('/releases', { params });

      const result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData && result.data) {
        result.data = filterArrayByDetailLevel(
          result.data,
          'release',
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

async function getRelease(
  args: StandardGetParams & {
    id: string;
    instance?: string;
    workspaceId?: string;
  }
) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/releases/${args.id}`);

      let result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(
          result,
          'release',
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

async function updateRelease(args: any) {
  return await withContext(
    async context => {
      const body: any = {};

      if (args.name) body.name = args.name;
      if (args.state) body.state = args.state;
      if (args.description) body.description = args.description;
      if (args.startDate || args.releaseDate) {
        body.timeframe = {};
        if (args.startDate) body.timeframe.startDate = args.startDate;
        if (args.releaseDate) body.timeframe.endDate = args.releaseDate;
      }

      const response = await context.axios.patch(`/releases/${args.id}`, {
        data: body,
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              release: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deleteRelease(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/releases/${args.id}`);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Release ${args.id} deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// Feature Release Assignments implementations
async function listFeatureReleaseAssignments(args: StandardListParams & any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeListParams(args);
      const params: any = {
        pageLimit: normalizedParams.limit,
        pageOffset: normalizedParams.startWith,
      };

      if (args.featureId) params['feature.id'] = args.featureId;
      if (args.releaseId) params['release.id'] = args.releaseId;
      if (args.releaseState) params['release.state'] = args.releaseState;
      if (args.releaseEndDateFrom)
        params['release.timeframe.endDate.from'] = args.releaseEndDateFrom;
      if (args.releaseEndDateTo)
        params['release.timeframe.endDate.to'] = args.releaseEndDateTo;

      const response = await context.axios.get('/feature-release-assignments', {
        params,
      });

      const result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData && result.data) {
        result.data = filterArrayByDetailLevel(
          result.data,
          'featureReleaseAssignment',
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

async function getFeatureReleaseAssignment(
  args: StandardGetParams & {
    featureId: string;
    releaseId: string;
    instance?: string;
    workspaceId?: string;
  }
) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const params = {
        'release.id': args.releaseId,
        'feature.id': args.featureId,
      };

      const response = await context.axios.get(
        '/feature-release-assignments/assignment',
        { params }
      );

      let result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(
          result,
          'featureReleaseAssignment',
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

async function updateFeatureReleaseAssignment(args: any) {
  return await withContext(
    async context => {
      const body = {
        feature: { id: args.featureId },
        release: { id: args.releaseId },
        isAssigned: args.isAssigned,
      };

      const params = {
        'release.id': args.releaseId,
        'feature.id': args.featureId,
      };

      const response = await context.axios.put(
        '/feature-release-assignments/assignment',
        { data: body },
        { params }
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              assignment: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}
