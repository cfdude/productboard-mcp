/**
 * Auto-generated plugin integrations management tools
 */
import { withContext, formatResponse } from "../../utils/tool-wrapper.js";

export function setupPluginIntegrationsTools() {
  return [
    {
      name: "productboard_post_plugin_integration",
      description: "Create a plugin integration",
      inputSchema: {
        type: "object",
        properties: {
          args.body: {
            type: "string",
            description: "args.body parameter"
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
        required: ["args.body"]
      }
    },
    {
      name: "productboard_get_plugin_integrations",
      description: "List all plugin integrations",
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
      name: "productboard_get_plugin_integration",
      description: "Retrieve a plugin integration",
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
      name: "productboard_patch_plugin_integration",
      description: "Update a plugin integration",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id parameter"
          },
          args.body: {
            type: "string",
            description: "args.body parameter"
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
        required: ["id","args.body"]
      }
    },
    {
      name: "productboard_put_plugin_integration",
      description: "Update a plugin integration",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "id parameter"
          },
          args.body: {
            type: "string",
            description: "args.body parameter"
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
        required: ["id","args.body"]
      }
    },
    {
      name: "productboard_delete_plugin_integration",
      description: "Delete a plugin integration",
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
      name: "productboard_get_plugin_integration_connections",
      description: "List all plugin integration connections",
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
      name: "productboard_get_plugin_integration_connection",
      description: "Retrieve a plugin integration connection",
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
      name: "productboard_put_plugin_integration_connection",
      description: "Set a plugin integration connection",
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
          args.body: {
            type: "string",
            description: "args.body parameter"
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
        },
        required: ["id","featureId","args.body"]
      }
    },
    {
      name: "productboard_delete_plugin_integration_connection",
      description: "Delete a plugin integration connection",
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

export async function handlePluginIntegrationsTool(name: string, args: any) {
  switch (name) {
    case "productboard_post_plugin_integration":
      return await pluginPostIntegration(args);
    case "productboard_get_plugin_integrations":
      return await pluginGetIntegrations(args);
    case "productboard_get_plugin_integration":
      return await pluginGetIntegration(args);
    case "productboard_patch_plugin_integration":
      return await pluginPatchIntegration(args);
    case "productboard_put_plugin_integration":
      return await pluginPutIntegration(args);
    case "productboard_delete_plugin_integration":
      return await pluginDeleteIntegration(args);
    case "productboard_get_plugin_integration_connections":
      return await pluginGetIntegrationconnections(args);
    case "productboard_get_plugin_integration_connection":
      return await pluginGetIntegrationconnection(args);
    case "productboard_put_plugin_integration_connection":
      return await pluginPutIntegrationconnection(args);
    case "productboard_delete_plugin_integration_connection":
      return await pluginDeleteIntegrationconnection(args);
    default:
      throw new Error(`Unknown plugin integrations tool: ${name}`);
  }
}

export async function pluginPostIntegration(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.post($2, args.args.body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function pluginGetIntegrations(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/plugin-integrations`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function pluginGetIntegration(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/plugin-integrations/${args.id}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function pluginPatchIntegration(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.patch($2, args.args.body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function pluginPutIntegration(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.put($2, args.args.body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function pluginDeleteIntegration(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.delete(`/plugin-integrations/${args.id}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function pluginGetIntegrationconnections(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/plugin-integrations/${args.id}/connections`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function pluginGetIntegrationconnection(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/plugin-integrations/${args.id}/connections/${args.featureId}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function pluginPutIntegrationconnection(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.put($2, args.args.body);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function pluginDeleteIntegrationconnection(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.delete(`/plugin-integrations/${args.id}/connections/${args.featureId}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}