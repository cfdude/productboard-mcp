/**
 * Main ProductboardServer class following non-singleton pattern from Jira MCP analysis
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { setupToolHandlers } from './tools/index.js';
import { setupDynamicToolHandlers } from './tools/index-dynamic.js';
import { setupDocumentation } from './documentation/documentation-provider.js';
import { existsSync } from 'fs';
import { join } from 'path';

export class ProductboardServer {
  private server: Server;
  private initialized = false;

  constructor() {
    this.server = new Server(
      {
        name: 'productboard-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    // Setup error handling
    this.server.onerror = error => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Initialize the server with tool handlers
   */
  async initialize() {
    if (this.initialized) return;

    // Setup tool handlers - use dynamic loading if manifest exists
    const manifestPath = join(process.cwd(), 'generated', 'manifest.json');
    if (existsSync(manifestPath)) {
      console.error('Using dynamic tool loading with manifest');
      await setupDynamicToolHandlers(this.server);
    } else {
      console.error('Using static tool loading (no manifest found)');
      setupToolHandlers(this.server);
    }

    // Setup documentation (prompts and resources)
    setupDocumentation(this.server);

    this.initialized = true;
  }

  /**
   * Start the server
   */
  async run() {
    // Initialize before connecting
    await this.initialize();

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Productboard MCP server running on stdio');
  }
}
