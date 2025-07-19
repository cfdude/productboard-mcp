/**
 * Auto-generated jira integrations management tools
 */
import { withContext, formatResponse } from "../../build/utils/tool-wrapper.js";
export function setupJiraIntegrationsTools() {
    return [
        {
            name: "get_jira_integration",
            description: "Retrieve a Jira integration",
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
            name: "get_jira_integrations",
            description: "List all Jira integrations",
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
            name: "get_jira_integration_connection",
            description: "Retrieve a Jira integration connection",
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
            name: "get_jira_integration_connections",
            description: "List all Jira integration connections",
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
                    "connection.issueKey": {
                        type: "string",
                        description: "connection.issueKey parameter (optional)"
                    },
                    "connection.issueId": {
                        type: "string",
                        description: "connection.issueId parameter (optional)"
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
export async function handleJiraIntegrationsTool(name, args) {
    switch (name) {
        case "get_jira_integration":
            return await jiraGetIntegration(args);
        case "get_jira_integrations":
            return await jiraGetIntegrations(args);
        case "get_jira_integration_connection":
            return await jiraGetIntegrationconnection(args);
        case "get_jira_integration_connections":
            return await jiraGetIntegrationconnections(args);
        default:
            throw new Error(`Unknown jira integrations tool: ${name}`);
    }
}
export async function jiraGetIntegration(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/jira-integrations/${args.id}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function jiraGetIntegrations(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/jira-integrations`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function jiraGetIntegrationconnection(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/jira-integrations/${args.id}/connections/${args.featureId}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function jiraGetIntegrationconnections(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/jira-integrations/${args.id}/connections`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
