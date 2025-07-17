/**
 * Releases management tools
 */
import { withContext, formatResponse } from "../utils/tool-wrapper.js";

export function setupReleasesTools() {
  return [
    {
      name: "releases_list",
      title: "List Releases",
      description:
        "Retrieve a list of releases from Productboard. Returns condensed view by default for better performance - use condensed=false for full details",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of releases to return",
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
      name: "releases_get",
      title: "Get Release Details",
      description:
        "Retrieve detailed information about a specific release with configurable detail levels. Use 'basic' for quick overview, 'standard' for most use cases, 'full' for comprehensive data",
      inputSchema: {
        type: "object",
        properties: {
          releaseId: {
            type: "string",
            description: "Release ID",
          },
          detail: {
            type: "string",
            enum: ["basic", "standard", "full"],
            description:
              "Level of detail to return (basic: id/name/dates, standard: +features count/status, full: all data)",
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
        required: ["releaseId"],
      },
    },
  ];
}

export async function handleReleasesTool(name: string, args: any) {
  switch (name) {
    case "releases_list":
      return await listReleases(args);
    case "releases_get":
      return await getRelease(args);
    default:
      throw new Error(`Unknown releases tool: ${name}`);
  }
}

async function listReleases(args: any) {
  return await withContext(
    async (context) => {
      const params: any = {};
      if (args.limit) params.pageLimit = Math.min(args.limit, 1000);

      const response = await context.axios.get("/releases", { params });

      // Apply condensed view by default
      const condensed = args.condensed !== false;

      if (
        condensed &&
        response.data?.data &&
        Array.isArray(response.data.data)
      ) {
        const condensedData = {
          ...response.data,
          data: response.data.data.map((release: any) => ({
            id: release.id,
            name: release.name,
            state: release.state,
            release_date: release.release_date,
            created_at: release.created_at,
            ...(release.features_count !== undefined && {
              features_count: release.features_count,
            }),
          })),
        };

        return {
          content: [
            {
              type: "text",
              text: formatResponse(condensedData, args.includeRaw),
            },
          ],
        };
      }

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

async function getRelease(args: any) {
  return await withContext(
    async (context) => {
      const response = await context.axios.get(`/releases/${args.releaseId}`);

      const detail = args.detail || "standard";

      if (detail !== "full" && response.data?.data) {
        const release = response.data.data;
        let filteredRelease: any;

        if (detail === "basic") {
          filteredRelease = {
            id: release.id,
            name: release.name,
            state: release.state,
            release_date: release.release_date,
            created_at: release.created_at,
          };
        } else if (detail === "standard") {
          filteredRelease = {
            id: release.id,
            name: release.name,
            state: release.state,
            release_date: release.release_date,
            created_at: release.created_at,
            updated_at: release.updated_at,
            description: release.description
              ? release.description.substring(0, 200) +
                (release.description.length > 200 ? "..." : "")
              : null,
            ...(release.features_count !== undefined && {
              features_count: release.features_count,
            }),
            ...(release.owner && { owner: release.owner }),
          };
        }

        const filteredResponse = {
          ...response.data,
          data: filteredRelease,
        };

        return {
          content: [
            {
              type: "text",
              text: formatResponse(filteredResponse, args.includeRaw),
            },
          ],
        };
      }

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
