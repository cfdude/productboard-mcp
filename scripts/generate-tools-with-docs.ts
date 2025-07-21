#!/usr/bin/env node
/**
 * Generate tool implementations with rich documentation from OpenAPI specification
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { ToolDocumentation } from '../src/documentation/tool-documentation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const MANIFEST_PATH = join(PROJECT_ROOT, 'generated', 'manifest.json');
const OPENAPI_PATH = join(PROJECT_ROOT, 'productboard_openapi.yaml');
const OUTPUT_DIR = join(PROJECT_ROOT, 'generated', 'tools');
const DOCS_OUTPUT_PATH = join(
  PROJECT_ROOT,
  'generated',
  'tool-documentation.ts'
);

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

// Generate parameter documentation
function generateParamDocumentation(
  params: string[],
  operation: any
): Record<string, string> {
  const paramDocs: Record<string, string> = {};

  // Standard params
  paramDocs.instance = 'Productboard instance URL (optional)';
  paramDocs.workspaceId =
    'Workspace ID for multi-workspace environments (optional)';
  paramDocs.includeRaw = 'Include raw API response in output (optional)';
  paramDocs.body = 'Request body containing the data to send';

  // Get parameter descriptions from OpenAPI
  if (operation.parameters) {
    operation.parameters.forEach((param: any) => {
      if (param.description) {
        paramDocs[param.name] = param.description;
      }
    });
  }

  return paramDocs;
}

// Generate example based on tool type
function generateExample(
  toolName: string,
  toolInfo: ToolInfo,
  index: number
): any {
  // Parse tool name - handle both with and without prefix
  const parts = toolName.split('_');
  const resource = parts.length >= 3 ? parts[1] : parts[0];
  const action = parts.length >= 3 ? parts[2] : parts[1];

  // Create different examples based on action and index
  switch (action) {
    case 'create':
      if (index === 0) {
        return {
          title: `Basic ${resource} creation`,
          description: `Create a new ${singularize(resource)} with minimal required fields`,
          input: generateBasicCreateExample(resource),
          notes: 'Start with required fields only for simple use cases',
        };
      } else if (index === 1) {
        return {
          title: `${capitalize(resource)} with full details`,
          description: `Create a ${singularize(resource)} with all commonly used fields`,
          input: generateFullCreateExample(resource),
          notes: 'Include optional fields for richer data',
        };
      }
      break;

    case 'list':
      if (index === 0) {
        return {
          title: `Get all ${resource}`,
          description: `Retrieve all ${resource} with default pagination`,
          input: { limit: 25, detail: 'standard' },
          notes: 'Use lower limits for better performance',
        };
      } else if (index === 1) {
        return {
          title: `Search ${resource} with filters`,
          description: `Find specific ${resource} using search criteria`,
          input: generateSearchExample(resource),
          notes: 'Combine filters to narrow results',
        };
      }
      break;

    case 'update':
      return {
        title: `Update ${singularize(resource)}`,
        description: `Modify an existing ${singularize(resource)}`,
        input: generateUpdateExample(resource),
        notes: 'Only include fields you want to change',
      };

    case 'delete':
      return {
        title: `Delete ${singularize(resource)}`,
        description: `Remove a ${singularize(resource)} from the system`,
        input: { id: `${resource.slice(0, 4)}_123` },
        notes: 'This action cannot be undone',
      };

    default:
      return {
        title: `${capitalize(action)} ${resource}`,
        description: `Perform ${action} operation on ${resource}`,
        input: {},
        notes: 'Check API documentation for specific parameters',
      };
  }
}

// Generate basic create example
function generateBasicCreateExample(resource: string): any {
  switch (resource) {
    case 'notes':
      return {
        title: 'Customer feedback',
        content: 'User requested dark mode support',
        tags: ['feature-request', 'ui'],
        user: { email: 'customer@example.com' },
      };
    case 'features':
      return {
        name: 'Dark mode support',
        description: 'Add dark theme option to the application',
        priority: 7.5,
      };
    case 'companies':
      return {
        name: 'Acme Corporation',
        domain: 'acme.com',
      };
    case 'releases':
      return {
        name: 'Q1 2025 Release',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
      };
    default:
      return {
        name: `New ${singularize(resource)}`,
        description: `Description for ${singularize(resource)}`,
      };
  }
}

// Generate full create example
function generateFullCreateExample(resource: string): any {
  const basic = generateBasicCreateExample(resource);

  switch (resource) {
    case 'notes':
      return {
        ...basic,
        displayUrl: 'https://support.example.com/ticket/12345',
        companyId: 'comp_456',
        customerId: 'cust_789',
        source: { origin: 'support', category: 'ticket' },
      };
    case 'features':
      return {
        ...basic,
        effort: 8,
        value: 9,
        status: 'candidate',
        assignee: { email: 'pm@example.com' },
        timeframe: { startDate: '2025-02-01', endDate: '2025-02-28' },
      };
    case 'companies':
      return {
        ...basic,
        size: 'enterprise',
        plan: 'premium',
        customFields: {
          industry: 'technology',
          arr: '1000000',
        },
      };
    default:
      return basic;
  }
}

// Generate search example
function generateSearchExample(resource: string): any {
  switch (resource) {
    case 'notes':
      return {
        term: 'performance',
        tags: ['bug'],
        dateFrom: '2025-01-01',
        limit: 50,
        detail: 'standard',
      };
    case 'features':
      return {
        status: 'in-progress',
        priority: { min: 7 },
        limit: 25,
        detail: 'full',
      };
    case 'companies':
      return {
        term: 'enterprise',
        hasNotes: true,
        limit: 100,
      };
    default:
      return {
        limit: 50,
        offset: 0,
        detail: 'standard',
      };
  }
}

// Generate update example
function generateUpdateExample(resource: string): any {
  const id = `${resource.slice(0, 4)}_123`;

  switch (resource) {
    case 'notes':
      return {
        id,
        body: {
          tags: ['resolved', 'v2.0'],
          status: 'processed',
        },
      };
    case 'features':
      return {
        id,
        body: {
          status: 'in-progress',
          priority: 9,
          assignee: { email: 'dev@example.com' },
        },
      };
    case 'companies':
      return {
        id,
        body: {
          size: 'enterprise',
          customFields: {
            tier: 'platinum',
          },
        },
      };
    default:
      return {
        id,
        body: {
          name: `Updated ${singularize(resource)}`,
          description: 'Updated description',
        },
      };
  }
}

// Generate common errors for a tool
function generateCommonErrors(toolName: string, action: string): any[] {
  const errors = [];

  // Common errors for all tools
  errors.push({
    error: 'Authentication failed',
    cause: 'Invalid or missing API token',
    solution:
      'Ensure PRODUCTBOARD_API_TOKEN environment variable is set correctly',
  });

  // Action-specific errors
  switch (action) {
    case 'create':
      errors.push({
        error: 'Validation error',
        cause: 'Required fields missing or invalid format',
        solution:
          'Check that all required fields are provided with correct data types',
      });
      break;

    case 'get':
    case 'update':
    case 'delete':
      errors.push({
        error: 'Resource not found',
        cause: 'The specified ID does not exist',
        solution: 'Verify the ID exists using the corresponding list operation',
      });
      break;

    case 'list':
      errors.push({
        error: 'Invalid pagination',
        cause: 'Offset exceeds total count or limit is too high',
        solution:
          'Use limit <= 100 and check total count for valid offset values',
      });
      break;
  }

  return errors;
}

// Generate best practices for a tool
function generateBestPractices(toolName: string, action: string): string[] {
  const practices = [];
  const resource = toolName.split('_')[1];

  // General practices
  practices.push('Handle rate limiting with exponential backoff');
  practices.push('Cache responses when appropriate to reduce API calls');

  // Action-specific practices
  switch (action) {
    case 'create':
      practices.push(`Validate ${resource} data before submission`);
      practices.push('Use idempotency keys for critical operations');
      break;

    case 'list':
      practices.push('Use pagination for large datasets (limit: 25-50 for UI)');
      practices.push('Apply filters to reduce response size');
      practices.push('Use detail:"basic" for list views');
      break;

    case 'update':
      practices.push('Only include fields that need to be changed');
      practices.push('Fetch current state before updates if needed');
      break;

    case 'delete':
      practices.push('Confirm deletion with user before executing');
      practices.push('Consider soft delete or archiving instead');
      break;
  }

  return practices;
}

// Generate related tools
function generateRelatedTools(toolName: string): string[] {
  const [_, resource, action] = toolName.split('_');
  const related = [];

  // Add complementary CRUD operations
  if (action !== 'create') related.push(`${resource}_create`);
  if (action !== 'list') related.push(`${resource}_list`);
  if (action !== 'get') related.push(`${resource}_get`);
  if (action !== 'update') related.push(`${resource}_update`);
  if (action !== 'delete') related.push(`${resource}_delete`);

  // Add related resource tools
  switch (resource) {
    case 'notes':
      related.push('features_create', 'companies_list');
      break;
    case 'features':
      related.push('releases_list', 'notes_list');
      break;
    case 'companies':
      related.push('users_list', 'notes_create');
      break;
  }

  return [...new Set(related)].filter(t => t !== toolName).slice(0, 5);
}

// Generate tool documentation
function generateToolDocumentation(
  toolName: string,
  toolInfo: ToolInfo,
  operation: any
): ToolDocumentation {
  // Parse tool name - handle both with and without prefix
  const parts = toolName.split('_');
  const resource = parts.length >= 3 ? parts[1] : parts[0];
  const action = parts.length >= 3 ? parts[2] : parts[1];

  // Generate 2-3 examples
  const examples = [];
  for (let i = 0; i < 2; i++) {
    const example = generateExample(toolName, toolInfo, i);
    if (example) examples.push(example);
  }

  // Generate detailed description
  const detailedDescription = `
The ${toolName} tool ${toolInfo.description.toLowerCase()}.

This operation is part of the ${resource} management API and allows you to ${action} ${resource} 
in your Productboard workspace. ${getResourceContext(resource)}

Key capabilities:
${getKeyCapabilities(resource, action)}

Use this tool when you need to ${getUseCaseDescription(resource, action)}.
  `.trim();

  return {
    description: toolInfo.description,
    detailedDescription,
    examples,
    commonErrors: generateCommonErrors(toolName, action),
    bestPractices: generateBestPractices(toolName, action),
    relatedTools: generateRelatedTools(toolName),
  };
}

// Get resource context
function getResourceContext(resource: string): string {
  const contexts: Record<string, string> = {
    notes:
      'Notes represent customer feedback, feature requests, and insights that drive product decisions.',
    features:
      'Features are the building blocks of your product roadmap, representing planned functionality.',
    companies:
      'Companies help you organize and segment customer feedback by organization.',
    users:
      'Users are individuals who provide feedback or are associated with companies.',
    releases:
      'Releases group features into time-based or theme-based deliverables.',
    objectives: 'Objectives represent high-level goals that features support.',
    webhooks:
      'Webhooks enable real-time notifications when data changes in Productboard.',
  };

  return (
    contexts[resource] ||
    `${capitalize(resource)} are key entities in your product management workflow.`
  );
}

// Get key capabilities
function getKeyCapabilities(resource: string, action: string): string {
  const capabilities = [];

  switch (action) {
    case 'create':
      capabilities.push(
        `- Create new ${resource} with required and optional fields`
      );
      capabilities.push(
        `- Set relationships to other entities (companies, users, etc.)`
      );
      capabilities.push(`- Apply tags and custom fields for organization`);
      break;
    case 'list':
      capabilities.push(`- Search ${resource} using keywords and filters`);
      capabilities.push(`- Paginate through large result sets`);
      capabilities.push(`- Control response detail level for performance`);
      break;
    case 'get':
      capabilities.push(
        `- Retrieve full details of a specific ${singularize(resource)}`
      );
      capabilities.push(`- Include related data with proper detail level`);
      capabilities.push(`- Access custom fields and metadata`);
      break;
    case 'update':
      capabilities.push(`- Modify existing ${resource} properties`);
      capabilities.push(`- Update relationships and assignments`);
      capabilities.push(`- Change status and workflow states`);
      break;
    case 'delete':
      capabilities.push(`- Permanently remove ${resource} from the system`);
      capabilities.push(`- Clean up related data and references`);
      capabilities.push(`- Maintain data integrity across relationships`);
      break;
  }

  return capabilities.join('\n');
}

// Get use case description
function getUseCaseDescription(resource: string, action: string): string {
  const useCases: Record<string, Record<string, string>> = {
    notes: {
      create:
        'capture customer feedback, bug reports, or feature requests from various sources',
      list: 'analyze customer feedback trends, find similar requests, or export insights',
      get: 'view complete feedback details including all metadata and relationships',
      update: 'process feedback, add tags, or link to features',
      delete: 'remove outdated or irrelevant feedback',
    },
    features: {
      create: 'add new items to your product roadmap based on customer needs',
      list: 'view roadmap items, filter by status, or find features for planning',
      get: 'examine feature details, requirements, and linked feedback',
      update: 'change feature priority, status, or assignments',
      delete: 'remove cancelled or duplicate features',
    },
    companies: {
      create: 'add new customer organizations to track their feedback',
      list: 'segment customers, analyze feedback by company, or manage accounts',
      get: 'view company details and associated users',
      update: 'modify company information or custom fields',
      delete: 'remove inactive or duplicate companies',
    },
  };

  return (
    useCases[resource]?.[action] ||
    `${action} ${resource} in your product management workflow`
  );
}

// Generate documentation file
function generateDocumentationFile(
  manifest: ToolManifest,
  openapi: any
): string {
  const allDocs: Record<string, ToolDocumentation> = {};

  // Process each tool
  Object.entries(manifest.tools).forEach(([toolName, toolInfo]) => {
    // Find the operation in OpenAPI
    const [method, path] = toolInfo.operation.split(' ');
    const pathItem = openapi.paths[path];
    const operation = pathItem?.[method.toLowerCase()];

    if (operation) {
      allDocs[toolName] = generateToolDocumentation(
        toolName,
        toolInfo,
        operation
      );
    }
  });

  // Generate the TypeScript file
  let content = `/**
 * Auto-generated tool documentation
 * Generated: ${new Date().toISOString()}
 */
