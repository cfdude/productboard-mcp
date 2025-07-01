/**
 * Notes management tools
 * Tier 1: Workflows, Tier 2: Resource Operations, Tier 3: Power User Tools
 */
import { withContext, formatResponse, handlePagination } from "../utils/tool-wrapper.js";

/**
 * Setup notes tool definitions
 */
export function setupNotesTools() {
  return [
    // Tier 1: Workflow Tools
    {
      name: "productboard_notes_workflow_feedback_processing",
      description: "Complete workflow to process customer feedback into notes with company linking",
      inputSchema: {
        type: "object",
        properties: {
          feedback: {
            type: "string",
            description: "Customer feedback content"
          },
          customerEmail: {
            type: "string",
            description: "Customer email address"
          },
          customerName: {
            type: "string",
            description: "Customer name (optional)"
          },
          companyName: {
            type: "string",
            description: "Company name (optional)"
          },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Tags to apply to the note"
          },
          instance: {
            type: "string",
            description: "Productboard instance name (optional)"
          },
          workspaceId: {
            type: "string",
            description: "Workspace ID (optional)"
          }
        },
        required: ["feedback", "customerEmail"]
      }
    },

    // Tier 2: Resource Operations
    {
      name: "productboard_notes_create",
      description: "Create a new note in Productboard",
      inputSchema: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Note title"
          },
          content: {
            type: "string",
            description: "Note content"
          },
          userEmail: {
            type: "string",
            description: "User email"
          },
          userName: {
            type: "string",
            description: "User name (optional)"
          },
          companyName: {
            type: "string",
            description: "Company name (optional)"
          },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Tags to apply"
          },
          instance: {
            type: "string",
            description: "Productboard instance name (optional)"
          },
          workspaceId: {
            type: "string",
            description: "Workspace ID (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "Include raw API response"
          }
        },
        required: ["title", "content", "userEmail"]
      }
    },
    {
      name: "productboard_notes_list",
      description: "List notes with filtering options",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of notes to return (default: 100)"
          },
          createdFrom: {
            type: "string",
            description: "Filter notes created from this date (YYYY-MM-DD)"
          },
          createdTo: {
            type: "string",
            description: "Filter notes created to this date (YYYY-MM-DD)"
          },
          updatedFrom: {
            type: "string",
            description: "Filter notes updated from this date (YYYY-MM-DD)"
          },
          updatedTo: {
            type: "string",
            description: "Filter notes updated to this date (YYYY-MM-DD)"
          },
          term: {
            type: "string",
            description: "Search term for fulltext search"
          },
          companyId: {
            type: "string",
            description: "Filter by company ID"
          },
          ownerEmail: {
            type: "string",
            description: "Filter by owner email"
          },
          anyTag: {
            type: "array",
            items: { type: "string" },
            description: "Filter by any of these tags"
          },
          allTags: {
            type: "array",
            items: { type: "string" },
            description: "Filter by all of these tags"
          },
          instance: {
            type: "string",
            description: "Productboard instance name (optional)"
          },
          workspaceId: {
            type: "string",
            description: "Workspace ID (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "Include raw API response"
          }
        }
      }
    },
    {
      name: "productboard_notes_get",
      description: "Get a specific note by ID",
      inputSchema: {
        type: "object",
        properties: {
          noteId: {
            type: "string",
            description: "Note ID"
          },
          instance: {
            type: "string",
            description: "Productboard instance name (optional)"
          },
          workspaceId: {
            type: "string",
            description: "Workspace ID (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "Include raw API response"
          }
        },
        required: ["noteId"]
      }
    },
    {
      name: "productboard_notes_update",
      description: "Update an existing note",
      inputSchema: {
        type: "object",
        properties: {
          noteId: {
            type: "string",
            description: "Note ID"
          },
          title: {
            type: "string",
            description: "Updated title"
          },
          content: {
            type: "string",
            description: "Updated content"
          },
          tags: {
            type: "array",
            items: { type: "string" },
            description: "Updated tags"
          },
          instance: {
            type: "string",
            description: "Productboard instance name (optional)"
          },
          workspaceId: {
            type: "string",
            description: "Workspace ID (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "Include raw API response"
          }
        },
        required: ["noteId"]
      }
    },
    {
      name: "productboard_notes_delete",
      description: "Delete a note",
      inputSchema: {
        type: "object",
        properties: {
          noteId: {
            type: "string",
            description: "Note ID"
          },
          instance: {
            type: "string",
            description: "Productboard instance name (optional)"
          },
          workspaceId: {
            type: "string",
            description: "Workspace ID (optional)"
          }
        },
        required: ["noteId"]
      }
    },

    // Tier 3: Power User Tools
    {
      name: "productboard_notes_bulk_tag_management",
      description: "Bulk add or remove tags from multiple notes",
      inputSchema: {
        type: "object",
        properties: {
          noteIds: {
            type: "array",
            items: { type: "string" },
            description: "Array of note IDs"
          },
          addTags: {
            type: "array",
            items: { type: "string" },
            description: "Tags to add"
          },
          removeTags: {
            type: "array",
            items: { type: "string" },
            description: "Tags to remove"
          },
          instance: {
            type: "string",
            description: "Productboard instance name (optional)"
          },
          workspaceId: {
            type: "string",
            description: "Workspace ID (optional)"
          }
        },
        required: ["noteIds"]
      }
    },
    {
      name: "productboard_notes_analytics_insights",
      description: "Generate analytics insights from notes data",
      inputSchema: {
        type: "object",
        properties: {
          dateRange: {
            type: "string",
            description: "Date range for analysis (e.g., '30d', '3m', '1y')"
          },
          groupBy: {
            type: "string",
            enum: ["company", "tag", "user", "date"],
            description: "Group insights by field"
          },
          includeMetrics: {
            type: "array",
            items: { 
              type: "string",
              enum: ["count", "growth", "top_companies", "top_tags", "sentiment"]
            },
            description: "Metrics to include in analysis"
          },
          instance: {
            type: "string",
            description: "Productboard instance name (optional)"
          },
          workspaceId: {
            type: "string",
            description: "Workspace ID (optional)"
          }
        }
      }
    }
  ];
}

