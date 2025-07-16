/**
 * Tool-specific type definitions
 */

export interface ToolArguments {
  instance?: string;
  workspaceId?: string;
  [key: string]: unknown;
}

export interface ToolResponse {
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: unknown;
    mimeType?: string;
    uri?: string;
  }>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface ToolHandler {
  (args: ToolArguments): Promise<ToolResponse>;
}

export interface ToolImplementation {
  definition: ToolDefinition;
  handler: ToolHandler;
}