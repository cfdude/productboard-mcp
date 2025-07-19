/**
 * Notes management tools
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
 * Setup notes tool definitions
 */
export function setupNotesTools() {
  return [
    // Core Notes operations
    {
      name: 'create_note',
      description: 'Create a new note in Productboard',
      inputSchema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Note title',
          },
          content: {
            type: 'string',
            description: 'Note content/body',
          },
          displayUrl: {
            type: 'string',
            description: 'Display URL for the note',
          },
          userEmail: {
            type: 'string',
            description: 'Email of the user who created the note',
          },
          userName: {
            type: 'string',
            description: 'Name of the user',
          },
          userExternalId: {
            type: 'string',
            description: 'External ID for the user',
          },
          companyDomain: {
            type: 'string',
            description: 'Company domain to associate with the note',
          },
          ownerEmail: {
            type: 'string',
            description: 'Email of the note owner',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags to apply to the note',
          },
          sourceOrigin: {
            type: 'string',
            description: 'Source origin (e.g., email, slack, api)',
          },
          sourceRecordId: {
            type: 'string',
            description: 'Source record ID for tracking',
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
        required: ['title', 'content'],
      },
    },
    {
      name: 'get_notes',
      description: 'List all notes with filtering and pagination',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description:
              'Maximum number of notes to return (1-100, default: 100)',
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
          term: {
            type: 'string',
            description: 'Search term for fulltext search',
          },
          companyId: {
            type: 'string',
            description: 'Filter by company ID',
          },
          featureId: {
            type: 'string',
            description: 'Filter by linked feature ID',
          },
          ownerEmail: {
            type: 'string',
            description: 'Filter by owner email',
          },
          source: {
            type: 'string',
            description: 'Filter by source',
          },
          anyTag: {
            type: 'string',
            description: 'Filter by any of these tags (comma-separated)',
          },
          allTags: {
            type: 'string',
            description: 'Filter by all of these tags (comma-separated)',
          },
          createdFrom: {
            type: 'string',
            description: 'Filter notes created from this date (YYYY-MM-DD)',
          },
          createdTo: {
            type: 'string',
            description: 'Filter notes created to this date (YYYY-MM-DD)',
          },
          updatedFrom: {
            type: 'string',
            description: 'Filter notes updated from this date (YYYY-MM-DD)',
          },
          updatedTo: {
            type: 'string',
            description: 'Filter notes updated to this date (YYYY-MM-DD)',
          },
          dateFrom: {
            type: 'string',
            description: 'Filter notes by date from (YYYY-MM-DD)',
          },
          dateTo: {
            type: 'string',
            description: 'Filter notes by date to (YYYY-MM-DD)',
          },
          pageCursor: {
            type: 'string',
            description: 'Cursor for pagination',
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
      name: 'get_note',
      description: 'Get a specific note by ID',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Note ID',
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
      name: 'update_note',
      description: 'Update an existing note',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Note ID',
          },
          title: {
            type: 'string',
            description: 'Updated title',
          },
          content: {
            type: 'string',
            description: 'Updated content',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Updated tags (replaces existing tags)',
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
      name: 'delete_note',
      description: 'Delete a note',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Note ID',
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

    // Note followers operations
    {
      name: 'add_note_followers',
      description: 'Add followers to a note',
      inputSchema: {
        type: 'object',
        properties: {
          noteId: {
            type: 'string',
            description: 'Note ID',
          },
          emails: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of email addresses to add as followers',
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
        required: ['noteId', 'emails'],
      },
    },
    {
      name: 'remove_note_follower',
      description: 'Remove a follower from a note',
      inputSchema: {
        type: 'object',
        properties: {
          noteId: {
            type: 'string',
            description: 'Note ID',
          },
          email: {
            type: 'string',
            description: 'Email address to remove from followers',
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
        required: ['noteId', 'email'],
      },
    },

    // Note tags operations
    {
      name: 'list_note_tags',
      description: 'List all tags on a note',
      inputSchema: {
        type: 'object',
        properties: {
          noteId: {
            type: 'string',
            description: 'Note ID',
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
        required: ['noteId'],
      },
    },
    {
      name: 'add_note_tag',
      description: 'Add a tag to a note',
      inputSchema: {
        type: 'object',
        properties: {
          noteId: {
            type: 'string',
            description: 'Note ID',
          },
          tagName: {
            type: 'string',
            description: 'Tag name to add',
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
        required: ['noteId', 'tagName'],
      },
    },
    {
      name: 'remove_note_tag',
      description: 'Remove a tag from a note',
      inputSchema: {
        type: 'object',
        properties: {
          noteId: {
            type: 'string',
            description: 'Note ID',
          },
          tagName: {
            type: 'string',
            description: 'Tag name to remove',
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
        required: ['noteId', 'tagName'],
      },
    },

    // Note links operations
    {
      name: 'list_note_links',
      description: 'List all links on a note',
      inputSchema: {
        type: 'object',
        properties: {
          noteId: {
            type: 'string',
            description: 'Note ID',
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
        required: ['noteId'],
      },
    },
    {
      name: 'create_note_link',
      description: 'Create a link from a note to another entity',
      inputSchema: {
        type: 'object',
        properties: {
          noteId: {
            type: 'string',
            description: 'Note ID',
          },
          entityId: {
            type: 'string',
            description: 'ID of entity to link to (e.g., feature ID)',
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
        required: ['noteId', 'entityId'],
      },
    },

    // Feedback form operations
    {
      name: 'list_feedback_form_configurations',
      description: 'List all feedback form configurations',
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
      name: 'get_feedback_form_configuration',
      description: 'Get a specific feedback form configuration',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Feedback form configuration ID',
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
      name: 'submit_feedback_form',
      description: 'Submit a feedback form',
      inputSchema: {
        type: 'object',
        properties: {
          formId: {
            type: 'string',
            description: 'Feedback form ID',
          },
          email: {
            type: 'string',
            description: 'Email of the person submitting feedback',
          },
          content: {
            type: 'string',
            description: 'Feedback content',
          },
          additionalFields: {
            type: 'object',
            description: 'Additional form fields as key-value pairs',
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
        required: ['formId', 'email', 'content'],
      },
    },
  ];
}

/**
 * Handle notes tool calls
 */
export async function handleNotesTool(name: string, args: any) {
  try {
    switch (name) {
      // Core Notes operations
      case 'create_note':
        return await createNote(args);
      case 'get_notes':
        return await listNotes(args);
      case 'get_note':
        return await getNote(args);
      case 'update_note':
        return await updateNote(args);
      case 'delete_note':
        return await deleteNote(args);

      // Note followers
      case 'add_note_followers':
        return await addNoteFollowers(args);
      case 'remove_note_follower':
        return await removeNoteFollower(args);

      // Note tags
      case 'list_note_tags':
        return await listNoteTags(args);
      case 'add_note_tag':
        return await addNoteTag(args);
      case 'remove_note_tag':
        return await removeNoteTag(args);

      // Note links
      case 'list_note_links':
        return await listNoteLinks(args);
      case 'create_note_link':
        return await createNoteLink(args);

      // Feedback forms
      case 'list_feedback_form_configurations':
        return await listFeedbackFormConfigurations(args);
      case 'get_feedback_form_configuration':
        return await getFeedbackFormConfiguration(args);
      case 'submit_feedback_form':
        return await submitFeedbackForm(args);

      default:
        throw new Error(`Unknown notes tool: ${name}`);
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

// Core Notes implementations
async function createNote(args: any) {
  return await withContext(
    async context => {
      const body: any = {
        title: args.title,
        content: args.content,
      };

      // Add display URL
      if (args.displayUrl) {
        body.display_url = args.displayUrl;
      }

      // Add user information
      if (args.userEmail || args.userName || args.userExternalId) {
        body.user = {};
        if (args.userEmail) body.user.email = args.userEmail;
        if (args.userName) body.user.name = args.userName;
        if (args.userExternalId) body.user.external_id = args.userExternalId;
      }

      // Add company information (can be used with user.email based on CURL example)
      if (args.companyDomain) {
        body.company = { domain: args.companyDomain };
      }
      // Add owner information
      if (args.ownerEmail) {
        body.owner = { email: args.ownerEmail };
      }
      // Add source information
      if (args.sourceOrigin || args.sourceRecordId) {
        body.source = {};
        if (args.sourceOrigin) body.source.origin = args.sourceOrigin;
        if (args.sourceRecordId) body.source.record_id = args.sourceRecordId;
      }
      // Add optional fields
      if (args.tags && args.tags.length > 0) body.tags = args.tags;

      const response = await context.axios.post('/notes', body);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              note: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function listNotes(args: StandardListParams & any) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeListParams(args);
      const params: any = {
        pageLimit: normalizedParams.limit,
      };

      // Handle startWith as pageCursor for notes API
      if (args.pageCursor) {
        params.pageCursor = args.pageCursor;
      } else if (normalizedParams.startWith > 0) {
        params.pageOffset = normalizedParams.startWith;
      }

      // Add filters
      if (args.term) params.term = args.term;
      if (args.companyId) params.companyId = args.companyId;
      if (args.featureId) params.featureId = args.featureId;
      if (args.ownerEmail) params.ownerEmail = args.ownerEmail;
      if (args.source) params.source = args.source;
      if (args.anyTag) params.anyTag = args.anyTag;
      if (args.allTags) params.allTags = args.allTags;

      // Date filters
      if (args.createdFrom) params.createdFrom = args.createdFrom;
      if (args.createdTo) params.createdTo = args.createdTo;
      if (args.updatedFrom) params.updatedFrom = args.updatedFrom;
      if (args.updatedTo) params.updatedTo = args.updatedTo;
      if (args.dateFrom) params.dateFrom = args.dateFrom;
      if (args.dateTo) params.dateTo = args.dateTo;

      const response = await context.axios.get('/notes', { params });

      const result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData && result.data) {
        result.data = filterArrayByDetailLevel(
          result.data,
          'note',
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

async function getNote(
  args: StandardGetParams & {
    id: string;
    instance?: string;
    workspaceId?: string;
  }
) {
  return await withContext(
    async context => {
      const normalizedParams = normalizeGetParams(args);
      const response = await context.axios.get(`/notes/${args.id}`);

      let result = response.data;

      // Apply detail level filtering
      if (!normalizedParams.includeSubData) {
        result = filterByDetailLevel(result, 'note', normalizedParams.detail);
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

async function updateNote(args: any) {
  return await withContext(
    async context => {
      const body: any = {};

      if (args.title) body.title = args.title;
      if (args.content) body.content = args.content;
      if (args.tags) body.tags = args.tags;

      const response = await context.axios.patch(`/notes/${args.id}`, {
        data: body,
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              note: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function deleteNote(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/notes/${args.id}`);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Note ${args.id} deleted successfully`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// Note followers implementations
async function addNoteFollowers(args: any) {
  return await withContext(
    async context => {
      const body = {
        userFollowers: args.emails.map((email: string) => ({ email })),
      };

      const response = await context.axios.post(
        `/notes/${args.noteId}/user-followers`,
        { data: body }
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Added ${args.emails.length} followers to note ${args.noteId}`,
              data: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function removeNoteFollower(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(
        `/notes/${args.noteId}/user-followers/${args.email}`
      );

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Removed follower ${args.email} from note ${args.noteId}`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// Note tags implementations
async function listNoteTags(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(`/notes/${args.noteId}/tags`);

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

async function addNoteTag(args: any) {
  return await withContext(
    async context => {
      await context.axios.post(`/notes/${args.noteId}/tags/${args.tagName}`);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Added tag "${args.tagName}" to note ${args.noteId}`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

async function removeNoteTag(args: any) {
  return await withContext(
    async context => {
      await context.axios.delete(`/notes/${args.noteId}/tags/${args.tagName}`);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Removed tag "${args.tagName}" from note ${args.noteId}`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// Note links implementations
async function listNoteLinks(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(`/notes/${args.noteId}/links`);

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

async function createNoteLink(args: any) {
  return await withContext(
    async context => {
      await context.axios.post(`/notes/${args.noteId}/links/${args.entityId}`);

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: `Created link from note ${args.noteId} to entity ${args.entityId}`,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}

// Feedback form implementations
async function listFeedbackFormConfigurations(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get('/feedback-form-configurations');

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

async function getFeedbackFormConfiguration(args: any) {
  return await withContext(
    async context => {
      const response = await context.axios.get(
        `/feedback-form-configurations/${args.id}`
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

async function submitFeedbackForm(args: any) {
  return await withContext(
    async context => {
      const body: any = {
        formId: args.formId,
        user: {
          email: args.email,
        },
        content: args.content,
      };

      if (args.additionalFields) {
        body.fields = args.additionalFields;
      }

      const response = await context.axios.post('/feedback-forms', {
        data: body,
      });

      return {
        content: [
          {
            type: 'text',
            text: formatResponse({
              success: true,
              message: 'Feedback form submitted successfully',
              data: response.data,
            }),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId
  );
}
