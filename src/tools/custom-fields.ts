/**
 * Custom fields management tools for hierarchy entities
 */
import { withContext, formatResponse } from '../utils/tool-wrapper.js';
import { isEnterpriseError } from '../utils/parameter-utils.js';
import { ProductboardError } from '../errors/index.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export function setupCustomFieldsTools() {
  return [
    {
      name: 'get_custom_fields',
      description: 'List all custom fields for hierarchy entities',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'array',
            description: 'Array of custom field types to filter by',
            items: {
              type: 'string',
              enum: [
                'text',
                'custom-description',
                'number',
                'dropdown',
                'multi-dropdown',
                'member',
              ],
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
        required: ['type'],
      },
    },
    {
      name: 'get_custom_field',
      description: 'Retrieve a specific custom field',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Custom field ID',
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
      name: 'get_custom_fields_values',
      description: 'List all custom field values',
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'array',
            description:
              'Array of custom field types (mandatory if customField.id not specified)',
            items: {
              type: 'string',
              enum: [
                'text',
                'custom-description',
                'number',
                'dropdown',
                'multi-dropdown',
                'member',
              ],
            },
          },
          'customField.id': {
            type: 'string',
            description:
              'Show values for specific custom field (mandatory if type not specified)',
          },
          'hierarchyEntity.id': {
            type: 'string',
            description: 'Show values for specific hierarchy entity (optional)',
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
      name: 'get_custom_field_value',
      description: 'Retrieve a custom field value for a hierarchy entity',
      inputSchema: {
        type: 'object',
        properties: {
          'customField.id': {
            type: 'string',
            description: 'ID of the custom field',
          },
          'hierarchyEntity.id': {
            type: 'string',
            description: 'ID of the hierarchy entity',
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
        required: ['customField.id', 'hierarchyEntity.id'],
      },
    },
    {
      name: 'set_custom_field_value',
      description: 'Set value of a custom field for a hierarchy entity',
      inputSchema: {
        type: 'object',
        properties: {
          'customField.id': {
            type: 'string',
            description: 'ID of the custom field to be set',
          },
          'hierarchyEntity.id': {
            type: 'string',
            description: 'ID of the hierarchy entity',
          },
          body: {
            type: 'object',
            description: 'Custom field value data',
            properties: {
              type: {
                type: 'string',
                description: 'Type of custom field',
                enum: [
                  'text',
                  'custom-description',
                  'number',
                  'dropdown',
                  'multi-dropdown',
                  'member',
                ],
              },
              value: {
                description:
                  'Field value content (string for text fields, max 1024 chars)',
                anyOf: [
                  { type: 'string', maxLength: 1024 },
                  { type: 'number' },
                  { type: 'array' },
                ],
              },
            },
            required: ['type', 'value'],
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
        required: ['customField.id', 'hierarchyEntity.id', 'body'],
      },
    },
    {
      name: 'delete_custom_field_value',
      description: 'Delete value of a custom field for a hierarchy entity',
      inputSchema: {
        type: 'object',
        properties: {
          'customField.id': {
            type: 'string',
            description: 'ID of the custom field',
          },
          'hierarchyEntity.id': {
            type: 'string',
            description: 'ID of the hierarchy entity',
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
        required: ['customField.id', 'hierarchyEntity.id'],
      },
    },
    {
      name: 'get_feature_statuses',
      description: 'List all feature statuses',
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
  ];
}

export async function handleCustomFieldsTool(name: string, args: any) {
  try {
    switch (name) {
      case 'get_custom_fields':
        return await getCustomFields(args);
      case 'get_custom_field':
        return await getCustomField(args);
      case 'get_custom_fields_values':
        return await getCustomFieldsValues(args);
      case 'get_custom_field_value':
        return await getCustomFieldValue(args);
      case 'set_custom_field_value':
        return await setCustomFieldValue(args);
      case 'delete_custom_field_value':
        return await deleteCustomFieldValue(args);
      case 'get_feature_statuses':
        return await getFeatureStatuses(args);
      default:
        throw new Error(`Unknown custom fields tool: ${name}`);
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

async function getCustomFields(args: any) {
  return await withContext(
    async context => {
      console.error('getCustomFields args:', JSON.stringify(args));
      const params: any = {};

      // Add the type parameter if provided - API expects array format
      if (args.type && Array.isArray(args.type)) {
        params.type = args.type;
      }

      console.error('getCustomFields params:', JSON.stringify(params));

      const response = await context.axios.get(
        '/hierarchy-entities/custom-fields',
        {
          params,
          paramsSerializer: {
            indexes: null, // This tells axios to repeat array parameters instead of using indices
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

async function getCustomField(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(
        `/hierarchy-entities/custom-fields/${args.id}`
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

async function getCustomFieldsValues(args: any) {
  return await withContext(
    async context => {
      const params: any = {};

      // Add optional parameters
      if (args.type && Array.isArray(args.type)) {
        params.type = args.type;
      }
      if (args['customField.id']) {
        params['customField.id'] = args['customField.id'];
      }
      if (args['hierarchyEntity.id']) {
        params['hierarchyEntity.id'] = args['hierarchyEntity.id'];
      }

      const response = await context.axios.get(
        '/hierarchy-entities/custom-fields-values',
        {
          params,
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

async function getCustomFieldValue(args: any) {
  return await withContext(
    async context => {
      const params = {
        'customField.id': args['customField.id'],
        'hierarchyEntity.id': args['hierarchyEntity.id'],
      };

      const response = await context.axios.get(
        '/hierarchy-entities/custom-fields-values/value',
        {
          params,
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

async function setCustomFieldValue(args: any) {
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

      const params = {
        'customField.id': args['customField.id'],
        'hierarchyEntity.id': args['hierarchyEntity.id'],
      };

      const response = await context.axios.put(
        '/hierarchy-entities/custom-fields-values/value',
        {
          data: body,
        },
        {
          params,
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

async function deleteCustomFieldValue(args: any) {
  return await withContext(
    async context => {
      const params = {
        'customField.id': args['customField.id'],
        'hierarchyEntity.id': args['hierarchyEntity.id'],
      };

      await context.axios.delete(
        '/hierarchy-entities/custom-fields-values/value',
        {
          params,
        }
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Custom field value deleted successfully`,
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
