/**
 * Dynamic tool registration and setup with lazy loading
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { join } from "path";
import { existsSync } from "fs";
import { ToolRegistry } from "./registry.js";
import { loadConfig } from "../config.js";

/**
 * Get enabled categories from configuration
 */
function getEnabledCategories(): string[] {
  const config = loadConfig();
  const toolConfig = config.toolCategories;
  
  if (!toolConfig) {
    // Default categories if no configuration
    return ["notes", "features", "companies", "users", "releases", "webhooks"];
  }

  // Handle profile-based configuration
  if (toolConfig.activeProfile && toolConfig.profiles?.[toolConfig.activeProfile]) {
    return toolConfig.profiles[toolConfig.activeProfile];
  }

  // Handle explicit enabled/disabled lists
  if (toolConfig.enabled) {
    return toolConfig.enabled;
  }

  // If only disabled list provided, enable all except disabled
  if (toolConfig.disabled) {
    // This would require loading manifest to get all categories
    // For now, return default minus disabled
    const defaults = ["notes", "features", "companies", "users", "releases", "webhooks"];
    return defaults.filter(cat => !toolConfig.disabled!.includes(cat));
  }

  // Default categories
  return ["notes", "features", "companies", "users", "releases", "webhooks"];
}

/**
 * Setup dynamic tool handlers for the server
 */
export function setupDynamicToolHandlers(server: Server) {
  // Create tool registry
  const registry = new ToolRegistry(getEnabledCategories());
  
  // Load manifest
  const manifestPath = join(process.cwd(), "generated", "manifest.json");
  
  // Check if manifest exists, if not use static tools
  if (!existsSync(manifestPath)) {
    console.warn("Tool manifest not found, falling back to static tools");
    // Import and use the original static setup
    import("./index.js").then(module => {
      module.setupToolHandlers(server);
    });
    return;
  }

  // Load manifest and register tools
  try {
    registry.loadManifest(manifestPath);
    
    // Register tool loaders from manifest
    registry.registerFromManifest().then(() => {
      console.log(`Loaded ${registry.getToolDefinitions().length} tools from manifest`);
    }).catch(error => {
      console.error("Failed to register tools from manifest:", error);
    });
  } catch (error) {
    console.error("Failed to load tool manifest:", error);
    // Fall back to static tools
    import("./index.js").then(module => {
      module.setupToolHandlers(server);
    });
    return;
  }

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: registry.getToolDefinitions(),
  }));

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      return await registry.executeTool(name, args || {});
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

  // Handle configuration updates (could be triggered by a special tool)
  server.onerror = (error) => {
    console.error("[MCP Error]", error);
    
    // Check if we need to reload configuration
    if (error.message?.includes("configuration")) {
      const newCategories = getEnabledCategories();
      registry.updateEnabledCategories(newCategories);
      console.log("Updated enabled categories:", newCategories);
    }
  };
}