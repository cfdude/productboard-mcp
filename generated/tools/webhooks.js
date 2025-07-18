/**
 * Auto-generated webhook subscription management tools
 */
import { withContext, formatResponse } from "../../build/utils/tool-wrapper.js";

export function setupWebhooksTools() {
    return [
        {
            name: "post_webhook",
            description: "Create a new subscription",
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
            name: "get_webhooks",
            description: "List all subscriptions",
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
            name: "get_webhook",
            description: "Retrieve a subscription",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "Subscription ID"
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
            name: "delete_webhook",
            description: "Delete a subscription",
            inputSchema: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "Subscription ID"
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

export async function handleWebhooksTool(name, args) {
    switch (name) {
        case "post_webhook":
            return await postWebhook(args);
        case "get_webhooks":
            return await getWebhooks(args);
        case "get_webhook":
            return await getWebhook(args);
        case "delete_webhook":
            return await deleteWebhook(args);
        default:
            throw new Error(`Unknown webhooks tool: ${name}`);
    }
}

export async function postWebhook(args) {
    console.log('[DEBUG postWebhook] Called with args:', JSON.stringify(args, null, 2));
    
    return await withContext(async (context) => {
        console.log('[DEBUG postWebhook] Inside withContext');
        const body = typeof args.body === 'string' ? JSON.parse(args.body) : args.body;
        console.log('[DEBUG postWebhook] Parsed body:', JSON.stringify(body, null, 2));
        
        // Ensure proper structure for webhook API
        const webhookData = {
            events: body.events || (body.eventType ? [{eventType: body.eventType}] : []),
            name: body.name || "Webhook subscription",
            notification: body.notification || {
                version: 1,
                url: body.url || body.callback_url || "https://example.com/webhook"
            }
        };
        
        // Add optional headers if provided
        if (body.headers) {
            webhookData.notification.headers = body.headers;
        }
        
        console.log('[DEBUG postWebhook] Sending webhook data:', JSON.stringify({ data: webhookData }, null, 2));
        
        const response = await context.axios.post(`/webhooks`, { data: webhookData });
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function getWebhooks(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/webhooks`);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function getWebhook(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/webhooks/${args.id}`);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}

export async function deleteWebhook(args) {
    return await withContext(async (context) => {
        const response = await context.axios.delete(`/webhooks/${args.id}`);
        return {
            content: [{
                type: "text",
                text: formatResponse(response.data, args.includeRaw)
            }]
        };
    }, args.instance, args.workspaceId);
}