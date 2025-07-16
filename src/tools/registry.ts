/**
 * Dynamic tool registry with lazy loading support
 */
import { readFileSync } from "fs";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";

// Tool handler type
export type ToolHandler = (args: any) => Promise<any>;

// Tool loader function type
export type ToolLoader = () => Promise<ToolHandler>;

// Tool manifest types
export interface ToolManifest {
  version: string;
  generated: string;
  categories: Record<string, CategoryInfo>;
  tools: Record<string, ToolInfo>;
}

export interface CategoryInfo {
  displayName: string;
  description: string;
  tools: string[];
}

export interface ToolInfo {
  category: string;
  operation: string;
  description: string;
  requiredParams: string[];
  optionalParams: string[];
  implementation: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

/**
 * Dynamic tool registry that supports lazy loading
 */
export class ToolRegistry {
  private manifest: ToolManifest | null = null;
  private toolLoaders = new Map<string, ToolLoader>();
  private loadedHandlers = new Map<string, ToolHandler>();
  private enabledCategories: Set<string>;
  private maxLoadedHandlers = 100; // Maximum number of handlers to keep in memory
  private handlerAccessCount = new Map<string, number>();
  private lastAccessTime = new Map<string, number>();

  constructor(enabledCategories: string[] = []) {
    this.enabledCategories = new Set(enabledCategories);
  }

  /**
   * Load tool manifest
   */
  loadManifest(manifestPath: string): void {
    try {
      const content = readFileSync(manifestPath, "utf-8");
      this.manifest = JSON.parse(content);
    } catch (error) {
      console.error("Failed to load tool manifest:", error);
      throw new McpError(
        ErrorCode.InternalError,
        "Failed to load tool manifest",
      );
    }
  }

  /**
   * Register a tool loader function
   */
  registerLoader(toolName: string, loader: ToolLoader): void {
    this.toolLoaders.set(toolName, loader);
  }

  /**
   * Register tool loaders from manifest
   */
  async registerFromManifest(): Promise<void> {
    if (!this.manifest) {
      throw new Error("Manifest not loaded");
    }

    for (const [toolName, toolInfo] of Object.entries(this.manifest.tools)) {
      // Skip if category is not enabled
      if (
        this.enabledCategories.size > 0 &&
        !this.enabledCategories.has(toolInfo.category)
      ) {
        continue;
      }

      // Register lazy loader
      this.registerLoader(toolName, async () => {
        try {
          // Check if it's an existing tool in src/tools
          const existingCategories = [
            "notes",
            "features",
            "companies",
            "users",
            "releases",
            "webhooks",
          ];
          if (existingCategories.includes(toolInfo.category)) {
            // Import from existing tools
            const module = await import(`./${toolInfo.category}.js`);

            // Get the handler function name
            const handlerName = `handle${toolInfo.category.charAt(0).toUpperCase() + toolInfo.category.slice(1)}Tool`;
            const handler = module[handlerName];

            if (!handler) {
              throw new Error(
                `Handler ${handlerName} not found in ${toolInfo.category}.js`,
              );
            }

            // Return a wrapper that calls the handler
            return async (args: any) => handler(toolName, args);
          } else {
            // Import from generated tools
            const categoryFile = toolInfo.category
              .replace(/\s/g, "")
              .toLowerCase();
            const module = await import(
              `../../generated/tools/${categoryFile}.js`
            );

            // Get the handler function name
            const handlerName = `handle${toolInfo.category
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join("")}Tool`;
            const handler = module[handlerName];

            if (!handler) {
              throw new Error(
                `Handler ${handlerName} not found in generated/${categoryFile}.js`,
              );
            }

            // Return a wrapper that calls the handler
            return async (args: any) => handler(toolName, args);
          }
        } catch (error) {
          console.error(`Failed to load handler for ${toolName}:`, error);
          throw error;
        }
      });
    }
  }

