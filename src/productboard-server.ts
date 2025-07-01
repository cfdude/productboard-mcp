/**
 * Main ProductboardServer class following non-singleton pattern from Jira MCP analysis
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListResourcesRequestSchema, ListPromptsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { setupToolHandlers } from "./tools/index.js";

export class ProductboardServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "productboard-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    // Setup tool handlers (following Jira MCP pattern)
    setupToolHandlers(this.server);

    // Setup resources handlers
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [], // Return empty resources list for now
    }));

    // Setup prompts handlers
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
      prompts: [], // Return empty prompts list for now
    }));

    // Setup error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Start the server
   */
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Productboard MCP server running on stdio");
  }
}