/**
 * Configuration management for Productboard MCP server
 * Supports multi-workspace setup following Jira MCP patterns
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { MultiInstanceProductboardConfig, ProductboardConfig } from "./types.js";

const CONFIG_FILE = ".productboard-config.json";

/**
 * Load configuration from file or environment variables
 */
export function loadConfig(): MultiInstanceProductboardConfig {
  // Try to load from config file first
  const configPath = findConfigFile();
  if (configPath && existsSync(configPath)) {
    try {
      const configContent = readFileSync(configPath, "utf-8");
      const config = JSON.parse(configContent) as MultiInstanceProductboardConfig;
      return validateConfig(config);
    } catch (error) {
      console.error(`Failed to load config from ${configPath}:`, error);
    }
  }

  // Fallback to environment variables
  return createConfigFromEnvironment();
}

/**
 * Find config file in current directory or parent directories
 */
function findConfigFile(): string | null {
  let currentDir = process.cwd();
  
  while (currentDir !== "/") {
    const configPath = join(currentDir, CONFIG_FILE);
    if (existsSync(configPath)) {
      return configPath;
    }
    currentDir = join(currentDir, "..");
  }
  
  return null;
}

/**
 * Create configuration from environment variables
 */
function createConfigFromEnvironment(): MultiInstanceProductboardConfig {
  const apiToken = process.env.PRODUCTBOARD_API_TOKEN;
  const baseUrl = process.env.PRODUCTBOARD_BASE_URL || "https://api.productboard.com";
  const workspaceId = process.env.PRODUCTBOARD_WORKSPACE_ID;

  if (!apiToken) {
    throw new Error("PRODUCTBOARD_API_TOKEN environment variable is required");
  }

  return {
    instances: {
      default: {
        apiToken,
        baseUrl,
        rateLimitPerMinute: 60,
        workspaces: workspaceId ? [workspaceId] : [],
      },
    },
    workspaces: workspaceId ? {
      [workspaceId]: {
        instance: "default",
        workspaceId,
      },
    } : {},
    defaultInstance: "default",
  };
}

/**
 * Validate configuration structure
 */
function validateConfig(config: MultiInstanceProductboardConfig): MultiInstanceProductboardConfig {
  if (!config.instances || Object.keys(config.instances).length === 0) {
    throw new Error("Configuration must have at least one instance");
  }

  for (const [instanceName, instance] of Object.entries(config.instances)) {
    if (!instance.apiToken) {
      throw new Error(`Instance '${instanceName}' is missing apiToken`);
    }
    if (!instance.baseUrl) {
      instance.baseUrl = "https://api.productboard.com";
    }
    if (!instance.rateLimitPerMinute) {
      instance.rateLimitPerMinute = 60;
    }
  }

  if (!config.defaultInstance) {
    config.defaultInstance = Object.keys(config.instances)[0];
  }

  return config;
}

/**
 * Get instance configuration by name
 */
export function getInstance(config: MultiInstanceProductboardConfig, instanceName?: string) {
  const name = instanceName || config.defaultInstance;
  if (!name || !config.instances[name]) {
    throw new Error(`Instance '${name}' not found in configuration`);
  }
  return config.instances[name];
}

/**
 * Get workspace configuration
 */
export function getWorkspace(config: MultiInstanceProductboardConfig, workspaceId: string) {
  const workspace = config.workspaces[workspaceId];
  if (!workspace) {
    // Return default workspace config
    return {
      instance: config.defaultInstance!,
      workspaceId,
    };
  }
  return workspace;
}