/**
 * Auto-generated objectives management tools
 */
import { withContext, formatResponse } from "../../utils/tool-wrapper.js";
export function setupObjectivesTools() {
    return [
        {
            name: "productboard_get_objectives",
            description: "List all objectives",
            inputSchema: {
                type: "object",
                properties: {
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
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
                }
            }
        },
        {
            name: "productboard_create_objective",
            description: "Create a new objective",
            inputSchema: {
                type: "object",
                properties: {
                    body: {
                        type: "string",
                        description: "body parameter"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
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
            name: "productboard_get_objective",
            description: "Get a specific objective",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "id parameter"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
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
            name: "productboard_update_objective",
            description: "Update an existing objective",
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
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
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
            name: "productboard_delete_objective",
            description: "Delete an objective",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "id parameter"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
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
            name: "productboard_list_links_objective_to_features",
            description: "List features linked to a specific objective",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "id parameter"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
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
            name: "productboard_list_links_objective_to_initiatives",
            description: "List initiatives linked to a specific objective",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "id parameter"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
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
            name: "productboard_create_objective_to_initiative_link",
            description: "Create a new link between an objective and an initiative",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "id parameter"
                    },
                    initiativeId: {
                        type: "string",
                        description: "initiativeId parameter"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
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
                required: ["id", "initiativeId"]
            }
        },
        {
            name: "productboard_delete_objective_to_initiative_link",
            description: "Delete a link between an objective and an initiative",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "id parameter"
                    },
                    initiativeId: {
                        type: "string",
                        description: "initiativeId parameter"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
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
                required: ["id", "initiativeId"]
            }
        },
        {
            name: "productboard_create_objective_to_feature_link",
            description: "Create a new link between an objective and a feature",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "id parameter"
                    },
                    featureId: {
                        type: "string",
                        description: "featureId parameter"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
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
                required: ["id", "featureId"]
            }
        },
        {
            name: "productboard_delete_objective_to_feature_link",
            description: "Delete a link between an objective and a feature",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "id parameter"
                    },
                    featureId: {
                        type: "string",
                        description: "featureId parameter"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
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
                required: ["id", "featureId"]
            }
        }
    ];
}
export async function handleObjectivesTool(name, args) {
    switch (name) {
        case "productboard_get_objectives":
            return await objectivesGet(args);
        case "productboard_create_objective":
            return await objectiveCreate(args);
        case "productboard_get_objective":
            return await objectiveGet(args);
        case "productboard_update_objective":
            return await objectiveUpdate(args);
        case "productboard_delete_objective":
            return await objectiveDelete(args);
        case "productboard_list_links_objective_to_features":
            return await linksListObjectivetofeatures(args);
        case "productboard_list_links_objective_to_initiatives":
            return await linksListObjectivetoinitiatives(args);
        case "productboard_create_objective_to_initiative_link":
            return await objectiveCreateToinitiativelink(args);
        case "productboard_delete_objective_to_initiative_link":
            return await objectiveDeleteToinitiativelink(args);
        case "productboard_create_objective_to_feature_link":
            return await objectiveCreateTofeaturelink(args);
        case "productboard_delete_objective_to_feature_link":
            return await objectiveDeleteTofeaturelink(args);
        default:
            throw new Error(`Unknown objectives tool: ${name}`);
    }
}
export async function objectivesGet(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/objectives`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function objectiveCreate(args) {
    return await withContext(async (context) => {
        const response = await context.axios.post(`/objectives`, body);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function objectiveGet(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/objectives/${args.id}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function objectiveUpdate(args) {
    return await withContext(async (context) => {
        const response = await context.axios.patch(`/objectives/${args.id}`, body);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function objectiveDelete(args) {
    return await withContext(async (context) => {
        const response = await context.axios.delete(`/objectives/${args.id}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function linksListObjectivetofeatures(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/objectives/${args.id}/links/features`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function linksListObjectivetoinitiatives(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/objectives/${args.id}/links/initiatives`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function objectiveCreateToinitiativelink(args) {
    return await withContext(async (context) => {
        const response = await context.axios.post(`/objectives/${args.id}/links/initiatives/${args.initiativeId}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function objectiveDeleteToinitiativelink(args) {
    return await withContext(async (context) => {
        const response = await context.axios.delete(`/objectives/${args.id}/links/initiatives/${args.initiativeId}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function objectiveCreateTofeaturelink(args) {
    return await withContext(async (context) => {
        const response = await context.axios.post(`/objectives/${args.id}/links/features/${args.featureId}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function objectiveDeleteTofeaturelink(args) {
    return await withContext(async (context) => {
        const response = await context.axios.delete(`/objectives/${args.id}/links/features/${args.featureId}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
