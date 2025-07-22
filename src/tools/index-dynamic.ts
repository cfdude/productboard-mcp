/**
 * Dynamic tool registration and setup with lazy loading
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { join } from 'path';
import { existsSync } from 'fs';
import { ToolRegistry } from './registry.js';
import { loadConfig } from '../config.js';

/**
 * Get enabled categories from configuration
 */
function getEnabledCategories(): string[] {
  const config = loadConfig();
  const toolConfig = config.toolCategories;

  if (!toolConfig) {
    // Default categories if no configuration - enable ALL categories
    return [];
  }

  // Handle profile-based configuration
  if (
    toolConfig.activeProfile &&
    toolConfig.profiles?.[toolConfig.activeProfile]
  ) {
    return toolConfig.profiles[toolConfig.activeProfile];
  }

  // Handle explicit enabled/disabled lists
  if (toolConfig.enabled) {
    // Check if wildcard is used
    if (toolConfig.enabled.includes('*')) {
      // Return empty array to signal "all categories"
      return [];
    }
    return toolConfig.enabled;
  }

  // If only disabled list provided, enable all except disabled
  if (toolConfig.disabled) {
    // This would require loading manifest to get all categories
    // For now, return default minus disabled
    const defaults = [
      'notes',
      'features',
      'companies',
      'users',
      'releases',
      'webhooks',
    ];
    return defaults.filter(cat => !toolConfig.disabled!.includes(cat));
  }

  // Default categories - enable ALL categories
  return [];
}

/**
 * Setup dynamic tool handlers for the server
 */
export async function setupDynamicToolHandlers(server: Server) {
  // Create tool registry
  const registry = new ToolRegistry(getEnabledCategories());

  // Load manifest
  const manifestPath = join(process.cwd(), 'generated', 'manifest.json');

  // Check if manifest exists, if not use static tools
  if (!existsSync(manifestPath)) {
    console.warn('Tool manifest not found, falling back to static tools');
    // Import and use the original static setup
    const module = await import('./index.js');
    module.setupToolHandlers(server);
    return;
  }

  // Load manifest and register tools
  try {
    registry.loadManifest(manifestPath);

    // Register tool loaders from manifest - AWAIT this!
    await registry.registerFromManifest();
    console.error('Successfully registered tools from manifest');

    // Register custom MCP tools (not from OpenAPI)
    const { setupSearchTools } = await import('./search.js');
    const searchTools = setupSearchTools();
    for (const tool of searchTools) {
      registry.registerCustomTool(tool.name, tool);
    }
    console.error('Successfully registered custom MCP tools');
  } catch (error) {
    console.error('Failed to load tool manifest:', error);
    // Fall back to static tools
    const module = await import('./index.js');
    module.setupToolHandlers(server);
    return;
  }

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: await registry.getToolDefinitions(),
  }));

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async request => {
    const { name, arguments: args } = request.params;

    try {
      return await registry.executeTool(name, args || {});
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }

      console.error(`Error in tool ${name}:`, error);

      // Check if this is an axios error with response data
      if ((error as any).response) {
        const status = (error as any).response.status;
        const data = (error as any).response.data;

        // Include full error details for AI agents to understand
        const errorDetails = {
          status,
          data,
          message: error instanceof Error ? error.message : String(error),
          tool: name,
          hint: 'Check the data field for API-specific error details',
        };

        // Construct a helpful error message
        let message = `API request failed with status ${status}`;
        if (data?.errors) {
          message += `: ${JSON.stringify(data.errors)}`;
        } else if (data?.message) {
          message += `: ${data.message}`;
        } else if (data) {
          message += `: ${JSON.stringify(data)}`;
        }

        throw new McpError(ErrorCode.InternalError, message, errorDetails);
      }

      // For non-axios errors, include as much detail as possible
      throw new McpError(
        ErrorCode.InternalError,
        `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`,
        {
          originalError:
            error instanceof Error ? error.toString() : String(error),
          tool: name,
        }
      );
    }
  });

  // Handle configuration updates (could be triggered by a special tool)
  server.onerror = error => {
    console.error('[MCP Error]', error);

    // Check if we need to reload configuration
    if (error.message?.includes('configuration')) {
      const newCategories = getEnabledCategories();
      registry.updateEnabledCategories(newCategories);
      // Categories updated successfully
    }
  };
}
