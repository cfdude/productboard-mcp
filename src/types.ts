/**
 * Type definitions for Productboard MCP server
 */

export interface ProductboardConfig {
  workspaceId?: string;
  apiToken: string;
  baseUrl?: string;
  rateLimitPerMinute?: number;
}

export interface MultiInstanceProductboardConfig {
  instances: Record<string, ProductboardInstanceConfig>;
  workspaces: Record<string, ProductboardWorkspaceConfig>;
  defaultInstance?: string;
  toolCategories?: ToolCategoryConfig;
}

export interface ToolCategoryConfig {
  enabled?: string[];
  disabled?: string[];
  profiles?: Record<string, string[]>;
  activeProfile?: string;
  customGroups?: Record<string, string[]>;
}

export interface ProductboardInstanceConfig {
  apiToken: string;
  baseUrl?: string;
  rateLimitPerMinute?: number;
  workspaces?: string[];
}

export interface ProductboardWorkspaceConfig {
  instance: string;
  workspaceId?: string;
  customFields?: Record<string, string>;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  user?: {
    email: string;
    name?: string;
  };
  company?: {
    id: string;
    name: string;
  };
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Feature {
  id: string;
  name: string;
  description?: string;
  status?: string;
  priority?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  company?: Company;
  externalId?: string;
}

export interface Release {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookSubscription {
  id: string;
  eventType: string;
  url: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
