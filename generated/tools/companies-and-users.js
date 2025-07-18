/**
 * Auto-generated companies & users management tools
 */
import { withContext, formatResponse } from "../../build/utils/tool-wrapper.js";

export function setupCompaniesAndUsersTools() {
    return [
        {
            name: "create_company",
            description: "Create a company",
            inputSchema: {
                type: "object",
                properties: {
                    "Productboard-Partner-Id": {
                        type: "string",
                        description: "Productboard-Partner-Id parameter (optional)"
                    },
                    body: {
                        type: "string",
                        description: "Company data in JSON format"
                    },
                    instance: {
                        type: "string",
                        description: "Productboard instance URL (optional)"
                    },
                    workspaceId: {
                        type: "string",
                        description: "Workspace ID (optional)"
                    },
                    includeRaw: {
                        type: "boolean",
                        description: "Include raw API response. Default: false (condensed output). Set to true for full details."
                    }
                }
            }
        },
        {
            name: "get_companies",
            description: "List all companies with condensed information by default",
            inputSchema: {
                type: "object",
                properties: {
                    pageLimit: {
                        type: "number",
                        description: "Number of results per page (default: 25, max: 100)"
                    },
                    pageOffset: {
                        type: "number",
                        description: "Starting offset for pagination (default: 0)"
                    },
                    term: {
                        type: "string",
                        description: "Search term to filter companies by name"
                    },
                    hasNotes: {
                        type: "string",
                        description: "Filter by companies with notes (true/false)"
                    },
                    featureId: {
                        type: "string",
                        description: "Filter by companies linked to a specific feature ID"
                    },
                    condensed: {
                        type: "boolean",
                        description: "Return condensed view with only essential fields (default: true). Set to false for full company data."
                    },
                    instance: {
                        type: "string",
                        description: "Productboard instance URL (optional)"
                    },
                    workspaceId: {
                        type: "string",
                        description: "Workspace ID (optional)"
                    },
                    includeRaw: {
                        type: "boolean",
                        description: "Include raw API response format (default: false)"
                    }
                }
            }
        },
        {
            name: "get_company",
            description: "Retrieve a specific company",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "Company ID"
                    },
                    instance: {
                        type: "string",
                        description: "Productboard instance URL (optional)"
                    },
                    workspaceId: {
                        type: "string",
                        description: "Workspace ID (optional)"
                    },
                    includeRaw: {
                        type: "boolean",
                        description: "Include raw API response. Default: false (condensed output). Set to true for full details."
                    }
                },
                required: ["id"]
            }
        },
        {
            name: "update_company",
            description: "Update a company",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "Company ID"
                    },
                    body: {
                        type: "string",
                        description: "Updated company data in JSON format"
                    },
                    instance: {
                        type: "string",
                        description: "Productboard instance URL (optional)"
                    },
                    workspaceId: {
                        type: "string",
                        description: "Workspace ID (optional)"
                    },
                    includeRaw: {
                        type: "boolean",
                        description: "Include raw API response. Default: false (condensed output). Set to true for full details."
                    }
                },
                required: ["id", "body"]
            }
        },
        {
            name: "delete_company",
            description: "Delete a company",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "Company ID"
                    },
                    instance: {
                        type: "string",
                        description: "Productboard instance URL (optional)"
                    },
                    workspaceId: {
                        type: "string",
                        description: "Workspace ID (optional)"
                    },
                    includeRaw: {
                        type: "boolean",
                        description: "Include raw API response. Default: false (condensed output). Set to true for full details."
                    }
                },
                required: ["id"]
            }
        },
        {
            name: "get_users",
            description: "List all users",
            inputSchema: {
                type: "object",
                properties: {
                    instance: {
                        type: "string",
                        description: "Productboard instance URL (optional)"
                    },
                    workspaceId: {
                        type: "string",
                        description: "Workspace ID (optional)"
                    },
                    includeRaw: {
                        type: "boolean",
                        description: "Include raw API response. Default: false (condensed user list). Set to true for full user details including all metadata and relationships."
                    }
                }
            }
        },
        {
            name: "create_user",
            description: "Create a user",
            inputSchema: {
                type: "object",
                properties: {
                    body: {
                        type: "string",
                        description: "User data in JSON format"
                    },
                    instance: {
                        type: "string",
                        description: "Productboard instance URL (optional)"
                    },
                    workspaceId: {
                        type: "string",
                        description: "Workspace ID (optional)"
                    },
                    includeRaw: {
                        type: "boolean",
                        description: "Include raw API response. Default: false (condensed output). Set to true for full details."
                    }
                },
                required: ["body"]
            }
        },
        {
            name: "get_user",
            description: "Retrieve a user",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "User ID"
                    },
                    instance: {
                        type: "string",
                        description: "Productboard instance URL (optional)"
                    },
                    workspaceId: {
                        type: "string",
                        description: "Workspace ID (optional)"
                    },
                    includeRaw: {
                        type: "boolean",
                        description: "Include raw API response. Default: false (condensed output). Set to true for full details."
                    }
                },
                required: ["id"]
            }
        },
        {
            name: "update_user",
            description: "Update a user",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "User ID"
                    },
                    body: {
                        type: "string",
                        description: "Updated user data in JSON format"
                    },
                    instance: {
                        type: "string",
                        description: "Productboard instance URL (optional)"
                    },
                    workspaceId: {
                        type: "string",
                        description: "Workspace ID (optional)"
                    },
                    includeRaw: {
                        type: "boolean",
                        description: "Include raw API response. Default: false (condensed output). Set to true for full details."
                    }
                },
                required: ["id", "body"]
            }
        },
        {
            name: "delete_user",
            description: "Delete a user",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "User ID"
                    },
                    instance: {
                        type: "string",
                        description: "Productboard instance URL (optional)"
                    },
                    workspaceId: {
                        type: "string",
                        description: "Workspace ID (optional)"
                    },
                    includeRaw: {
                        type: "boolean",
                        description: "Include raw API response. Default: false (condensed output). Set to true for full details."
                    }
                },
                required: ["id"]
            }
        }
    ];
}

