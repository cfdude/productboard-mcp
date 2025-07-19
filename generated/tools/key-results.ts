/**
 * Auto-generated key results management tools
 */
import { withContext, formatResponse } from "../../utils/tool-wrapper.js";

export function setupKeyResultsTools() {
  return [
    {
      name: "productboard_get_key_results",
      description: "List all key results",
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
      name: "productboard_create_key_result",
      description: "Create a key result",
      inputSchema: {
        type: "object",
        properties: {
          args.body: {
            type: "string",
            description: "args.body parameter"
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
      name: "productboard_get_key_result",
      description: "Retrieve a key result",
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
      name: "productboard_update_key_result",
      description: "Update a key result",
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
      name: "productboard_delete_key_result",
      description: "Delete a key result",
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
    }
  ];
}

export async function handleKeyResultsTool(name: string, args: any) {
  switch (name) {
    case "productboard_get_key_results":
      return await keyGetResults(args);
    case "productboard_create_key_result":
      return await keyCreateResult(args);
    case "productboard_get_key_result":
      return await keyGetResult(args);
    case "productboard_update_key_result":
      return await keyUpdateResult(args);
    case "productboard_delete_key_result":
      return await keyDeleteResult(args);
    default:
      throw new Error(`Unknown key results tool: ${name}`);
  }
}

export async function keyGetResults(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/key-results`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function keyCreateResult(args: any) {
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

export async function keyGetResult(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.get(`/key-results/${args.id}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

export async function keyUpdateResult(args: any) {
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

export async function keyDeleteResult(args: any) {
  return await withContext(async (context) => {

    const response = await context.axios.delete(`/key-results/${args.id}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}