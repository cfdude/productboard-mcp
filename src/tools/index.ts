/**
 * Tool registration and setup
 * Implements 3-tier architecture: workflows → resource operations → power user tools
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Import tool handlers
import { setupNotesTools } from './notes.js';
import { setupFeaturesTools } from './features.js';
import { setupCompaniesTools } from './companies.js';
import { setupUsersTools } from './users.js';
import { setupReleasesTools } from './releases.js';
import { setupWebhooksTools } from './webhooks.js';
import { setupObjectivesTools } from './objectives.js';
import { ToolDefinition } from '../types/tool-types.js';

/**
 * Setup all tool handlers for the server
 */
export function setupToolHandlers(server: Server): void {
  // Tool definitions registry
  const tools: ToolDefinition[] = [];

  // Register tool categories
  tools.push(...setupNotesTools());
  tools.push(...setupFeaturesTools());
  tools.push(...setupCompaniesTools());
  tools.push(...setupUsersTools());
  tools.push(...setupReleasesTools());
  tools.push(...setupWebhooksTools());
  tools.push(...setupObjectivesTools());

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async request => {
    const { name, arguments: args } = request.params;

    try {
      // Route to appropriate handler based on tool name patterns
      if (
        name.includes('note') ||
        name.includes('tag') ||
        name.includes('link')
      ) {
        const { handleNotesTool } = await import('./notes.js');
        return await handleNotesTool(name, args || {});
      } else if (
        name.includes('feature') ||
        name.includes('component') ||
        name.includes('product') ||
        name.includes('status') ||
        name.includes('custom_field')
      ) {
        const { handleFeaturesTool } = await import('./features.js');
        return await handleFeaturesTool(name, args || {});
      } else if (name.includes('company')) {
        const { handleCompaniesTool } = await import('./companies.js');
        return await handleCompaniesTool(name, args || {});
      } else if (name.includes('user')) {
        const { handleUsersTool } = await import('./users.js');
        return await handleUsersTool(name, args || {});
      } else if (name.includes('release')) {
        const { handleReleasesTool } = await import('./releases.js');
        return await handleReleasesTool(name, args || {});
      } else if (name.includes('webhook')) {
        const { handleWebhooksTool } = await import('./webhooks.js');
        return await handleWebhooksTool(name, args || {});
      } else if (
        name.includes('objective') ||
        name.includes('initiative') ||
        name.includes('key_result')
      ) {
        const { handleObjectivesTool } = await import('./objectives.js');
        return await handleObjectivesTool(name, args || {});
      } else {
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }

      console.error(`Error in tool ${name}:`, error);
      throw new McpError(
        ErrorCode.InternalError,
        `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  });
}