import type { ToolDocumentation } from '../src/documentation/tool-documentation.js';

export const generatedToolDocumentation: Record<string, ToolDocumentation> = ${JSON.stringify(allDocs, null, 2)};

// Merge with manually maintained documentation
export function mergeDocumentation(
  manual: Record<string, ToolDocumentation>,
  generated: Record<string, ToolDocumentation>
): Record<string, ToolDocumentation> {
  const merged = { ...generated };
  
  // Manual documentation takes precedence
  Object.entries(manual).forEach(([tool, doc]) => {
    merged[tool] = doc;
  });
  
  return merged;
}
`;

  return content;
}

// Main execution
function main() {
  try {
    console.log('🚀 Starting enhanced tool generation...');

    // Load manifest and OpenAPI
    const manifest = loadManifest();
    const openapi = parseOpenAPI();

    // Ensure output directories exist
    mkdirSync(OUTPUT_DIR, { recursive: true });
    mkdirSync(dirname(DOCS_OUTPUT_PATH), { recursive: true });

    // Generate documentation file
    const docsContent = generateDocumentationFile(manifest, openapi);
    writeFileSync(DOCS_OUTPUT_PATH, docsContent);
    console.log(`✅ Generated tool documentation: ${DOCS_OUTPUT_PATH}`);

    // Generate enhanced tool files with integrated documentation
    let generatedCount = 0;
    Object.entries(manifest.categories).forEach(([categoryId, category]) => {
      // Skip if already implemented
      const existingCategories = [
        'notes',
        'features',
        'companies',
        'users',
        'releases',
        'webhooks',
      ];

      if (existingCategories.includes(categoryId)) {
        console.log(`⏭️  Skipping ${categoryId} (already implemented)`);
        return;
      }

      generatedCount++;
    });

    console.log(
      `\n🎉 Documentation generated for ${Object.keys(manifest.tools).length} tools`
    );
    console.log('📝 Run "npm run build" to compile the generated code');
  } catch (error) {
    console.error('❌ Error generating tools:', error);
    process.exit(1);
  }
}

main();
