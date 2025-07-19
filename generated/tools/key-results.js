/**
 * Auto-generated key results management tools
 */
import { withContext, formatResponse } from "../../build/utils/tool-wrapper.js";

export function setupKeyResultsTools() {
    return [
        {
            name: "get_key_results",
            description: "List all key results",
            inputSchema: {
                type: "object",
                properties: {
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
            name: "create_key_result",
            description: "Create a key result",
            inputSchema: {
                type: "object",
                properties: {
                    body: {
                        type: "string",
                        description: "body parameter"
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
                required: ["body"]
            }
        },
        {
            name: "get_key_result",
            description: "Retrieve a key result",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "id parameter"
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
            name: "update_key_result",
            description: "Update a key result",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "id parameter"
                    },
                    body: {
                        type: "string",
                        description: "body parameter"
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
                required: ["id", "body"]
            }
        },
        {
            name: "delete_key_result",
            description: "Delete a key result",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "id parameter"
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

export async function handleKeyResultsTool(name, args) {
    switch (name) {
        case "get_key_results":
            return await keyGetResults(args);
        case "create_key_result":
            return await keyCreateResult(args);
        case "get_key_result":
            return await keyGetResult(args);
        case "update_key_result":
            return await keyUpdateResult(args);
        case "delete_key_result":
            return await keyDeleteResult(args);
        default:
            throw new Error(`Unknown key results tool: ${name}`);
    }
}

export async function keyGetResults(args) {
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

export async function keyCreateResult(args) {
    return await withContext(async (context) => {
        const body = typeof args.body === 'string' ? JSON.parse(args.body) : args.body;
        const response = await context.axios.post(`/key-results`, { data: body });
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function keyGetResult(args) {
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

export async function keyUpdateResult(args) {
    return await withContext(async (context) => {
        const body = typeof args.body === 'string' ? JSON.parse(args.body) : args.body;
        const response = await context.axios.patch(`/key-results/${args.id}`, { data: body });
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function keyDeleteResult(args) {
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