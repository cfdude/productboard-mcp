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

// Extract parameters from operation
function extractParameters(
  operation: OpenAPIOperation,
  pathParams: string[] = []
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

      if (param.required) {
        required.push(param.name);
      } else {
        optional.push(param.name);
      }
    });
  }

  // Request body
  if (operation.requestBody?.required) {
    required.push('body');
  } else if (operation.requestBody) {
    optional.push('body');
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
        const { required, optional } = extractParameters(op, pathParams);

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

    // Write manifest with compact arrays
    let manifestJson = JSON.stringify(manifest, null, 2);

    // Convert multiline arrays to single line for better CI compatibility
    manifestJson = manifestJson.replace(
      /:\s*\[\s*\n([\s\S]*?)\s*\n\s*\]/g,
      (match, content) => {
        // Check if this is an array of strings or simple values
        const trimmedContent = content.trim();
        if (trimmedContent === '') {
          return ': []';
        }

        // Split by comma and newline, clean up items
        const items = trimmedContent
          .split(',\n')
          .map((item: string) => {
            const cleaned = item.trim();
            // Handle both quoted and unquoted values, including null
            return cleaned;
          })
          .filter(item => item !== '');

        return `: [${items.join(', ')}]`;
      }
    );

    writeFileSync(MANIFEST_PATH, manifestJson);

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
