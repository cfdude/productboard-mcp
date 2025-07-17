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
                    args, : .body
                }
            }
        }, {
            type: "string",
            description: "args.body parameter"
        },
        null, {
            type: "string",
            description: "null parameter (optional)"
        },
        instance, {
            type: "string",
            description: "instance parameter (optional)"
        },
        workspaceId, {
            type: "string",
            description: "workspaceId parameter (optional)"
        },
        includeRaw, {
            type: "boolean",
            description: "includeRaw parameter (optional)"
        }
    ];
}
required: ["args.body"];
{
    name: "list_release_groups",
        description;
    "List all release groups",
        inputSchema;
    {
        type: "object",
            properties;
        {
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
    }
}
{
    name: "get_release_group",
        description;
    "Retrieve a release group",
        inputSchema;
    {
        type: "object",
            properties;
        {
            id: {
                type: "string",
                    description;
                "id parameter";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
        required: ["id"];
    }
}
{
    name: "update_release_group",
        description;
    "Update a release group",
        inputSchema;
    {
        type: "object",
            properties;
        {
            id: {
                type: "string",
                    description;
                "id parameter";
            }
            args.body;
            {
                type: "string",
                    description;
                "args.body parameter";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
        required: ["id", "args.body"];
    }
}
{
    name: "delete_release_group",
        description;
    "Delete a release group",
        inputSchema;
    {
        type: "object",
            properties;
        {
            id: {
                type: "string",
                    description;
                "id parameter";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
        required: ["id"];
    }
}
{
    name: "create_release",
        description;
    "Create a release",
        inputSchema;
    {
        type: "object",
            properties;
        {
            args.body;
            {
                type: "string",
                    description;
                "args.body parameter";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
        required: ["args.body"];
    }
}
{
    name: "list_releases",
        description;
    "List all releases",
        inputSchema;
    {
        type: "object",
            properties;
        {
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            "releaseGroup.id";
            {
                type: "string",
                    description;
                "releaseGroup.id parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
    }
}
{
    name: "get_release",
        description;
    "Retrieve a release",
        inputSchema;
    {
        type: "object",
            properties;
        {
            id: {
                type: "string",
                    description;
                "id parameter";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
        required: ["id"];
    }
}
{
    name: "update_release",
        description;
    "Update a release",
        inputSchema;
    {
        type: "object",
            properties;
        {
            id: {
                type: "string",
                    description;
                "id parameter";
            }
            args.body;
            {
                type: "string",
                    description;
                "args.body parameter";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
        required: ["id", "args.body"];
    }
}
{
    name: "delete_release",
        description;
    "Delete a release",
        inputSchema;
    {
        type: "object",
            properties;
        {
            id: {
                type: "string",
                    description;
                "id parameter";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
        required: ["id"];
    }
}
{
    name: "list_feature_release_assignments",
        description;
    "List all feature release assignments",
        inputSchema;
    {
        type: "object",
            properties;
        {
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            "feature.id";
            {
                type: "string",
                    description;
                "feature.id parameter (optional)";
            }
            "release.id";
            {
                type: "string",
                    description;
                "release.id parameter (optional)";
            }
            "release.state";
            {
                type: "string",
                    description;
                "release.state parameter (optional)";
            }
            "release.timeframe.endDate.from";
            {
                type: "string",
                    description;
                "release.timeframe.endDate.from parameter (optional)";
            }
            "release.timeframe.endDate.to";
            {
                type: "string",
                    description;
                "release.timeframe.endDate.to parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
    }
}
{
    name: "get_feature_release_assignment",
        description;
    "Retrieve a feature release assignment",
        inputSchema;
    {
        type: "object",
            properties;
        {
            "release.id";
            {
                type: "string",
                    description;
                "release.id parameter";
            }
            "feature.id";
            {
                type: "string",
                    description;
                "feature.id parameter";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
        required: ["release.id", "feature.id"];
    }
}
{
    name: "update_feature_release_assignment",
        description;
    "Update a feature release assignment",
        inputSchema;
    {
        type: "object",
            properties;
        {
            "release.id";
            {
                type: "string",
                    description;
                "release.id parameter";
            }
            "feature.id";
            {
                type: "string",
                    description;
                "feature.id parameter";
            }
            args.body;
            {
                type: "string",
                    description;
                "args.body parameter";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
        required: ["release.id", "feature.id", "args.body"];
    }
}
;
export async function handleReleasesAndReleaseGroupsTool(name, args) {
    switch (name) {
        case "create_release_group":
            return await releaseCreateGroup(args);
        case "list_release_groups":
            return await releaseListGroups(args);
        case "get_release_group":
            return await releaseGetGroup(args);
        case "update_release_group":
            return await releaseUpdateGroup(args);
        case "delete_release_group":
            return await releaseDeleteGroup(args);
        case "create_release":
            return await releaseCreate(args);
        case "list_releases":
            return await releasesList(args);
        case "get_release":
            return await releaseGet(args);
        case "update_release":
            return await releaseUpdate(args);
        case "delete_release":
            return await releaseDelete(args);
        case "list_feature_release_assignments":
            return await featureListReleaseassignments(args);
        case "get_feature_release_assignment":
            return await featureGetReleaseassignment(args);
        case "update_feature_release_assignment":
            return await featureUpdateReleaseassignment(args);
        default:
            throw new Error(`Unknown releases & release groups tool: ${name}`);
    }
}
export async function releaseCreateGroup(args) {
    return await withContext(async (context) => {
        const response = await context.axios.post($2, args.args.body);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function releaseListGroups(args) {
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
export async function releaseGetGroup(args) {
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
export async function releaseUpdateGroup(args) {
    return await withContext(async (context) => {
        const response = await context.axios.patch($2, args.args.body);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function releaseDeleteGroup(args) {
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
export async function releaseCreate(args) {
    return await withContext(async (context) => {
        const response = await context.axios.post($2, args.args.body);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function releasesList(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/releases`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function releaseGet(args) {
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
export async function releaseUpdate(args) {
    return await withContext(async (context) => {
        const response = await context.axios.patch($2, args.args.body);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function releaseDelete(args) {
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
export async function featureListReleaseassignments(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/feature-release-assignments`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function featureGetReleaseassignment(args) {
    return await withContext(async (context) => {
        const params = {};
        if (args.release.id)
            params.release.id = args.release.id;
        if (args.feature.id)
            params.feature.id = args.feature.id;
        const response = await context.axios.get(`/feature-release-assignments/assignment`, { params });
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function featureUpdateReleaseassignment(args) {
    return await withContext(async (context) => {
        const params = {};
        if (args.release.id)
            params.release.id = args.release.id;
        if (args.feature.id)
            params.feature.id = args.feature.id;
        const response = await context.axios.put(`/feature-release-assignments/assignment`, args.body, { params });
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
