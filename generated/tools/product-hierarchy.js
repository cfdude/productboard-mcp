/**
 * Auto-generated product hierarchy management tools
 */
import { withContext, formatResponse } from "../../build/utils/tool-wrapper.js";

export function setupProductHierarchyTools() {
  return [
    {
      name: "create_feature",
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
      name: "get_features",
      description: "List all features",
      inputSchema: {
        type: "object",
        properties: {
          null: {
            type: "string",
            description: "null parameter (optional)"
          },
          "status.id": {
            type: "string",
            description: "status.id parameter (optional)"
          },
          "status.name": {
            type: "string",
            description: "status.name parameter (optional)"
          },
          "parent.id": {
            type: "string",
            description: "parent.id parameter (optional)"
          },
          archived: {
            type: "string",
            description: "archived parameter (optional)"
          },
          "owner.email": {
            type: "string",
            description: "owner.email parameter (optional)"
          },
          "note.id": {
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
      name: "get_feature",
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
      name: "update_feature",
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
      name: "update_feature_deprecated",
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
      name: "delete_feature",
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
      name: "list_links_to_initiatives",
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
      name: "create_initiative_link",
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
      name: "delete_initiative_link",
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
      name: "list_links_to_objectives",
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
      name: "create_objective_link",
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
      name: "delete_objective_link",
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
      name: "create_component",
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
      name: "get_components",
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
      name: "get_component",
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
      name: "update_component",
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
      name: "update_component_deprecated",
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
      name: "get_products",
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
      name: "get_product",
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
      name: "update_product",
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
      name: "update_product_deprecated",
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
      name: "get_feature_statuses",
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

export async function handleProductHierarchyTool(name, args) {
  switch (name) {
    case "create_feature":
      return await featureCreate(args);
    case "get_features":
      return await featuresGet(args);
    case "get_feature":
      return await featureGet(args);
    case "update_feature":
      return await featureUpdate(args);
    case "update_feature_deprecated":
      return await featureUpdateDeprecated(args);
    case "delete_feature":
      return await featureDelete(args);
    case "list_links_to_initiatives":
      return await linksListToinitiatives(args);
    case "create_initiative_link":
      return await initiativeCreateLink(args);
    case "delete_initiative_link":
      return await initiativeDeleteLink(args);
    case "list_links_to_objectives":
      return await linksListToobjectives(args);
    case "create_objective_link":
      return await objectiveCreateLink(args);
    case "delete_objective_link":
      return await objectiveDeleteLink(args);
    case "create_component":
      return await componentCreate(args);
    case "get_components":
      return await componentsGet(args);
    case "get_component":
      return await componentGet(args);
    case "update_component":
      return await componentUpdate(args);
    case "update_component_deprecated":
      return await componentUpdateDeprecated(args);
    case "get_products":
      return await productsGet(args);
    case "get_product":
      return await productGet(args);
    case "update_product":
      return await productUpdate(args);
    case "update_product_deprecated":
      return await productUpdateDeprecated(args);
    case "get_feature_statuses":
      return await featureGetStatuses(args);
    default:
      throw new Error(`Unknown product hierarchy tool: ${name}`);
  }
}

export async function featureCreate(args) {
  return await withContext(async (context) => {

    const response = await context.axios.post(`/features`, args.body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function featuresGet(args) {
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

export async function featureGet(args) {
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

export async function featureUpdate(args) {
  return await withContext(async (context) => {

    const response = await context.axios.patch(`/features/${args.id}`, args.body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function featureUpdateDeprecated(args) {
  return await withContext(async (context) => {

    const response = await context.axios.put(`/features/${args.id}`, args.body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function featureDelete(args) {
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

export async function linksListToinitiatives(args) {
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

export async function initiativeCreateLink(args) {
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

export async function initiativeDeleteLink(args) {
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

export async function linksListToobjectives(args) {
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

export async function objectiveCreateLink(args) {
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

export async function objectiveDeleteLink(args) {
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

export async function componentCreate(args) {
  return await withContext(async (context) => {

    const response = await context.axios.post(`/components`, args.body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function componentsGet(args) {
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

export async function componentGet(args) {
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

export async function componentUpdate(args) {
  return await withContext(async (context) => {

    const response = await context.axios.patch(`/components/${args.id}`, args.body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function componentUpdateDeprecated(args) {
  return await withContext(async (context) => {

    const response = await context.axios.put(`/components/${args.id}`, args.body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function productsGet(args) {
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

export async function productGet(args) {
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

export async function productUpdate(args) {
  return await withContext(async (context) => {

    const response = await context.axios.patch(`/products/${args.id}`, args.body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function productUpdateDeprecated(args) {
  return await withContext(async (context) => {

    const response = await context.axios.put(`/products/${args.id}`, args.body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function featureGetStatuses(args) {
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