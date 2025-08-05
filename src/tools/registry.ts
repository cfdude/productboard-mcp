/**
 * Dynamic tool registry with lazy loading support
 */
import { readFileSync } from 'fs';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { ToolDefinition } from '../types/tool-types.js';
import { adaptParameters } from '../utils/parameter-adapter.js';

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

// ToolDefinition is now imported from types/tool-types.js

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
  private customTools = new Map<string, ToolDefinition>();

  constructor(enabledCategories: string[] = []) {
    this.enabledCategories = new Set(enabledCategories);
  }

  /**
   * Load tool manifest
   */
  loadManifest(manifestPath: string): void {
    try {
      const content = readFileSync(manifestPath, 'utf-8');
      this.manifest = JSON.parse(content);
    } catch (error) {
      console.error('Failed to load tool manifest:', error);
      throw new McpError(
        ErrorCode.InternalError,
        'Failed to load tool manifest'
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
      throw new Error('Manifest not loaded');
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
          const categoryMappings: Record<string, string> = {
            notes: 'notes',
            features: 'features',
            companies: 'companies',
            users: 'companies', // User tools are in companies handler
            releases: 'releases',
            webhooks: 'webhooks',
            objectives: 'objectives',
            'custom-fields': 'custom-fields',
            'plugin-integrations': 'plugin-integrations',
            'jira-integrations': 'jira-integrations',
            // Handle category name mismatches from manifest
            followers: 'notes',
            components: 'components',
            products: 'products',
            statuses: 'features',
            hierarchyentitiescustomfields: 'custom-fields',
            hierarchyentitiescustomfieldsvalues: 'custom-fields',
            pluginintegrations: 'plugin-integrations',
            pluginintegrationconnections: 'plugin-integrations',
            jiraintegrations: 'jira-integrations',
            jiraintegrationconnections: 'jira-integrations',
            releasegroups: 'releases',
            featurereleaseassignments: 'releases',
            keyresults: 'objectives',
            initiatives: 'objectives',
            // Handle spaces and special characters
            'companies & users': 'companies',
            'key results': 'objectives',
            'custom fields': 'custom-fields',
            'plugin integrations': 'plugin-integrations',
            'jira integrations': 'jira-integrations',
            'product hierarchy': 'features',
            'releases & release groups': 'releases',
            'hierarchy entity custom fields': 'custom-fields',
            'hierarchy entity custom fields values': 'custom-fields',
            'plugin integration connections': 'plugin-integrations',
            'jira integration connections': 'jira-integrations',
            'release groups': 'releases',
            'feature release assignments': 'releases',
          };

          const moduleFile = categoryMappings[toolInfo.category.toLowerCase()];
          if (moduleFile) {
            // Import from existing tools
            const module = await import(`./${moduleFile}.js`);

            // Get the handler function name based on the module file
            const handlerName = `handle${moduleFile.charAt(0).toUpperCase() + moduleFile.slice(1).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())}Tool`;
            const handler = module[handlerName];

            if (!handler) {
              throw new Error(
                `Handler ${handlerName} not found in ${moduleFile}.js`
              );
            }

            // Return a wrapper that calls the handler
            return async (args: any) => handler(toolName, args);
          } else {
            // Import from generated tools
            const categoryFile = toolInfo.category
              .toLowerCase()
              .replace(/&/g, 'and')
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');
            // Use process.cwd() to get the project root
            const projectRoot = process.cwd();
            const module = await import(
              `${projectRoot}/generated/tools/${categoryFile}.js`
            );

            // Get the handler function name
            const handlerName = `handle${toolInfo.category
              .split(/[\s&]+/)
              .filter(w => w.length > 0)
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join('')}Tool`;
            const handler = module[handlerName];

            if (!handler) {
              throw new Error(
                `Handler ${handlerName} not found in generated/${categoryFile}.js`
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
   * Register a custom tool (not from manifest/OpenAPI)
   */
  registerCustomTool(name: string, tool: ToolDefinition): void {
    this.customTools.set(name, tool);

    // Register the tool handler
    this.registerLoader(name, async () => {
      const { handleSearchTool } = await import('./search.js');
      return async (args: any) => handleSearchTool(name, args);
    });
  }

  /**
   * Get tool definitions for enabled categories
   */
  async getToolDefinitions(): Promise<ToolDefinition[]> {
    if (!this.manifest) return [];

    const definitions: ToolDefinition[] = [];

    // Tools that have static implementations with their own inputSchemas
    const staticImplementationTools = [
      'create_feature',
      'update_feature',
      'delete_feature',
      'get_features',
      'get_feature',
      'create_component',
      'update_component',
      'get_components',
      'get_component',
      'create_product',
      'update_product',
      'get_products',
      'get_product',
      'create_note',
      'update_note',
      'delete_note',
      'get_notes',
      'get_note',
      'create_company',
      'update_company',
      'delete_company',
      'get_companies',
      'get_company',
      'create_user',
      'update_user',
      'delete_user',
      'get_users',
      'get_user',
      'create_release',
      'update_release',
      'delete_release',
      'get_releases',
      'get_release',
      'create_release_group',
      'update_release_group',
      'delete_release_group',
      'get_release_groups',
      'get_release_group',
      'create_webhook',
      'list_webhooks',
      'get_webhook',
      'delete_webhook',
      'create_objective',
      'update_objective',
      'delete_objective',
      'get_objectives',
      'get_objective',
      'create_initiative',
      'update_initiative',
      'delete_initiative',
      'get_initiatives',
      'get_initiative',
      'create_key_result',
      'update_key_result',
      'delete_key_result',
      'get_key_results',
      'get_key_result',
      'get_custom_fields',
      'get_custom_field',
      'get_custom_fields_values',
      'get_custom_field_value',
      'set_custom_field_value',
      'delete_custom_field_value',
      'get_feature_statuses',
    ];

    // Load static tool definitions from modules
    const staticToolsMap = new Map<string, ToolDefinition>();

    // Helper to load tool definitions from a module
    const loadToolDefinitions = async (
      moduleName: string,
      setupFunctionName: string
    ) => {
      try {
        const module = await import(`./${moduleName}.js`);
        const setupFunction = module[setupFunctionName];
        if (setupFunction) {
          const tools = setupFunction();
          tools.forEach((tool: ToolDefinition) => {
            staticToolsMap.set(tool.name, tool);
          });
        }
      } catch (error) {
        console.error(`Failed to load static tools from ${moduleName}:`, error);
      }
    };

    // Load all static tool definitions
    await Promise.all([
      loadToolDefinitions('notes', 'setupNotesTools'),
      loadToolDefinitions('features', 'setupFeaturesTools'),
      loadToolDefinitions('companies', 'setupCompaniesTools'),
      loadToolDefinitions('users', 'setupUsersTools'),
      loadToolDefinitions('releases', 'setupReleasesTools'),
      loadToolDefinitions('webhooks', 'setupWebhooksTools'),
      loadToolDefinitions('objectives', 'setupObjectivesTools'),
      loadToolDefinitions('custom-fields', 'setupCustomFieldsTools'),
      loadToolDefinitions(
        'plugin-integrations',
        'setupPluginIntegrationsTools'
      ),
      loadToolDefinitions('jira-integrations', 'setupJiraIntegrationsTools'),
    ]);

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

      // Check if this is a static implementation tool
      if (staticImplementationTools.includes(toolName)) {
        if (staticToolsMap.has(toolName)) {
          const staticDef = staticToolsMap.get(toolName)!;

          // Use the actual tool definition from the module
          definitions.push(staticDef);
          continue;
        }
      }

      // Build input schema from manifest for dynamic tools
      const properties: Record<string, any> = {};

      // Filter nulls from parameter arrays
      const filteredRequiredParams = toolInfo.requiredParams.filter(
        param => param != null
      );
      const filteredOptionalParams = toolInfo.optionalParams.filter(
        param => param != null
      );

      // Add required parameters
      filteredRequiredParams.forEach(param => {
        if (param === 'body') {
          properties[param] = {
            type: 'object',
            description: `${param} parameter`,
          };
        } else if (
          param === 'status' ||
          param === 'owner' ||
          param === 'parent' ||
          param === 'company' ||
          param === 'user' ||
          param === 'timeframe'
        ) {
          // These are object parameters
          properties[param] = {
            type: 'object',
            description: `${param} parameter`,
          };
        } else {
          properties[param] = {
            type: 'string',
            description: `${param} parameter`,
          };
        }
      });

      // Add optional parameters
      filteredOptionalParams.forEach(param => {
        if (param === 'body') {
          properties[param] = {
            type: 'object',
            description: `${param} parameter (optional)`,
          };
        } else if (param === 'includeRaw') {
          properties[param] = {
            type: 'boolean',
            description: `${param} parameter (optional)`,
          };
        } else if (
          param === 'status' ||
          param === 'owner' ||
          param === 'parent' ||
          param === 'company' ||
          param === 'user' ||
          param === 'timeframe'
        ) {
          // These are object parameters
          properties[param] = {
            type: 'object',
            description: `${param} parameter (optional)`,
          };
        } else if (
          param === 'current' ||
          param === 'target' ||
          param === 'limit' ||
          param === 'startWith' ||
          param === 'pageLimit' ||
          param === 'pageOffset'
        ) {
          // These are number parameters
          properties[param] = {
            type: 'number',
            description: `${param} parameter (optional)`,
          };
        } else {
          properties[param] = {
            type: 'string',
            description: `${param} parameter (optional)`,
          };
        }
      });

      const toolDef: any = {
        name: toolName,
        description: toolInfo.description,
        inputSchema: {
          type: 'object',
          properties,
          additionalProperties: true,
        },
      };

      // Add required params to schema if any exist
      if (filteredRequiredParams.length > 0) {
        toolDef.inputSchema.required = filteredRequiredParams;
      }

      // Debug logging for create_component and create_feature dynamic schemas
      if (toolName === 'create_component' || toolName === 'create_feature') {
        console.log(
          `⚙️ DYNAMIC SCHEMA GENERATED FOR ${toolName}:`,
          JSON.stringify(toolDef.inputSchema, null, 2)
        );
      }

      definitions.push(toolDef);
    }

    // Add custom tools (not from manifest/OpenAPI)
    for (const [, tool] of this.customTools) {
      definitions.push(tool);
    }

    // Debug logging: Final tool definitions count
    const componentDef = definitions.find(
      def => def.name === 'create_component'
    );
    const featureDef = definitions.find(def => def.name === 'create_feature');

    if (componentDef) {
      console.log(
        '🚀 FINAL create_component DEFINITION:',
        JSON.stringify(componentDef, null, 2)
      );
    }
    if (featureDef) {
      console.log(
        '🚀 FINAL create_feature DEFINITION:',
        JSON.stringify(featureDef, null, 2)
      );
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
          `Unknown tool: ${toolName}`
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
          `Failed to load tool: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    // Track access for memory management
    this.handlerAccessCount.set(
      toolName,
      (this.handlerAccessCount.get(toolName) || 0) + 1
    );
    this.lastAccessTime.set(toolName, Date.now());

    // Execute handler with error handling
    // Apply parameter adaptation before calling handler
    const adaptedArgs = adaptParameters(toolName, args);

    // Debug logging for create_component and create_feature
    if (toolName === 'create_component' || toolName === 'create_feature') {
      console.log(
        `🎯 EXECUTING ${toolName} with args:`,
        JSON.stringify(args, null, 2)
      );
      console.log(
        `🎯 ADAPTED args for ${toolName}:`,
        JSON.stringify(adaptedArgs, null, 2)
      );
    }

    return await handler(adaptedArgs);
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
      score:
        (this.handlerAccessCount.get(name) || 0) * 1000 +
        (this.lastAccessTime.get(name) || 0) / 1000000,
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
