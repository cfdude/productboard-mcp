/**
 * Users management tools
 */
import { withContext, formatResponse } from "../utils/tool-wrapper.js";

export function setupUsersTools() {
  return [
    {
      name: "productboard_users_list",
      description: "List users in Productboard",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of users to return"
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
      name: "productboard_users_update",
      description: "Update user information",
      inputSchema: {
        type: "object",
        properties: {
          userEmail: {
            type: "string",
            description: "User email address"
          },
          name: {
            type: "string",
            description: "Updated user name"
          },
          companyName: {
            type: "string",
            description: "Updated company name"
          },
          externalId: {
            type: "string",
            description: "External ID for the user"
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
        required: ["userEmail"]
      }
    }
  ];
}

export async function handleUsersTool(name: string, args: any) {
  switch (name) {
    case "productboard_users_list":
      return await listUsers(args);
    case "productboard_users_update":
      return await updateUser(args);
    default:
      throw new Error(`Unknown users tool: ${name}`);
  }
}

async function listUsers(args: any) {
  return await withContext(async (context) => {
    const params: any = {};
    if (args.limit) params.pageLimit = Math.min(args.limit, 1000);

    const response = await context.axios.get("/users", { params });
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

async function updateUser(args: any) {
  return await withContext(async (context) => {
    const updateData: any = {};
    if (args.name) updateData.name = args.name;
    if (args.companyName) updateData.company = { name: args.companyName };
    if (args.externalId) updateData.externalId = args.externalId;

    const response = await context.axios.patch(`/users/${args.userEmail}`, updateData);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}