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
import { setupCustomFieldsTools } from './custom-fields.js';
import { setupPluginIntegrationsTools } from './plugin-integrations.js';
import { setupJiraIntegrationsTools } from './jira-integrations.js';
import { setupDocumentationTools } from './documentation.js';
import { setupSearchTools } from './search.js';
import { ToolDefinition } from '../types/tool-types.js';
import { SearchParams } from '../types/search-types.js';

/**
 * Setup all tool handlers for the server
 */
export function setupToolHandlers(server: Server): void {
  // Tool definitions registry
  const tools: ToolDefinition[] = [];

  // Register tool categories
  tools.push(...setupSearchTools());
  tools.push(...setupNotesTools());
  tools.push(...setupFeaturesTools());
  tools.push(...setupCompaniesTools());
  tools.push(...setupUsersTools());
  tools.push(...setupReleasesTools());
  tools.push(...setupWebhooksTools());
  tools.push(...setupObjectivesTools());
  tools.push(...setupCustomFieldsTools());
  tools.push(...setupPluginIntegrationsTools());
  tools.push(...setupJiraIntegrationsTools());
  tools.push(...setupDocumentationTools());

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async request => {
    const { name, arguments: args } = request.params;

    try {
      // Route to appropriate handler based on tool name patterns
      if (name === 'search') {
        const { handleSearchTool } = await import('./search.js');

        // Debug logging
        console.error('[DEBUG] Original args:', JSON.stringify(args, null, 2));
        console.error('[DEBUG] Original output type:', typeof args?.output);
        console.error('[DEBUG] Original output value:', args?.output);

        // Parse any JSON-stringified parameters - more robust approach
        const parsedArgs = args ? { ...args } : {};

        // Handle output parameter that might come in as a stringified array
        if (parsedArgs.output && typeof parsedArgs.output === 'string') {
          console.error(
            '[DEBUG] Attempting to parse stringified output:',
            parsedArgs.output
          );
          // Try to parse as JSON if it looks like an array or object
          if (
            (parsedArgs.output.startsWith('[') &&
              parsedArgs.output.endsWith(']')) ||
            (parsedArgs.output.startsWith('{') &&
              parsedArgs.output.endsWith('}'))
          ) {
            try {
              const parsed = JSON.parse(parsedArgs.output);
              parsedArgs.output = parsed;
              console.error(
                '[DEBUG] Successfully parsed output to:',
                parsed,
                'type:',
                typeof parsed
              );
            } catch (e) {
              console.error(
                '[DEBUG] Failed to parse output, leaving as string:',
                (e as Error).message
              );
              // If parsing fails, leave as string (might be a preset like "ids-only")
            }
          } else {
            console.error(
              '[DEBUG] Output string does not look like JSON, leaving as-is'
            );
          }
        } else {
          console.error(
            '[DEBUG] Output is not a string, type:',
            typeof parsedArgs.output
          );
        }

        console.error('[DEBUG] Final parsed args output:', parsedArgs.output);
        return await handleSearchTool(
          name,
          parsedArgs as unknown as SearchParams
        );
      } else if (
        name.includes('note') ||
        name.includes('tag') ||
        name.includes('link')
      ) {
        const { handleNotesTool } = await import('./notes.js');
        return await handleNotesTool(name, args || {});
      } else if (
        name.includes('feature') ||
        name.includes('component') ||
        name.includes('product')
      ) {
        const { handleFeaturesTool } = await import('./features.js');
        return await handleFeaturesTool(name, args || {});
      } else if (
        name === 'get_custom_fields' ||
        name.startsWith('get_custom_field') ||
        name.startsWith('set_custom_field') ||
        name.startsWith('delete_custom_field') ||
        name === 'get_feature_statuses'
      ) {
        const { handleCustomFieldsTool } = await import('./custom-fields.js');
        return await handleCustomFieldsTool(name, args || {});
      } else if (name.includes('plugin_integration')) {
        const { handlePluginIntegrationsTool } = await import(
          './plugin-integrations.js'
        );
        return await handlePluginIntegrationsTool(name, args || {});
      } else if (name.includes('jira_integration')) {
        const { handleJiraIntegrationsTool } = await import(
          './jira-integrations.js'
        );
        return await handleJiraIntegrationsTool(name, args || {});
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
      } else if (name === 'get_docs') {
        const { handleDocumentationTool } = await import('./documentation.js');
        return await handleDocumentationTool(name, args || {});
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
