/**
 * Webhooks management tools
 */
import { withContext, formatResponse } from "../utils/tool-wrapper.js";

export function setupWebhooksTools() {
  return [
    {
      name: "webhooks_list",
      title: "List Webhooks",
      description: "Retrieve a list of webhook subscriptions",
      inputSchema: {
        type: "object",
        properties: {
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
      name: "webhooks_create",
      title: "Create Webhook",
      description: "Create a new webhook subscription",
      inputSchema: {
        type: "object",
        properties: {
          eventType: {
            type: "string",
            description: "Event type to subscribe to",
          },
          url: {
            type: "string",
            description: "Webhook URL",
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
        required: ["eventType", "url"],
      },
    },
    {
      name: "webhooks_delete",
      title: "Delete Webhook",
      description: "Delete a webhook subscription",
      inputSchema: {
        type: "object",
        properties: {
          webhookId: {
            type: "string",
            description: "Webhook ID",
          },
          instance: {
            type: "string",
            description: "Productboard instance name (optional)",
          },
          workspaceId: {
            type: "string",
            description: "Workspace ID (optional)",
          },
        },
        required: ["webhookId"],
      },
    },
  ];
}

export async function handleWebhooksTool(name: string, args: any) {
  switch (name) {
    case "webhooks_list":
      return await listWebhooks(args);
    case "webhooks_create":
      return await createWebhook(args);
    case "webhooks_delete":
      return await deleteWebhook(args);
    default:
      throw new Error(`Unknown webhooks tool: ${name}`);
  }
}

async function listWebhooks(args: any) {
  return await withContext(
    async (context) => {
      const response = await context.axios.get("/webhooks");

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

async function createWebhook(args: any) {
  return await withContext(
    async (context) => {
      const webhookData = {
        eventType: args.eventType,
        url: args.url,
      };

      const response = await context.axios.post("/webhooks", webhookData);

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

async function deleteWebhook(args: any) {
  return await withContext(
    async (context) => {
      await context.axios.delete(`/webhooks/${args.webhookId}`);

      return {
        content: [
          {
            type: "text",
            text: `Webhook ${args.webhookId} deleted successfully`,
          },
        ],
      };
    },
    args.instance,
    args.workspaceId,
  );
}
