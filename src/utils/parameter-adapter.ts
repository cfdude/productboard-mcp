/**
 * Parameter adapter to handle the mismatch between dynamic tool schemas and implementations
 *
 * The dynamic tool registry generates schemas with a 'body' parameter containing all fields,
 * but our implementations expect individual parameters. This adapter bridges that gap.
 */

interface AdapterConfig {
  // If true, the API expects { data: body } wrapper
  wrapInData?: boolean;
  // Map of parameter names to transform
  parameterMap?: Record<string, string>;
  // Custom transform function
  customTransform?: (args: any) => any;
}

// Configuration for each tool that needs adaptation
const toolAdapterConfig: Record<string, AdapterConfig> = {
  // Create operations that need body unwrapping
  create_feature: {
    wrapInData: false, // Static schema expects direct parameters, not body wrapper
    customTransform: args => {
      // create_feature static implementation expects direct parameters
      // No transformation needed since static schema handles it correctly
      return args;
    },
  },
  create_component: {
    wrapInData: false, // Static schema expects direct parameters, not body wrapper
    customTransform: args => {
      // create_component static implementation expects direct parameters
      // No transformation needed since static schema handles it correctly
      return args;
    },
  },
  create_objective: {
    wrapInData: false,
    customTransform: args => {
      if (args.body && typeof args.body === 'object') {
        return args.body;
      }
      return args;
    },
  },
  create_release_group: {
    wrapInData: false,
    customTransform: args => {
      if (args.body && typeof args.body === 'object') {
        return args.body;
      }
      return args;
    },
  },
  // Update operations already expect body parameter
  update_feature: { wrapInData: true },
  update_component: { wrapInData: true },
  update_objective: { wrapInData: true },

  // Special cases
  get_custom_fields: {
    parameterMap: {
      type: 'type', // Ensure type parameter is passed correctly
    },
  },
};

/**
 * Adapt parameters from dynamic tool schema format to implementation format
 */
export function adaptParameters(toolName: string, args: any): any {
  const config = toolAdapterConfig[toolName];

  if (!config) {
    // No adaptation needed
    return args;
  }

  let adapted = { ...args };

  // Apply custom transform
  if (config.customTransform) {
    adapted = config.customTransform(adapted);
  }

  // Apply parameter mapping
  if (config.parameterMap) {
    const mapped: any = {};
    for (const [from, to] of Object.entries(config.parameterMap)) {
      if (from in adapted) {
        mapped[to] = adapted[from];
        if (from !== to) {
          delete adapted[from];
        }
      }
    }
    adapted = { ...adapted, ...mapped };
  }

  return adapted;
}

/**
 * Get the correct API format for a tool's request body
 */
export function formatApiBody(toolName: string, body: any): any {
  const config = toolAdapterConfig[toolName];

  if (config?.wrapInData) {
    return { data: body };
  }

  return body;
}

/**
 * Generate helpful error messages for parameter validation failures
 */
export function generateParameterErrorMessage(
  toolName: string,
  error: any
): string {
  const baseMessage = error.message || 'Parameter validation failed';

  // Tool-specific helpful messages
  const helpfulHints: Record<string, string> = {
    create_feature: `
The create_feature tool expects parameters in this format:
{
  "name": "Feature name (required)",
  "description": "Feature description (optional)",
  "status": { "id": "status-id" } or { "name": "status-name" } (optional),
  "owner": { "email": "owner@example.com" } (optional),
  "parent": { 
    "id": "parent-id",
    "type": "product" | "component" | "feature" (required if parent specified)
  } (optional)
}

Example:
{
  "name": "New Feature",
  "description": "This feature does X",
  "parent": { "id": "component-123", "type": "component" }
}`,

    create_component: `
The create_component tool expects:
{
  "name": "Component name (required)",
  "description": "Component description (optional)",
  "parent": { "id": "product-id", "type": "product" } (optional)
}`,

    get_custom_fields: `
The get_custom_fields tool requires a 'type' parameter:
{
  "type": "hierarchy-entity" | "note" | "user" | "company"
}`,

    create_objective: `
The create_objective tool expects:
{
  "body": {
    "name": "Objective name (required)",
    "description": "Objective description (optional)",
    "owner": { "email": "owner@example.com" } (optional),
    "timeframe": {
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD"
    } (optional)
  }
}`,
  };

  const hint = helpfulHints[toolName];
  if (hint) {
    return `${baseMessage}\n${hint}`;
  }

  return baseMessage;
}
