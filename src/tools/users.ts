/**
 * Users management tools
 */
import { withContext, formatResponse } from "../utils/tool-wrapper.js";

export function setupUsersTools() {
  return [
    {
      name: "users_list",
      title: "List Users",
      description:
        "Retrieve a list of users from Productboard. Returns condensed view by default for better performance - use condensed=false for full details",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of users to return",
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
      name: "users_get",
      title: "Get User Details",
      description:
        "Retrieve detailed information about a specific user with configurable detail levels. Use 'basic' for quick overview, 'standard' for most use cases, 'full' for comprehensive data",
      inputSchema: {
        type: "object",
        properties: {
          userId: {
            type: "string",
            description: "User ID or email address",
          },
          detail: {
            type: "string",
            enum: ["basic", "standard", "full"],
            description:
              "Level of detail to return (basic: id/name/email, standard: +company/role, full: all data)",
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
        required: ["userId"],
      },
    },
    {
      name: "users_update",
      title: "Update User",
      description: "Update user information in Productboard",
      inputSchema: {
        type: "object",
        properties: {
          userEmail: {
            type: "string",
            description: "User email address",
          },
          name: {
            type: "string",
            description: "Updated user name",
          },
          companyName: {
            type: "string",
            description: "Updated company name",
          },
          externalId: {
            type: "string",
            description: "External ID for the user",
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
        required: ["userEmail"],
      },
    },
  ];
}

export async function handleUsersTool(name: string, args: any) {
  switch (name) {
    case "users_list":
      return await listUsers(args);
    case "users_get":
      return await getUser(args);
    case "users_update":
      return await updateUser(args);
    default:
      throw new Error(`Unknown users tool: ${name}`);
  }
}

async function listUsers(args: any) {
  return await withContext(
    async (context) => {
      const params: any = {};
      if (args.limit) params.pageLimit = Math.min(args.limit, 1000);

      const response = await context.axios.get("/users", { params });

      // Apply condensed view by default
      const condensed = args.condensed !== false;

      if (
        condensed &&
        response.data?.data &&
        Array.isArray(response.data.data)
      ) {
        const condensedData = {
          ...response.data,
          data: response.data.data.map((user: any) => ({
            id: user.id,
            email: user.email,
            name: user.name,
            created_at: user.created_at,
            ...(user.company?.name && { company_name: user.company.name }),
            ...(user.role && { role: user.role }),
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

async function getUser(args: any) {
  return await withContext(
    async (context) => {
      const response = await context.axios.get(`/users/${args.userId}`);

      const detail = args.detail || "standard";

      if (detail !== "full" && response.data?.data) {
        const user = response.data.data;
        let filteredUser: any;

        if (detail === "basic") {
          filteredUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            created_at: user.created_at,
          };
        } else if (detail === "standard") {
          filteredUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            created_at: user.created_at,
            updated_at: user.updated_at,
            ...(user.company && { company: user.company }),
            ...(user.role && { role: user.role }),
            ...(user.external_id && { external_id: user.external_id }),
          };
        }

        const filteredResponse = {
          ...response.data,
          data: filteredUser,
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

async function updateUser(args: any) {
  return await withContext(
    async (context) => {
      const updateData: any = {};
      if (args.name) updateData.name = args.name;
      if (args.companyName) updateData.company = { name: args.companyName };
      if (args.externalId) updateData.externalId = args.externalId;

      const response = await context.axios.patch(
        `/users/${args.userEmail}`,
        updateData,
      );

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