/**
 * Handle notes tool calls
 */
export async function handleNotesTool(name: string, args: any) {
  switch (name) {
    case "productboard_notes_workflow_feedback_processing":
      return await processFeedbackWorkflow(args);
    case "productboard_notes_create":
      return await createNote(args);
    case "productboard_notes_list":
      return await listNotes(args);
    case "productboard_notes_get":
      return await getNote(args);
    case "productboard_notes_update":
      return await updateNote(args);
    case "productboard_notes_delete":
      return await deleteNote(args);
    case "productboard_notes_bulk_tag_management":
      return await bulkTagManagement(args);
    case "productboard_notes_analytics_insights":
      return await generateAnalyticsInsights(args);
    default:
      throw new Error(`Unknown notes tool: ${name}`);
  }
}

// Implementation functions
async function processFeedbackWorkflow(args: any) {
  return await withContext(async (context) => {
    // Step 1: Create or find company
    let companyId = null;
    if (args.companyName) {
      // Implementation would search for existing company or create new one
      // For now, we'll include it in the note data
    }

    // Step 2: Create note with customer feedback
    const noteData = {
      title: `Customer Feedback from ${args.customerName || args.customerEmail}`,
      content: args.feedback,
      user: {
        email: args.customerEmail,
        name: args.customerName
      },
      ...(args.companyName && { company: { name: args.companyName } }),
      ...(args.tags && { tags: args.tags })
    };

    const response = await context.axios.post("/notes", noteData);
    
    return {
      content: [{
        type: "text",
        text: `Successfully processed feedback and created note ${response.data.data.id}. 
        
Workflow completed:
✅ Note created with customer feedback
✅ Customer linked: ${args.customerEmail}
${args.companyName ? `✅ Company associated: ${args.companyName}` : ''}
${args.tags ? `✅ Tags applied: ${args.tags.join(', ')}` : ''}

Note URL: ${response.data.links?.html || 'N/A'}`
      }]
    };
  }, args.instance, args.workspaceId);
}

async function createNote(args: any) {
  return await withContext(async (context) => {
    const noteData = {
      title: args.title,
      content: args.content,
      user: {
        email: args.userEmail,
        ...(args.userName && { name: args.userName })
      },
      ...(args.companyName && { company: { name: args.companyName } }),
      ...(args.tags && { tags: args.tags })
    };

    const response = await context.axios.post("/notes", noteData);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

async function listNotes(args: any) {
  return await withContext(async (context) => {
    const params: any = {};
    
    if (args.limit) params.pageLimit = Math.min(args.limit, 2000);
    if (args.createdFrom) params.createdFrom = args.createdFrom;
    if (args.createdTo) params.createdTo = args.createdTo;
    if (args.updatedFrom) params.updatedFrom = args.updatedFrom;
    if (args.updatedTo) params.updatedTo = args.updatedTo;
    if (args.term) params.term = args.term;
    if (args.companyId) params.companyId = args.companyId;
    if (args.ownerEmail) params.ownerEmail = args.ownerEmail;
    if (args.anyTag) params.anyTag = args.anyTag;
    if (args.allTags) params.allTags = args.allTags;

    const response = await context.axios.get("/notes", { params });
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

async function getNote(args: any) {
  return await withContext(async (context) => {
    const response = await context.axios.get(`/notes/${args.noteId}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

async function updateNote(args: any) {
  return await withContext(async (context) => {
    const updateData: any = {};
    if (args.title) updateData.title = args.title;
    if (args.content) updateData.content = args.content;
    if (args.tags) updateData.tags = args.tags;

    const response = await context.axios.patch(`/notes/${args.noteId}`, { data: updateData });
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

async function deleteNote(args: any) {
  return await withContext(async (context) => {
    await context.axios.delete(`/notes/${args.noteId}`);
    
    return {
      content: [{
        type: "text",
        text: `Note ${args.noteId} deleted successfully`
      }]
    };
  }, args.instance, args.workspaceId);
}

async function bulkTagManagement(args: any) {
  return await withContext(async (context) => {
    const results = [];
    
    for (const noteId of args.noteIds) {
      try {
        // Add tags
        if (args.addTags) {
          for (const tag of args.addTags) {
            await context.axios.post(`/notes/${noteId}/tags/${tag}`);
          }
        }
        
        // Remove tags  
        if (args.removeTags) {
          for (const tag of args.removeTags) {
            await context.axios.delete(`/notes/${noteId}/tags/${tag}`);
          }
        }
        
        results.push({ noteId, status: "success" });
      } catch (error) {
        results.push({ 
          noteId, 
          status: "error", 
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    return {
      content: [{
        type: "text",
        text: formatResponse(results)
      }]
    };
  }, args.instance, args.workspaceId);
}

async function generateAnalyticsInsights(args: any) {
  return await withContext(async (context) => {
    // This would implement analytics logic
    // For now, return placeholder
    return {
      content: [{
        type: "text", 
        text: "Analytics insights feature coming soon. This would analyze notes data for trends, top companies, popular tags, etc."
      }]
    };
  }, args.instance, args.workspaceId);
}