/**
 * Auto-generated releases & release groups management tools
 */
import { withContext, formatResponse } from "../../build/utils/tool-wrapper.js";

export function setupReleasesAndReleaseGroupsTools() {
    return [
        {
            name: "create_release_group",
            description: "Create a release group",
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
            name: "list_release_groups",
            description: "List all release groups",
            inputSchema: {
                type: "object",
                properties: {
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
            name: "get_release_group",
            description: "Retrieve a release group",
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
            name: "update_release_group",
            description: "Update a release group",
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
            name: "delete_release_group",
            description: "Delete a release group",
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
            name: "create_release",
            description: "Create a release",
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
            name: "list_releases",
            description: "List all releases",
            inputSchema: {
                type: "object",
                properties: {
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    "releaseGroup.id": {
                        type: "string",
                        description: "releaseGroup.id parameter (optional)"
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
            name: "get_release",
            description: "Retrieve a release",
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
            name: "update_release",
            description: "Update a release",
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
            name: "delete_release",
            description: "Delete a release",
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
            name: "list_feature_release_assignments",
            description: "List all feature release assignments",
            inputSchema: {
                type: "object",
                properties: {
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    "feature.id": {
                        type: "string",
                        description: "feature.id parameter (optional)"
                    },
                    "release.id": {
                        type: "string",
                        description: "release.id parameter (optional)"
                    },
                    "release.state": {
                        type: "string",
                        description: "release.state parameter (optional)"
                    },
                    "release.timeframe.endDate.from": {
                        type: "string",
                        description: "release.timeframe.endDate.from parameter (optional)"
                    },
                    "release.timeframe.endDate.to": {
                        type: "string",
                        description: "release.timeframe.endDate.to parameter (optional)"
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
            name: "get_feature_release_assignment",
            description: "Retrieve a feature release assignment",
            inputSchema: {
                type: "object",
                properties: {
                    "release.id": {
                        type: "string",
                        description: "release.id parameter"
                    },
                    "feature.id": {
                        type: "string",
                        description: "feature.id parameter"
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
                required: ["release.id", "feature.id"]
            }
        },
        {
            name: "update_feature_release_assignment",
            description: "Update a feature release assignment",
            inputSchema: {
                type: "object",
                properties: {
                    "release.id": {
                        type: "string",
                        description: "release.id parameter"
                    },
                    "feature.id": {
                        type: "string",
                        description: "feature.id parameter"
                    },
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
                required: ["release.id", "feature.id", "body"]
            }
        }
    ];
}

export async function handleReleasesReleaseGroupsTool(name, args) {
    switch (name) {
        case "create_release_group":
            return await createReleaseGroup(args);
        case "list_release_groups":
            return await listReleaseGroups(args);
        case "get_release_group":
            return await getReleaseGroup(args);
        case "update_release_group":
            return await updateReleaseGroup(args);
        case "delete_release_group":
            return await deleteReleaseGroup(args);
        case "create_release":
            return await createRelease(args);
        case "list_releases":
            return await listReleases(args);
        case "get_release":
            return await getRelease(args);
        case "update_release":
            return await updateRelease(args);
        case "delete_release":
            return await deleteRelease(args);
        case "list_feature_release_assignments":
            return await listFeatureReleaseAssignments(args);
        case "get_feature_release_assignment":
            return await getFeatureReleaseAssignment(args);
        case "update_feature_release_assignment":
            return await updateFeatureReleaseAssignment(args);
        default:
            throw new Error(`Unknown releases & release groups tool: ${name}`);
    }
}

export async function createReleaseGroup(args) {
    return await withContext(async (context) => {
        const body = typeof args.body === 'string' ? JSON.parse(args.body) : args.body;
        const response = await context.axios.post(`/release-groups`, { data: body });
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function listReleaseGroups(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/release-groups`);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function getReleaseGroup(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/release-groups/${args.id}`);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function updateReleaseGroup(args) {
    return await withContext(async (context) => {
        const body = typeof args.body === 'string' ? JSON.parse(args.body) : args.body;
        const response = await context.axios.patch(`/release-groups/${args.id}`, { data: body });
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function deleteReleaseGroup(args) {
    return await withContext(async (context) => {
        const response = await context.axios.delete(`/release-groups/${args.id}`);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function createRelease(args) {
    return await withContext(async (context) => {
        const body = typeof args.body === 'string' ? JSON.parse(args.body) : args.body;
        const response = await context.axios.post(`/releases`, { data: body });
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function listReleases(args) {
    return await withContext(async (context) => {
        const params = {};
        if (args["releaseGroup.id"]) params["releaseGroup.id"] = args["releaseGroup.id"];
        
        const response = await context.axios.get(`/releases`, { params });
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function getRelease(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/releases/${args.id}`);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function updateRelease(args) {
    return await withContext(async (context) => {
        const body = typeof args.body === 'string' ? JSON.parse(args.body) : args.body;
        const response = await context.axios.patch(`/releases/${args.id}`, { data: body });
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function deleteRelease(args) {
    return await withContext(async (context) => {
        const response = await context.axios.delete(`/releases/${args.id}`);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function listFeatureReleaseAssignments(args) {
    return await withContext(async (context) => {
        const params = {};
        if (args["feature.id"]) params["feature.id"] = args["feature.id"];
        if (args["release.id"]) params["release.id"] = args["release.id"];
        if (args["release.state"]) params["release.state"] = args["release.state"];
        if (args["release.timeframe.endDate.from"]) params["release.timeframe.endDate.from"] = args["release.timeframe.endDate.from"];
        if (args["release.timeframe.endDate.to"]) params["release.timeframe.endDate.to"] = args["release.timeframe.endDate.to"];
        
        const response = await context.axios.get(`/feature-release-assignments`, { params });
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function getFeatureReleaseAssignment(args) {
    return await withContext(async (context) => {
        const params = {};
        if (args["release.id"]) params["release.id"] = args["release.id"];
        if (args["feature.id"]) params["feature.id"] = args["feature.id"];
        
        const response = await context.axios.get(`/feature-release-assignments/assignment`, { params });
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function updateFeatureReleaseAssignment(args) {
    return await withContext(async (context) => {
        const params = {};
        if (args["release.id"]) params["release.id"] = args["release.id"];
        if (args["feature.id"]) params["feature.id"] = args["feature.id"];
        
        const body = typeof args.body === 'string' ? JSON.parse(args.body) : args.body;
        const response = await context.axios.put(`/feature-release-assignments/assignment`, { data: body }, { params });
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}