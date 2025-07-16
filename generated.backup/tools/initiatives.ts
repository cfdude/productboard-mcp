/**
 * Auto-generated initiatives management tools
 */
import { withContext, formatResponse } from "../../utils/tool-wrapper.js";

export function setupInitiativesTools() {
  return [
    {
      name: "productboard_get_initiatives",
      description: "List all initiatives",
      inputSchema: {
        type: "object",
        properties: {
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          instance: {
            type: "string",
            description: "instance parameter (optional)"
          },
          workspaceId: {
            type: "string",
            description: "workspaceId parameter (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "includeRaw parameter (optional)"
          }
        }
      }
    },
    {
      name: "productboard_create_initiative",
      description: "Create a new initiative",
      inputSchema: {
        type: "object",
        properties: {
          body: {
            type: "string",
            description: "body parameter"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          instance: {
            type: "string",
            description: "instance parameter (optional)"
          },
          workspaceId: {
            type: "string",
            description: "workspaceId parameter (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "includeRaw parameter (optional)"
          }
        },
        required: ["body"]
      }
    },
    {
      name: "productboard_get_initiative",
      description: "Get a specific initiative",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id parameter"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          instance: {
            type: "string",
            description: "instance parameter (optional)"
          },
          workspaceId: {
            type: "string",
            description: "workspaceId parameter (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "includeRaw parameter (optional)"
          }
        },
        required: ["id"]
      }
    },
    {
      name: "productboard_update_initiative",
      description: "Update an existing initiative",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id parameter"
          },
          body: {
            type: "string",
            description: "body parameter"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          instance: {
            type: "string",
            description: "instance parameter (optional)"
          },
          workspaceId: {
            type: "string",
            description: "workspaceId parameter (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "includeRaw parameter (optional)"
          }
        },
        required: ["id","body"]
      }
    },
    {
      name: "productboard_delete_initiative",
      description: "Delete an initiative",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id parameter"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          instance: {
            type: "string",
            description: "instance parameter (optional)"
          },
          workspaceId: {
            type: "string",
            description: "workspaceId parameter (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "includeRaw parameter (optional)"
          }
        },
        required: ["id"]
      }
    },
    {
      name: "productboard_list_links_initiative_to_objectives",
      description: "List objectives linked to a specific initiative",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id parameter"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          instance: {
            type: "string",
            description: "instance parameter (optional)"
          },
          workspaceId: {
            type: "string",
            description: "workspaceId parameter (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "includeRaw parameter (optional)"
          }
        },
        required: ["id"]
      }
    },
    {
      name: "productboard_list_links_initiative_to_features",
      description: "List features linked to a specific initiative",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id parameter"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          instance: {
            type: "string",
            description: "instance parameter (optional)"
          },
          workspaceId: {
            type: "string",
            description: "workspaceId parameter (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "includeRaw parameter (optional)"
          }
        },
        required: ["id"]
      }
    },
    {
      name: "productboard_create_initiative_to_objective_link",
      description: "Create a new link between an initiative and an objective",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id parameter"
          },
          objectiveId: {
            type: "string",
            description: "objectiveId parameter"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          instance: {
            type: "string",
            description: "instance parameter (optional)"
          },
          workspaceId: {
            type: "string",
            description: "workspaceId parameter (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "includeRaw parameter (optional)"
          }
        },
        required: ["id","objectiveId"]
      }
    },
    {
      name: "productboard_delete_initiative_to_objective_link",
      description: "Delete a link between an initiative and an objective",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id parameter"
          },
          objectiveId: {
            type: "string",
            description: "objectiveId parameter"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          instance: {
            type: "string",
            description: "instance parameter (optional)"
          },
          workspaceId: {
            type: "string",
            description: "workspaceId parameter (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "includeRaw parameter (optional)"
          }
        },
        required: ["id","objectiveId"]
      }
    },
    {
      name: "productboard_create_initiative_to_feature_link",
      description: "Create a new link between an initiative and a feature",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id parameter"
          },
          featureId: {
            type: "string",
            description: "featureId parameter"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          instance: {
            type: "string",
            description: "instance parameter (optional)"
          },
          workspaceId: {
            type: "string",
            description: "workspaceId parameter (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "includeRaw parameter (optional)"
          }
        },
        required: ["id","featureId"]
      }
    },
    {
      name: "productboard_delete_initiative_to_feature_link",
      description: "Delete a link between an initiative and a feature",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id parameter"
          },
          featureId: {
            type: "string",
            description: "featureId parameter"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          instance: {
            type: "string",
            description: "instance parameter (optional)"
          },
          workspaceId: {
            type: "string",
            description: "workspaceId parameter (optional)"
          },
          includeRaw: {
            type: "boolean",
            description: "includeRaw parameter (optional)"
          }
        },
        required: ["id","featureId"]
      }
    }
  ];
}

export async function handleInitiativesTool(name: string, args: any) {
  switch (name) {
    case "productboard_get_initiatives":
      return await initiativesGet(args);
    case "productboard_create_initiative":
      return await initiativeCreate(args);
    case "productboard_get_initiative":
      return await initiativeGet(args);
    case "productboard_update_initiative":
      return await initiativeUpdate(args);
    case "productboard_delete_initiative":
      return await initiativeDelete(args);
    case "productboard_list_links_initiative_to_objectives":
      return await linksListInitiativetoobjectives(args);
    case "productboard_list_links_initiative_to_features":
      return await linksListInitiativetofeatures(args);
    case "productboard_create_initiative_to_objective_link":
      return await initiativeCreateToobjectivelink(args);
    case "productboard_delete_initiative_to_objective_link":
      return await initiativeDeleteToobjectivelink(args);
    case "productboard_create_initiative_to_feature_link":
      return await initiativeCreateTofeaturelink(args);
    case "productboard_delete_initiative_to_feature_link":
      return await initiativeDeleteTofeaturelink(args);
    default:
      throw new Error(`Unknown initiatives tool: ${name}`);
  }
}

export async function initiativesGet(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/initiatives`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function initiativeCreate(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.post(`/initiatives`, body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function initiativeGet(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/initiatives/${args.id}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function initiativeUpdate(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.patch(`/initiatives/${args.id}`, body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function initiativeDelete(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.delete(`/initiatives/${args.id}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function linksListInitiativetoobjectives(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/initiatives/${args.id}/links/objectives`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function linksListInitiativetofeatures(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/initiatives/${args.id}/links/features`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function initiativeCreateToobjectivelink(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.post(`/initiatives/${args.id}/links/objectives/${args.objectiveId}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function initiativeDeleteToobjectivelink(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.delete(`/initiatives/${args.id}/links/objectives/${args.objectiveId}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function initiativeCreateTofeaturelink(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.post(`/initiatives/${args.id}/links/features/${args.featureId}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function initiativeDeleteTofeaturelink(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.delete(`/initiatives/${args.id}/links/features/${args.featureId}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}