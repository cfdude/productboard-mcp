/**
 * Releases management tools
 */
import { withContext, formatResponse } from "../utils/tool-wrapper.js";

export function setupReleasesTools() {
  return [
    {
      name: "productboard_releases_list",
      description: "List releases in Productboard",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of releases to return"
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
      name: "productboard_releases_get",
      description: "Get a specific release by ID",
      inputSchema: {
        type: "object",
        properties: {
          releaseId: {
            type: "string",
            description: "Release ID"
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
        required: ["releaseId"]
      }
    }
  ];
}

export async function handleReleasesTool(name: string, args: any) {
  switch (name) {
    case "productboard_releases_list":
      return await listReleases(args);
    case "productboard_releases_get":
      return await getRelease(args);
    default:
      throw new Error(`Unknown releases tool: ${name}`);
  }
}

async function listReleases(args: any) {
  return await withContext(async (context) => {
    const params: any = {};
    if (args.limit) params.pageLimit = Math.min(args.limit, 1000);

    const response = await context.axios.get("/releases", { params });
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

async function getRelease(args: any) {
  return await withContext(async (context) => {
    const response = await context.axios.get(`/releases/${args.releaseId}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}