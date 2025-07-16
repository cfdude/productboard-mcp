/**
 * Features management tools
 */
import { withContext, formatResponse } from "../utils/tool-wrapper.js";

export function setupFeaturesTools() {
  return [
    {
      name: "productboard_features_list",
      description: "List features in Productboard",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of features to return",
          },
          instance: {
            type: "string",
            description: "Productboard instance name (optional)",
          },
          workspaceId: {
            type: "string",
            description: "Workspace ID (optional)",
          },
          includeRaw: {
            type: "boolean",
            description: "Include raw API response",
          },
        },
      },
    },
    {
      name: "productboard_features_get",
      description: "Get a specific feature by ID",
      inputSchema: {
        type: "object",
        properties: {
          featureId: {
            type: "string",
            description: "Feature ID",
          },
          instance: {
            type: "string",
            description: "Productboard instance name (optional)",
          },
          workspaceId: {
            type: "string",
            description: "Workspace ID (optional)",
          },
          includeRaw: {
            type: "boolean",
            description: "Include raw API response",
          },
        },
        required: ["featureId"],
      },
    },
  ];
}

export async function handleFeaturesTool(name: string, args: any) {
  switch (name) {
    case "productboard_features_list":
      return await listFeatures(args);
    case "productboard_features_get":
      return await getFeature(args);
    default:
      throw new Error(`Unknown features tool: ${name}`);
  }
}

async function listFeatures(args: any) {
  return await withContext(
    async (context) => {
      const params: any = {};
      if (args.limit) params.pageLimit = Math.min(args.limit, 1000);

      const response = await context.axios.get("/features", { params });

      return {
        content: [
          {
            type: "text",
            text: formatResponse(response.data, args.includeRaw),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
  );
}

async function getFeature(args: any) {
  return await withContext(
    async (context) => {
      const response = await context.axios.get(`/features/${args.featureId}`);

      return {
        content: [
          {
            type: "text",
            text: formatResponse(response.data, args.includeRaw),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
  );
}
