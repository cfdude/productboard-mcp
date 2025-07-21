#!/usr/bin/env node
/**
 * Generate tool implementations from OpenAPI specification and manifest
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const MANIFEST_PATH = join(PROJECT_ROOT, 'generated', 'manifest.json');
const OPENAPI_PATH = join(PROJECT_ROOT, 'openapi.yaml');
const OUTPUT_DIR = join(PROJECT_ROOT, 'generated', 'tools');

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

// Load manifest
function loadManifest(): ToolManifest {
  const content = readFileSync(MANIFEST_PATH, 'utf-8');
  return JSON.parse(content);
}

// Parse OpenAPI spec
function parseOpenAPI(): any {
  const content = readFileSync(OPENAPI_PATH, 'utf-8');
  return JSON.parse(content);
}

// Convert tool name to function name
function toolNameToFunctionName(toolName: string): string {
  // productboard_notes_create -> createNote
  const parts = toolName.split('_');
  if (parts.length < 3) return toolName;

  const action = parts[2];
  const resource = parts[1];

  // Special cases
  if (action === 'list') return `list${capitalize(resource)}`;
  if (action === 'get') return `get${capitalize(singularize(resource))}`;
  if (action === 'create') return `create${capitalize(singularize(resource))}`;
  if (action === 'update') return `update${capitalize(singularize(resource))}`;
  if (action === 'delete') return `delete${capitalize(singularize(resource))}`;

  // Nested resources
  if (parts.length > 3) {
    const subResource = parts.slice(3).join('');
    return `${action}${capitalize(singularize(resource))}${capitalize(subResource)}`;
  }

  return `${action}${capitalize(resource)}`;
}

// Capitalize first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Simple singularization
function singularize(str: string): string {
  if (str.endsWith('ies')) return str.slice(0, -3) + 'y';
  if (str.endsWith('es')) return str.slice(0, -2);
  if (str.endsWith('s')) return str.slice(0, -1);
  return str;
}

// Generate parameter extraction code
function generateParamExtraction(params: string[]): string {
  if (params.length === 0) return '';

  const extractions = params.map(param => {
    if (param === 'body') {
      return '    const body = args.body;';
    }
    return `    const ${param} = args.${param};`;
  });

  return extractions.join('\n');
}

// Generate axios call based on operation
function generateAxiosCall(
  operation: string,
  requiredParams: string[]
): string {
  const [method, path] = operation.split(' ');
  const lowerMethod = method.toLowerCase();

  // Handle path parameters
  let interpolatedPath = path;
  const pathParams = path.match(/{([^}]+)}/g);
  if (pathParams) {
    pathParams.forEach(param => {
      const paramName = param.slice(1, -1);
      interpolatedPath = interpolatedPath.replace(
        param,
        `\${args.${paramName}}`
      );
    });
  }

  // Build query params
  const queryParams = requiredParams.filter(
    p =>
      !pathParams?.includes(`{${p}}`) &&
      p !== 'body' &&
      !['instance', 'workspaceId', 'includeRaw'].includes(p)
  );

  let paramsCode = '';
  if (queryParams.length > 0) {
    paramsCode = `\n    const params: any = {};\n`;
    queryParams.forEach(param => {
      paramsCode += `    if (args.${param}) params.${param} = args.${param};\n`;
    });
  }

  // Generate axios call
  if (
    ['post', 'put', 'patch'].includes(lowerMethod) &&
    requiredParams.includes('body')
  ) {
    return `${paramsCode}
    const response = await context.axios.${lowerMethod}(\`${interpolatedPath}\`, body${paramsCode ? ', { params }' : ''});`;
  } else {
    return `${paramsCode}
    const response = await context.axios.${lowerMethod}(\`${interpolatedPath}\`${paramsCode ? ', { params }' : ''});`;
  }
}

// Generate tool implementation
function generateToolImplementation(
  toolName: string,
  toolInfo: ToolInfo,
  functionName: string
): string {
  const axiosCall = generateAxiosCall(
    toolInfo.operation,
    toolInfo.requiredParams
  );

  return `export async function ${functionName}(args: any) {
  return await withContext(async (context) => {
${axiosCall}
    
    return {
      content: [{
        type: "text",
        text: formatResponse(response.data, args.includeRaw)
      }]
    };
  }, args.instance, args.workspaceId);
}`;
}

// Generate category file
function generateCategoryFile(
  category: string,
  tools: Record<string, ToolInfo>
): string {
  const categoryTools = Object.entries(tools).filter(
    ([_, info]) => info.category === category
  );

  if (categoryTools.length === 0) return '';

  const imports = `/**
 * Auto-generated ${category} management tools
 */
