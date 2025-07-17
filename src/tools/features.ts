/**
 * Features management tools
 */
import { withContext, formatResponse } from "../utils/tool-wrapper.js";

export function setupFeaturesTools() {
  return [
    {
      name: "features_list",
      title: "List Features",
      description:
        "Retrieve a list of features with condensed information by default",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of features to return (default: 50)",
          },
          condensed: {
            type: "boolean",
            description:
              "Return condensed view with only essential fields (default: true)",
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
      name: "features_get",
      title: "Get Feature Details",
      description: "Retrieve detailed information about a specific feature",
      inputSchema: {
        type: "object",
        properties: {
          featureId: {
            type: "string",
            description: "Feature ID",
          },
          detail: {
            type: "string",
            enum: ["basic", "standard", "full"],
            description:
              "Level of detail to return (basic: id/name/status, standard: includes description/owner, full: all data)",
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
    case "features_list":
      return await listFeatures(args);
    case "features_get":
      return await getFeature(args);
    default:
      throw new Error(`Unknown features tool: ${name}`);
  }
}

async function listFeatures(args: any) {
  return await withContext(
    async (context) => {
      const params: any = {};
      const limit = args.limit || 50;
      params.pageLimit = Math.min(limit, 1000);

      const response = await context.axios.get("/features", { params });

      // Default to condensed view unless explicitly disabled
      const condensed = args.condensed !== false;

      let processedData = response.data;

      if (
        condensed &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        // Return condensed view with only essential fields
        processedData = {
          ...response.data,
          data: response.data.data.map((feature: any) => ({
            id: feature.id,
            name: feature.name,
            type: feature.type,
            status: feature.status,
            archived: feature.archived,
            timeframe: feature.timeframe,
            owner: feature.owner,
            links: feature.links,
          })),
        };
      }

      return {
        content: [
          {
            type: "text",
            text: formatResponse(processedData, args.includeRaw),
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

      const detail = args.detail || "standard";
      let processedData = response.data;

      if (detail !== "full" && response.data.data) {
        const feature = response.data.data;

        if (detail === "basic") {
          // Basic: only id, name, status, type
          processedData = {
            ...response.data,
            data: {
              id: feature.id,
              name: feature.name,
              type: feature.type,
              status: feature.status,
              archived: feature.archived,
              links: feature.links,
            },
          };
        } else if (detail === "standard") {
          // Standard: includes description, owner, timeframe, but excludes verbose fields
          processedData = {
            ...response.data,
            data: {
              id: feature.id,
              name: feature.name,
              description: feature.description,
              type: feature.type,
              status: feature.status,
              archived: feature.archived,
              timeframe: feature.timeframe,
              owner: feature.owner,
              parent: feature.parent,
              createdAt: feature.createdAt,
              updatedAt: feature.updatedAt,
              links: feature.links,
            },
          };
        }
        // "full" returns complete response.data without modification
      }

      return {
        content: [
          {
            type: "text",
            text: formatResponse(processedData, args.includeRaw),
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
  );
}
