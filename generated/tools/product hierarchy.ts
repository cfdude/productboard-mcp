/**
 * Auto-generated product hierarchy management tools
 */
import { withContext, formatResponse } from "../../utils/tool-wrapper.js";

export function setupProduct hierarchyTools() {
  return [
    {
      name: "productboard_create_feature",
      description: "Create a feature",
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
      name: "productboard_get_features",
      description: "List all features",
      inputSchema: {
        type: "object",
        properties: {
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          status.id: {
            type: "string",
            description: "status.id parameter (optional)"
          },
          status.name: {
            type: "string",
            description: "status.name parameter (optional)"
          },
          parent.id: {
            type: "string",
            description: "parent.id parameter (optional)"
          },
          archived: {
            type: "string",
            description: "archived parameter (optional)"
          },
          owner.email: {
            type: "string",
            description: "owner.email parameter (optional)"
          },
          note.id: {
            type: "string",
            description: "note.id parameter (optional)"
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
      name: "productboard_get_feature",
      description: "Retrieve a feature",
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
      name: "productboard_update_feature",
      description: "Update a feature",
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
      name: "productboard_update_feature_deprecated",
      description: "Update a feature",
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
      name: "productboard_delete_feature",
      description: "Delete a feature",
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
      name: "productboard_list_links_to_initiatives",
      description: "List initiatives linked to a specific feature",
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
      name: "productboard_create_initiative_link",
      description: "Create a new link between a feature and an initiative",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id parameter"
          },
          initiativeId: {
            type: "string",
            description: "initiativeId parameter"
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
        required: ["id","initiativeId"]
      }
    },
    {
      name: "productboard_delete_initiative_link",
      description: "Delete a link between a feature and an initiative",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id parameter"
          },
          initiativeId: {
            type: "string",
            description: "initiativeId parameter"
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
        required: ["id","initiativeId"]
      }
    },
    {
      name: "productboard_list_links_to_objectives",
      description: "List objectives linked to a specific feature",
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
      name: "productboard_create_objective_link",
      description: "Create a new link between a feature and an objective",
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
      name: "productboard_delete_objective_link",
      description: "Delete a link between a feature and an objective",
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
      name: "productboard_create_component",
      description: "Create a component",
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
      name: "productboard_get_components",
      description: "List all components",
      inputSchema: {
        type: "object",
        properties: {
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
      name: "productboard_get_component",
      description: "Retrieve a component",
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
      name: "productboard_update_component",
      description: "Update a component",
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
      name: "productboard_update_component_deprecated",
      description: "Update a component",
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
      name: "productboard_get_products",
      description: "List all products",
      inputSchema: {
        type: "object",
        properties: {
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
      name: "productboard_get_product",
      description: "Retrieve a product",
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
      name: "productboard_update_product",
      description: "Update a product",
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
      name: "productboard_update_product_deprecated",
      description: "Update a product",
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
      name: "productboard_get_feature_statuses",
      description: "List all feature statuses",
      inputSchema: {
        type: "object",
        properties: {
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
    }
  ];
}

export async function handleProduct hierarchyTool(name: string, args: any) {
  switch (name) {
    case "productboard_create_feature":
      return await featureCreate(args);
    case "productboard_get_features":
      return await featuresGet(args);
    case "productboard_get_feature":
      return await featureGet(args);
    case "productboard_update_feature":
      return await featureUpdate(args);
    case "productboard_update_feature_deprecated":
      return await featureUpdateDeprecated(args);
    case "productboard_delete_feature":
      return await featureDelete(args);
    case "productboard_list_links_to_initiatives":
      return await linksListToinitiatives(args);
    case "productboard_create_initiative_link":
      return await initiativeCreateLink(args);
    case "productboard_delete_initiative_link":
      return await initiativeDeleteLink(args);
    case "productboard_list_links_to_objectives":
      return await linksListToobjectives(args);
    case "productboard_create_objective_link":
      return await objectiveCreateLink(args);
    case "productboard_delete_objective_link":
      return await objectiveDeleteLink(args);
    case "productboard_create_component":
      return await componentCreate(args);
    case "productboard_get_components":
      return await componentsGet(args);
    case "productboard_get_component":
      return await componentGet(args);
    case "productboard_update_component":
      return await componentUpdate(args);
    case "productboard_update_component_deprecated":
      return await componentUpdateDeprecated(args);
    case "productboard_get_products":
      return await productsGet(args);
    case "productboard_get_product":
      return await productGet(args);
    case "productboard_update_product":
      return await productUpdate(args);
    case "productboard_update_product_deprecated":
      return await productUpdateDeprecated(args);
    case "productboard_get_feature_statuses":
      return await featureGetStatuses(args);
    default:
      throw new Error(`Unknown product hierarchy tool: ${name}`);
  }
}

export async function featureCreate(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.post(`/features`, body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function featuresGet(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/features`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function featureGet(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/features/${args.id}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function featureUpdate(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.patch(`/features/${args.id}`, body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function featureUpdateDeprecated(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.put(`/features/${args.id}`, body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function featureDelete(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.delete(`/features/${args.id}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function linksListToinitiatives(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/features/${args.id}/links/initiatives`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function initiativeCreateLink(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.post(`/features/${args.id}/links/initiatives/${args.initiativeId}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function initiativeDeleteLink(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.delete(`/features/${args.id}/links/initiatives/${args.initiativeId}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function linksListToobjectives(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/features/${args.id}/links/objectives`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function objectiveCreateLink(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.post(`/features/${args.id}/links/objectives/${args.objectiveId}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function objectiveDeleteLink(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.delete(`/features/${args.id}/links/objectives/${args.objectiveId}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function componentCreate(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.post(`/components`, body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function componentsGet(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/components`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function componentGet(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/components/${args.id}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function componentUpdate(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.patch(`/components/${args.id}`, body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function componentUpdateDeprecated(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.put(`/components/${args.id}`, body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function productsGet(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/products`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function productGet(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/products/${args.id}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function productUpdate(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.patch(`/products/${args.id}`, body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function productUpdateDeprecated(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.put(`/products/${args.id}`, body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function featureGetStatuses(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/feature-statuses`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}