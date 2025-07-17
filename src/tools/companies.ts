/**
 * Companies management tools
 */
import { withContext, formatResponse } from "../utils/tool-wrapper.js";

export function setupCompaniesTools() {
  return [
    {
      name: "companies_list",
      title: "List Companies",
      description: "Retrieve a list of companies from Productboard. Returns condensed view by default for better performance - use condensed=false for full details",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of companies to return",
          },
          condensed: {
            type: "boolean",
            description: "Return condensed view with only essential fields (default: true)",
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
      name: "companies_get",
      title: "Get Company Details",
      description: "Retrieve detailed information about a specific company with configurable detail levels. Use 'basic' for quick overview, 'standard' for most use cases, 'full' for comprehensive data",
      inputSchema: {
        type: "object",
        properties: {
          companyId: {
            type: "string",
            description: "Company ID",
          },
          detail: {
            type: "string",
            enum: ["basic", "standard", "full"],
            description: "Level of detail to return (basic: id/name/domain, standard: +users count/subscription, full: all data)",
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
        required: ["companyId"],
      },
    },
  ];
}

export async function handleCompaniesTool(name: string, args: any) {
  switch (name) {
    case "companies_list":
      return await listCompanies(args);
    case "companies_get":
      return await getCompany(args);
    default:
      throw new Error(`Unknown companies tool: ${name}`);
  }
}

async function listCompanies(args: any) {
  return await withContext(
    async (context) => {
      const params: any = {};
      if (args.limit) params.pageLimit = Math.min(args.limit, 1000);

      const response = await context.axios.get("/companies", { params });

      // Apply condensed view by default
      const condensed = args.condensed !== false;
      
      if (condensed && response.data?.data && Array.isArray(response.data.data)) {
        const condensedData = {
          ...response.data,
          data: response.data.data.map((company: any) => ({
            id: company.id,
            name: company.name,
            domain: company.domain,
            created_at: company.created_at,
            ...(company.subscription && { subscription_tier: company.subscription.tier }),
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

async function getCompany(args: any) {
  return await withContext(
    async (context) => {
      const response = await context.axios.get(`/companies/${args.companyId}`);
      
      const detail = args.detail || "standard";
      
      if (detail !== "full" && response.data?.data) {
        const company = response.data.data;
        let filteredCompany: any;
        
        if (detail === "basic") {
          filteredCompany = {
            id: company.id,
            name: company.name,
            domain: company.domain,
            created_at: company.created_at,
          };
        } else if (detail === "standard") {
          filteredCompany = {
            id: company.id,
            name: company.name,
            domain: company.domain,
            created_at: company.created_at,
            updated_at: company.updated_at,
            ...(company.subscription && { subscription: company.subscription }),
            ...(company.users_count !== undefined && { users_count: company.users_count }),
            ...(company.notes_count !== undefined && { notes_count: company.notes_count }),
          };
        }
        
        const filteredResponse = {
          ...response.data,
          data: filteredCompany,
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
