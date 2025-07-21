#!/usr/bin/env node
/**
 * Generate tool manifest from OpenAPI specification
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const OPENAPI_PATH = join(PROJECT_ROOT, 'productboard_openapi.yaml');
const OUTPUT_DIR = join(PROJECT_ROOT, 'generated');
const MANIFEST_PATH = join(OUTPUT_DIR, 'manifest.json');

interface OpenAPIOperation {
  operationId: string;
  summary: string;
  description?: string;
  tags?: string[];
  parameters?: Array<{
    name: string;
    in: string;
    required?: boolean;
    description?: string;
    schema?: any;
  }>;
  requestBody?: {
    required?: boolean;
    content?: any;
  };
}

interface ToolManifest {
  version: string;
  generated: string;
  categories: Record<string, CategoryInfo>;
  tools: Record<string, ToolInfo>;
}

interface CategoryInfo {
  displayName: string;
  description: string;
  tools: string[];
}

interface ToolInfo {
  category: string;
  operation: string;
  description: string;
  requiredParams: string[];
  optionalParams: string[];
  implementation: string;
}

// Parse JSON OpenAPI spec
function parseOpenAPI(): any {
  const content = readFileSync(OPENAPI_PATH, 'utf-8');
  return JSON.parse(content);
}

// Convert OpenAPI path to tool name
function generateToolName(
  method: string,
  path: string,
  operationId?: string
): string {
  // Use operationId if available
  if (operationId) {
    return operationId
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }

  // Otherwise generate from path
  const parts = path.split('/').filter(p => p && !p.startsWith('{'));
  const resource = parts[0] || 'unknown';

  const actionMap: Record<string, string> = {
    get: path.includes('{') ? 'get' : 'list',
    post: 'create',
    put: 'update',
    patch: 'update',
    delete: 'delete',
  };

  const action = actionMap[method.toLowerCase()] || method.toLowerCase();

  // Handle nested resources
  if (parts.length > 2) {
    const subResource = parts[parts.length - 1];
    return `${resource}_${action}_${subResource}`;
  }

  return `${resource}_${action}`;
}

// Extract category from tags or path
function extractCategory(tags: string[] = [], path: string): string {
  if (tags.length > 0) {
    return tags[0].toLowerCase();
  }

  const parts = path.split('/').filter(p => p && !p.startsWith('{'));
  return parts[0] || 'unknown';
}

// Tools that have static implementations with their own inputSchemas
// These should have NO parameters in the manifest
const STATIC_IMPLEMENTATION_TOOLS = [
  'create_feature',
  'update_feature',
  'create_component',
  'update_component',
  'create_product',
  'update_product',
  'create_note',
  'update_note',
  'create_company',
  'update_company',
  'create_user',
  'update_user',
  'create_release',
  'update_release',
  'create_release_group',
  'update_release_group',
  'get_features',
  'get_feature',
  'get_components',
  'get_component',
  'get_products',
  'get_product',
  'get_notes',
  'get_note',
  'get_companies',
  'get_company',
  'get_users',
  'get_user',
  'get_releases',
  'get_release',
  'get_release_groups',
  'get_release_group',
  'get_custom_fields',
  'get_custom_field',
  'get_custom_fields_values',
  'get_custom_field_value',
  'set_custom_field_value',
  'delete_custom_field_value',
  'get_feature_statuses',
];

// Tools that should have their request body expanded into individual parameters
const EXPAND_BODY_TOOLS = [
  // Only include tools that use dynamic generation and need expansion:
  'create_objective',
  'update_objective',
  'create_initiative',
  'update_initiative',
  'create_key_result',
  'update_key_result',
  'set_custom_field_value',
  'set_company_field_value',
];

// Extract schema properties from request body
function extractBodyProperties(requestBody: any): {
  required: string[];
  optional: string[];
} {
  const required: string[] = [];
  const optional: string[] = [];

  if (!requestBody?.content?.['application/json']?.schema) {
    return { required, optional };
  }

  const schema = requestBody.content['application/json'].schema;

  // Handle direct schema references (like { "$ref": "#/components/schemas/CompanyCreateRequest" })
  if (schema.$ref) {
    return getImplementationBasedSchema(schema);
  }

  const properties = schema.properties || {};
  const requiredFields = schema.required || [];

  // Handle wrapped schemas (like { data: { ... } })
  if (properties.data) {
    // For now, we'll use a simplified approach for create/update operations
    // The actual required fields should match what our implementation expects
    // This is a mapping based on our implementation requirements
    return getImplementationBasedSchema(properties.data);
  } else {
    // Direct properties
    Object.entries(properties).forEach(([key, prop]: [string, any]) => {
      if (requiredFields.includes(key)) {
        required.push(key);
      } else {
        optional.push(key);
      }
    });
  }

  return { required, optional };
}

// Get schema based on what our implementations actually expect
function getImplementationBasedSchema(dataSchema: any): {
  required: string[];
  optional: string[];
} {
  // Map of tool patterns to their actual implementation requirements
  const implementationSchemas: Record<
    string,
    { required: string[]; optional: string[] }
  > = {
    Feature: {
      required: ['name'],
      optional: ['description', 'status', 'owner', 'parentId'],
    },
    Component: {
      required: ['name'],
      optional: ['description', 'productId'],
    },
    Product: {
      required: ['name'],
      optional: ['description'],
    },
    Note: {
      required: [],
      optional: [
        'title',
        'content',
        'tags',
        'user',
        'customer_email',
        'display_url',
      ],
    },
    Company: {
      required: ['name'],
      optional: ['domain', 'externalId'],
    },
    User: {
      required: ['email'],
      optional: ['name', 'externalId', 'company'],
    },
    Objective: {
      required: ['name'],
      optional: ['description', 'ownerEmail', 'timeframe'],
    },
    Initiative: {
      required: ['name'],
      optional: ['description', 'ownerEmail', 'timeframe'],
    },
    KeyResult: {
      required: ['name', 'objectiveId'],
      optional: ['description', 'ownerEmail', 'current', 'target'],
    },
    Release: {
      required: ['name', 'releaseGroupId'],
      optional: ['description', 'state', 'releaseDate'],
    },
    ReleaseGroup: {
      required: ['name'],
      optional: ['description'],
    },
  };

  // Try to determine the entity type from the schema
  if (dataSchema.$ref) {
    for (const [entityType, schema] of Object.entries(implementationSchemas)) {
      if (dataSchema.$ref.includes(entityType)) {
        return schema;
      }
    }
  }

  // Default fallback
  return { required: [], optional: ['name', 'description'] };
}

// Extract parameters from operation
function extractParameters(
  operation: OpenAPIOperation,
  pathParams: string[] = [],
  method: string = '',
  path: string = ''
): {
  required: string[];
  optional: string[];
} {
  const required: string[] = [];
  const optional: string[] = [];

  // Path parameters are always required
  pathParams.forEach(param => {
    const paramName = param.replace(/[{}]/g, '');
    if (!required.includes(paramName)) {
      required.push(paramName);
    }
  });

  // Query and header parameters
  if (operation.parameters) {
    operation.parameters.forEach(param => {
      if (param.in === 'path') return; // Already handled
      if (!param.name) return; // Skip parameters with null/undefined names

      if (param.required) {
        required.push(param.name);
      } else {
        optional.push(param.name);
      }
    });
  }

  // Request body - handle based on tool type
  if (operation.requestBody) {
    const toolName = generateToolName(method, path, operation.operationId);

    // Check if this tool has a static implementation
    const isStaticTool =
      STATIC_IMPLEMENTATION_TOOLS.includes(operation.operationId) ||
      STATIC_IMPLEMENTATION_TOOLS.includes(toolName);

    if (isStaticTool) {
      // Static tools define their own parameters in inputSchema
      // Don't add any parameters to the manifest
    } else {
      // Check if we should expand body parameters
      const shouldExpand =
        EXPAND_BODY_TOOLS.includes(operation.operationId) ||
        EXPAND_BODY_TOOLS.includes(toolName);

      if (shouldExpand) {
        // Expand body properties for tools that expect direct parameters
        const bodyProps = extractBodyProperties(operation.requestBody);
        required.push(...bodyProps.required);
        optional.push(...bodyProps.optional);
      } else {
        // Keep as 'body' parameter for other tools
        if (operation.requestBody.required) {
          required.push('body');
        } else {
          optional.push('body');
        }
      }
    }
  }

  // Always include these optional params for consistency
  if (!optional.includes('instance')) optional.push('instance');
  if (!optional.includes('workspaceId')) optional.push('workspaceId');
  if (!optional.includes('includeRaw')) optional.push('includeRaw');

  return { required, optional };
}

// Generate manifest from OpenAPI
function generateManifest() {
  console.log('📖 Parsing OpenAPI specification...');
  const openapi = parseOpenAPI();

  const manifest: ToolManifest = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    categories: {},
    tools: {},
  };

  // Build category info from tags
  if (openapi.tags) {
    openapi.tags.forEach((tag: any) => {
      const categoryId = tag.name.toLowerCase();
      manifest.categories[categoryId] = {
        displayName: tag['x-displayName'] || tag.name,
        description: tag.description || `${tag.name} management`,
        tools: [],
      };
    });
  }

  // Process all paths
  Object.entries(openapi.paths).forEach(([path, pathItem]: [string, any]) => {
    // Extract path parameters
    const pathParams = path.match(/{[^}]+}/g) || [];

    // Process each method
    Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
      if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
        const op = operation as OpenAPIOperation;
        const toolName = generateToolName(method, path, op.operationId);
        const category = extractCategory(op.tags, path);
        const { required, optional } = extractParameters(
          op,
          pathParams,
          method,
          path
        );

        // Add tool to manifest
        manifest.tools[toolName] = {
          category,
          operation: `${method.toUpperCase()} ${path}`,
          description: op.summary || op.description || `${method} ${path}`,
          requiredParams: required,
          optionalParams: optional,
          implementation: `tools/${category}.js#${op.operationId || 'handle'}`,
        };

        // Add to category
        if (manifest.categories[category]) {
          manifest.categories[category].tools.push(toolName);
        } else {
          manifest.categories[category] = {
            displayName: category.charAt(0).toUpperCase() + category.slice(1),
            description: `${category} operations`,
            tools: [toolName],
          };
        }
      }
    });
  });

  return manifest;
}

// Main execution
function main() {
  try {
    console.log('🚀 Starting tool manifest generation...');

    // Ensure output directory exists
    mkdirSync(OUTPUT_DIR, { recursive: true });

    // Generate manifest
    const manifest = generateManifest();

    // Write manifest with consistent formatting
    const manifestJson = JSON.stringify(manifest, null, 2);

    // Ensure arrays are consistently formatted (multiline) to match expected CI format
    const formattedJson = manifestJson.replace(
      /(\[(?:\s*"[^"]*",?\s*)*\])/g,
      match => {
        try {
          // Parse the array and reformat to multiline if it has multiple items
          const items = JSON.parse(match.replace(/\s+/g, ' '));
          if (!Array.isArray(items) || items.length <= 1) return match;
          return (
            '[\n        ' +
            items.map(item => `"${item}"`).join(',\n        ') +
            '\n      ]'
          );
        } catch (e) {
          // If parsing fails, return original match
          return match;
        }
      }
    );

    writeFileSync(MANIFEST_PATH, formattedJson);

    // Print statistics
    const toolCount = Object.keys(manifest.tools).length;
    const categoryCount = Object.keys(manifest.categories).length;

    console.log(
      `✅ Generated manifest with ${toolCount} tools across ${categoryCount} categories`
    );
    console.log(`📁 Output: ${MANIFEST_PATH}`);

    // Print category summary
    console.log('\n📊 Category Summary:');
    Object.entries(manifest.categories).forEach(([id, cat]) => {
      console.log(`  - ${cat.displayName}: ${cat.tools.length} tools`);
    });
  } catch (error) {
    console.error('❌ Error generating manifest:', error);
    process.exit(1);
  }
}

main();