import { withContext, formatResponse } from "../../utils/tool-wrapper.js";

`;

  const toolDefinitions = categoryTools.map(([toolName, toolInfo]) => {
    const functionName = toolNameToFunctionName(toolName);
    return {
      name: toolName,
      functionName,
      description: toolInfo.description,
      requiredParams: toolInfo.requiredParams,
      optionalParams: toolInfo.optionalParams,
    };
  });

  const setupFunction = `export function setup${capitalize(category)}Tools() {
  return [
${toolDefinitions
  .map(
    tool => `    {
      name: "${tool.name}",
      description: "${tool.description}",
      inputSchema: {
        type: "object",
        properties: {
${[...tool.requiredParams, ...tool.optionalParams]
  .map(param => {
    const isRequired = tool.requiredParams.includes(param);
    const type = param === 'includeRaw' ? 'boolean' : 'string';
    return `          ${param}: {
            type: "${type}",
            description: "${param} parameter${isRequired ? '' : ' (optional)'}"
          }`;
  })
  .join(',\n')}
        }${
          tool.requiredParams.length > 0
            ? `,
        required: ${JSON.stringify(tool.requiredParams)}`
            : ''
        }
      }
    }`
  )
  .join(',\n')}
  ];
}

`;

  const handlerFunction = `export async function handle${capitalize(category)}Tool(name: string, args: any) {
  switch (name) {
${toolDefinitions
  .map(
    tool => `    case "${tool.name}":
      return await ${tool.functionName}(args);`
  )
  .join('\n')}
    default:
      throw new Error(\`Unknown ${category} tool: \${name}\`);
  }
}

`;

  const implementations = categoryTools
    .map(([toolName, toolInfo]) => {
      const functionName = toolNameToFunctionName(toolName);
      return generateToolImplementation(toolName, toolInfo, functionName);
    })
    .join('\n\n');

  return imports + setupFunction + handlerFunction + implementations;
}

// Main execution
function main() {
  try {
    console.log('🚀 Starting tool generation...');

    // Load manifest
    const manifest = loadManifest();
    const openapi = parseOpenAPI();

    // Ensure output directory exists
    mkdirSync(OUTPUT_DIR, { recursive: true });

    // Get existing implementations
    const existingCategories = [
      'notes',
      'features',
      'companies',
      'users',
      'releases',
      'webhooks',
    ];

    // Generate files for each category
    let generatedCount = 0;
    Object.entries(manifest.categories).forEach(([categoryId, category]) => {
      // Skip if already implemented
      if (existingCategories.includes(categoryId)) {
        console.log(`⏭️  Skipping ${categoryId} (already implemented)`);
        return;
      }

      // Generate category file
      const content = generateCategoryFile(categoryId, manifest.tools);
      if (content) {
        const filePath = join(OUTPUT_DIR, `${categoryId}.ts`);
        writeFileSync(filePath, content);
        console.log(
          `✅ Generated ${categoryId}.ts with ${category.tools.length} tools`
        );
        generatedCount++;
      }
    });

    console.log(
      `\n🎉 Generated ${generatedCount} new category implementations`
    );
  } catch (error) {
    console.error('❌ Error generating tools:', error);
    process.exit(1);
  }
}

main();