export async function handleCompaniesUsersTool(name, args) {
    switch (name) {
        case "create_company":
            return await createCompany(args);
        case "get_companies":
            return await getCompanies(args);
        case "get_company":
            return await getCompany(args);
        case "update_company":
            return await updateCompany(args);
        case "delete_company":
            return await deleteCompany(args);
        case "get_users":
            return await getUsers(args);
        case "create_user":
            return await createUser(args);
        case "get_user":
            return await getUser(args);
        case "update_user":
            return await updateUser(args);
        case "delete_user":
            return await deleteUser(args);
        default:
            throw new Error(`Unknown companies and users tool: ${name}`);
    }
}

export async function createCompany(args) {
    return await withContext(async (context) => {
        const response = await context.axios.post(`/companies`, args.body);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function getCompanies(args) {
    return await withContext(async (context) => {
        const params = new URLSearchParams();
        if (args.pageLimit) params.append('pageLimit', args.pageLimit);
        if (args.pageOffset) params.append('pageOffset', args.pageOffset);
        if (args.term) params.append('term', args.term);
        if (args.hasNotes) params.append('hasNotes', args.hasNotes);
        if (args.featureId) params.append('featureId', args.featureId);
        
        const response = await context.axios.get(`/companies?${params}`);
        
        // Default to condensed view unless explicitly disabled
        const condensed = args.condensed !== false;
        
        let processedData = response.data;
        
        if (condensed && response.data.data && Array.isArray(response.data.data)) {
            // Return condensed view with only essential fields
            processedData = {
                ...response.data,
                data: response.data.data.map((company) => ({
                    id: company.id,
                    name: company.name,
                    domain: company.domain,
                    industry: company.industry,
                    companySize: company.companySize,
                    notes: company.notes,
                    links: company.links
                }))
            };
        }
        
        return {
            content: [{
                type: "text",
                text: formatResponse(processedData, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function getCompany(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/companies/${args.id}`);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function updateCompany(args) {
    return await withContext(async (context) => {
        const response = await context.axios.patch(`/companies/${args.id}`, args.body);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function deleteCompany(args) {
    return await withContext(async (context) => {
        const response = await context.axios.delete(`/companies/${args.id}`);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function getUsers(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/users`);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function createUser(args) {
    return await withContext(async (context) => {
        const body = typeof args.body === 'string' ? JSON.parse(args.body) : args.body;
        const response = await context.axios.post(`/users`, { data: body });
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function getUser(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/users/${args.id}`);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function updateUser(args) {
    return await withContext(async (context) => {
        const body = typeof args.body === 'string' ? JSON.parse(args.body) : args.body;
        const response = await context.axios.patch(`/users/${args.id}`, { data: body });
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function deleteUser(args) {
    return await withContext(async (context) => {
        const response = await context.axios.delete(`/users/${args.id}`);
        return {
            content: [{
                type: "text",
                text: formatResponse({
                    success: true,
                    message: `User ${args.id} deleted successfully`
                }, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}