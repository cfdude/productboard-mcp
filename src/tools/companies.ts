/**
 * Companies management tools
 */
import { withContext, formatResponse } from "../utils/tool-wrapper.js";

export function setupCompaniesTools() {
  return [
    {
      name: "productboard_companies_list",
      description: "List companies in Productboard",
      inputSchema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Maximum number of companies to return"
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
      name: "productboard_companies_get",
      description: "Get a specific company by ID",
      inputSchema: {
        type: "object",
        properties: {
          companyId: {
            type: "string",
            description: "Company ID"
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
        required: ["companyId"]
      }
    }
  ];
}

export async function handleCompaniesTool(name: string, args: any) {
  switch (name) {
    case "productboard_companies_list":
      return await listCompanies(args);
    case "productboard_companies_get":
      return await getCompany(args);
    default:
      throw new Error(`Unknown companies tool: ${name}`);
  }
}

async function listCompanies(args: any) {
  return await withContext(async (context) => {
    const params: any = {};
    if (args.limit) params.pageLimit = Math.min(args.limit, 1000);

    const response = await context.axios.get("/companies", { params });
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}

async function getCompany(args: any) {
  return await withContext(async (context) => {
    const response = await context.axios.get(`/companies/${args.companyId}`);
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}