  /**
   * Get tool definitions for enabled categories
   */
  getToolDefinitions(): ToolDefinition[] {
    if (!this.manifest) return [];

    const definitions: ToolDefinition[] = [];

    for (const [toolName, toolInfo] of Object.entries(this.manifest.tools)) {
      // Skip if category is not enabled
      if (
        this.enabledCategories.size > 0 &&
        !this.enabledCategories.has(toolInfo.category)
      ) {
        continue;
      }

      // Skip if no loader registered
      if (!this.toolLoaders.has(toolName)) {
        continue;
      }

      // Build input schema from manifest
      const properties: Record<string, any> = {};

      // Add required parameters
      toolInfo.requiredParams.forEach((param) => {
        properties[param] = {
          type: "string",
          description: `${param} parameter`,
        };
      });

      // Add optional parameters
      toolInfo.optionalParams.forEach((param) => {
        properties[param] = {
          type: param === "includeRaw" ? "boolean" : "string",
          description: `${param} parameter (optional)`,
        };
      });

      const toolDef: any = {
        name: toolName,
        description: toolInfo.description,
        inputSchema: {
          type: "object",
          properties,
        },
      };

      if (toolInfo.requiredParams.length > 0) {
        toolDef.inputSchema.required = toolInfo.requiredParams;
      }

      definitions.push(toolDef);
    }

    return definitions;
  }

  /**
   * Execute a tool by name
   */
  async executeTool(toolName: string, args: any): Promise<any> {
    // Check if handler is already loaded
    let handler = this.loadedHandlers.get(toolName);

    if (!handler) {
      // Get loader
      const loader = this.toolLoaders.get(toolName);
      if (!loader) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${toolName}`,
        );
      }

      // Load handler
      try {
        handler = await loader();
        this.loadedHandlers.set(toolName, handler);
        
        // Check memory usage and cleanup if needed
        if (this.loadedHandlers.size > this.maxLoadedHandlers) {
          this.cleanupLeastUsedHandlers();
        }
      } catch (error) {
        console.error(`Failed to load tool ${toolName}:`, error);
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to load tool: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // Track access for memory management
    this.handlerAccessCount.set(
      toolName,
      (this.handlerAccessCount.get(toolName) || 0) + 1
    );
    this.lastAccessTime.set(toolName, Date.now());

    // Execute handler
    return await handler(args);
  }

  /**
   * Update enabled categories at runtime
   */
  updateEnabledCategories(categories: string[]): void {
    this.enabledCategories = new Set(categories);

    // Clear loaded handlers for disabled categories
    if (this.manifest) {
      for (const [toolName] of this.loadedHandlers.entries()) {
        const toolInfo = this.manifest.tools[toolName];
        if (toolInfo && !this.enabledCategories.has(toolInfo.category)) {
          this.loadedHandlers.delete(toolName);
        }
      }
    }
  }

  /**
   * Get available categories
   */
  getCategories(): CategoryInfo[] {
    if (!this.manifest) return [];
    return Object.values(this.manifest.categories);
  }

  /**
   * Get tools for a specific category
   */
  getToolsForCategory(category: string): string[] {
    if (!this.manifest) return [];
    return this.manifest.categories[category]?.tools || [];
  }
  
  /**
   * Cleanup least used handlers to prevent memory leaks
   */
  private cleanupLeastUsedHandlers(): void {
    const handlersToRemove = Math.floor(this.maxLoadedHandlers * 0.2); // Remove 20% of handlers
    
    // Sort handlers by last access time and access count
    const handlerStats = Array.from(this.loadedHandlers.keys()).map(name => ({
      name,
      accessCount: this.handlerAccessCount.get(name) || 0,
      lastAccess: this.lastAccessTime.get(name) || 0,
      score: (this.handlerAccessCount.get(name) || 0) * 1000 + 
             (this.lastAccessTime.get(name) || 0) / 1000000
    }));
    
    handlerStats.sort((a, b) => a.score - b.score);
    
    // Remove least used handlers
    for (let i = 0; i < handlersToRemove && i < handlerStats.length; i++) {
      const { name } = handlerStats[i];
      this.loadedHandlers.delete(name);
      this.handlerAccessCount.delete(name);
      this.lastAccessTime.delete(name);
    }
  }
  
  /**
   * Clear all loaded handlers (for testing or manual cleanup)
   */
  clearLoadedHandlers(): void {
    this.loadedHandlers.clear();
    this.handlerAccessCount.clear();
    this.lastAccessTime.clear();
  }
}
