#!/usr/bin/env node
/**
 * Generates documentation from ACTUAL MCP tool definitions
 * NOT from the OpenAPI spec
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as tar from 'tar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import all tool setup functions to get the ACTUAL tool definitions
async function loadToolDefinitions() {
  const toolModules = [
    { name: 'notes', module: '../src/tools/notes.js' },
    { name: 'features', module: '../src/tools/features.js' },
    { name: 'companies', module: '../src/tools/companies.js' },
    { name: 'users', module: '../src/tools/users.js' },
    { name: 'releases', module: '../src/tools/releases.js' },
    { name: 'webhooks', module: '../src/tools/webhooks.js' },
    { name: 'objectives', module: '../src/tools/objectives.js' },
    { name: 'custom-fields', module: '../src/tools/custom-fields.js' },
    {
      name: 'plugin-integrations',
      module: '../src/tools/plugin-integrations.js',
    },
    { name: 'jira-integrations', module: '../src/tools/jira-integrations.js' },
  ];

  const allTools: any[] = [];

  for (const { name, module } of toolModules) {
    try {
      const mod = await import(module);
      const setupFn =
        mod[
          `setup${name
            .split('-')
            .map(s => s.charAt(0).toUpperCase() + s.slice(1))
            .join('')}Tools`
        ];
      if (setupFn) {
        const tools = setupFn();
        tools.forEach((tool: any) => {
          allTools.push({
            ...tool,
            category: name,
          });
        });
      }
    } catch (err) {
      console.warn(`Failed to load ${name} tools:`, err);
    }
  }

  return allTools;
}

// Generate documentation for a single tool based on its ACTUAL schema
function generateToolDocumentation(tool: any): string {
  let doc = `# ${tool.name}\n\n`;
  doc += `## Description\n${tool.description}\n\n`;

  // Parameters from the ACTUAL inputSchema
  if (tool.inputSchema && tool.inputSchema.properties) {
    doc += `## Parameters\n\n`;
    doc += `| Parameter | Type | Required | Description |\n`;
    doc += `|-----------|------|----------|-------------|\n`;

    const props = tool.inputSchema.properties;
    const required = tool.inputSchema.required || [];

    // Sort parameters: required first, then alphabetical
    const sortedParams = Object.entries(props).sort((a, b) => {
      const aReq = required.includes(a[0]);
      const bReq = required.includes(b[0]);
      if (aReq && !bReq) return -1;
      if (!aReq && bReq) return 1;
      return a[0].localeCompare(b[0]);
    });

    sortedParams.forEach(([name, schema]: [string, any]) => {
      const isRequired = required.includes(name) ? 'Yes' : 'No';
      let type = schema.type || 'any';

      // Handle array types
      if (type === 'array' && schema.items) {
        type = `${schema.items.type || 'any'}[]`;
      }

      // Handle enum values
      if (schema.enum) {
        type = schema.enum.map((v: any) => `"${v}"`).join(' | ');
      }

      // Handle object types with properties
      if (type === 'object' && schema.properties) {
        const props = Object.entries(schema.properties)
          .map(([k, v]: [string, any]) => `${k}: ${v.type || 'any'}`)
          .join(', ');
        type = `{ ${props} }`;
      }

      const description = schema.description || '';
      doc += `| \`${name}\` | ${type} | ${isRequired} | ${description} |\n`;
    });

    doc += '\n';
  }

  // Example section with REAL parameter names
  doc += `## Example\n\n`;
  doc += `\`\`\`json\n`;
  doc += JSON.stringify(
    {
      tool: tool.name,
      arguments: generateExampleArgs(tool),
    },
    null,
    2
  );
  doc += `\n\`\`\`\n\n`;

  // Category
  doc += `## Category\n${tool.category}\n\n`;

  return doc;
}

// Generate example arguments based on ACTUAL schema
function generateExampleArgs(tool: any): any {
  const args: any = {};

  if (!tool.inputSchema || !tool.inputSchema.properties) {
    return args;
  }

  const props = tool.inputSchema.properties;
  const required = tool.inputSchema.required || [];

  // Add all required parameters
  required.forEach((name: string) => {
    if (props[name]) {
      args[name] = generateExampleValue(name, props[name]);
    }
  });

  // Add a few optional parameters for demonstration
  const optionalParams = Object.entries(props)
    .filter(([name]) => !required.includes(name))
    .slice(0, 2);

  optionalParams.forEach(([name, schema]) => {
    args[name] = generateExampleValue(name, schema as any);
  });

  return args;
}

// Generate realistic example values
function generateExampleValue(name: string, schema: any): any {
  const type = schema.type;

  // Use enum value if available
  if (schema.enum && schema.enum.length > 0) {
    return schema.enum[0];
  }

  switch (type) {
    case 'string':
      // Generate contextual examples
      if (name.toLowerCase().includes('email')) {
        return 'user@example.com';
      } else if (name.toLowerCase().includes('id')) {
        return `example-${name}`;
      } else if (name.toLowerCase().includes('url')) {
        return 'https://example.com';
      } else if (name.toLowerCase().includes('date')) {
        return '2025-01-19';
      } else if (name.toLowerCase().includes('domain')) {
        return 'example.com';
      } else if (name === 'title') {
        return 'Example Title';
      } else if (name === 'content' || name === 'description') {
        return 'Example content text';
      } else if (name === 'name' || name.toLowerCase().includes('name')) {
        return 'Example Name';
      } else {
        return `example-${name}`;
      }

    case 'number':
      if (name === 'limit') return 25;
      if (name === 'startWith' || name === 'offset') return 0;
      if (name.toLowerCase().includes('priority')) return 1;
      return 10;

    case 'boolean':
      return false;

    case 'array':
      if (name === 'tags') return ['tag1', 'tag2'];
      if (name === 'emails') return ['user1@example.com', 'user2@example.com'];
      return [];

    case 'object':
      // Generate object with nested properties
      if (schema.properties) {
        const obj: any = {};
        Object.entries(schema.properties).forEach(
          ([key, prop]: [string, any]) => {
            obj[key] = generateExampleValue(key, prop);
          }
        );
        return obj;
      }
      return {};

    default:
      return null;
  }
}

// Generate category overview
function generateCategoryOverview(category: string, tools: any[]): string {
  let doc = `# ${category
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')} Tools\n\n`;

  doc += `This category contains ${tools.length} tools for managing ${category.replace(/-/g, ' ')} in Productboard.\n\n`;

  doc += '## Available Tools\n\n';
  doc += '| Tool | Description |\n';
  doc += '|------|-------------|\n';

  tools.sort((a, b) => a.name.localeCompare(b.name));

  tools.forEach(tool => {
    doc += `| [\`${tool.name}\`](./${tool.name}.md) | ${tool.description} |\n`;
  });

  doc += '\n## Tool Details\n\n';
  doc +=
    'Click on any tool name above to see detailed documentation including:\n';
  doc += '- Complete parameter descriptions\n';
  doc += '- Required vs optional parameters\n';
  doc += '- Parameter types and formats\n';
  doc += '- Working examples\n';

  return doc;
}

// Main function
async function generateDocumentation() {
  console.log(
    '📚 Generating MCP tool documentation from actual implementations...\n'
  );

  const docsDir = path.join(__dirname, '..', 'tool-docs');
  const outputFile = path.join(__dirname, '..', 'tool-docs.tar.gz');

  // Remove existing docs directory
  if (fs.existsSync(docsDir)) {
    fs.rmSync(docsDir, { recursive: true });
  }

  // Load actual tool definitions
  console.log('Loading tool definitions from MCP implementation...');
  const tools = await loadToolDefinitions();
  console.log(`Loaded ${tools.length} tool definitions\n`);

  // Group by category
  const toolsByCategory: Record<string, any[]> = {};
  tools.forEach(tool => {
    const category = tool.category || 'other';
    if (!toolsByCategory[category]) {
      toolsByCategory[category] = [];
    }
    toolsByCategory[category].push(tool);
  });

  // Generate documentation
  let totalTools = 0;

  for (const [category, categoryTools] of Object.entries(toolsByCategory)) {
    const categoryDir = path.join(docsDir, category);
    fs.mkdirSync(categoryDir, { recursive: true });

    // Category overview
    const overview = generateCategoryOverview(category, categoryTools);
    fs.writeFileSync(path.join(categoryDir, 'README.md'), overview);

    // Individual tool docs
    for (const tool of categoryTools) {
      const doc = generateToolDocumentation(tool);
      fs.writeFileSync(path.join(categoryDir, `${tool.name}.md`), doc);
      totalTools++;
    }

    console.log(`✅ Generated ${categoryTools.length} docs for ${category}`);
  }

  // Create main index
  const indexContent = generateMainIndex(toolsByCategory, totalTools);
  fs.writeFileSync(path.join(docsDir, 'README.md'), indexContent);

  console.log(
    `\n📄 Generated documentation for ${totalTools} tools from MCP implementation`
  );

  // Compress
  console.log('\n📦 Compressing documentation...');

  await tar.create(
    {
      gzip: true,
      file: outputFile,
      cwd: path.dirname(docsDir),
    },
    ['tool-docs']
  );

  // Cleanup
  fs.rmSync(docsDir, { recursive: true });

  const stats = fs.statSync(outputFile);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

  console.log(`✅ Created tool-docs.tar.gz (${sizeMB} MB)`);
  console.log('\n🎉 Documentation generation complete!');
  console.log(
    '📌 Documentation is 100% based on MCP tool implementations, NOT the API'
  );
}

// Generate main index
function generateMainIndex(
  toolsByCategory: Record<string, any[]>,
  totalTools: number
): string {
  let content = '# Productboard MCP Server Documentation\n\n';
  content += `Complete documentation for all ${totalTools} tools in the Productboard MCP server.\n\n`;

  content += `## Important Note\n\n`;
  content += `This documentation is generated directly from the MCP server tool implementations.\n`;
  content += `It reflects EXACTLY what parameters the MCP tools accept, NOT what the Productboard REST API expects.\n\n`;

  content += `## Overview\n\n`;
  content += `- **Total Tools**: ${totalTools}\n`;
  content += `- **Categories**: ${Object.keys(toolsByCategory).length}\n`;
  content += `- **Generated**: ${new Date().toISOString()}\n`;
  content += `- **Source**: MCP tool implementations (NOT OpenAPI spec)\n\n`;

  content += '## Categories\n\n';

  Object.entries(toolsByCategory)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([category, tools]) => {
      const displayName = category
        .split('-')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
      content += `### [${displayName}](./${category}/)\n`;
      content += `${tools.length} tools available\n\n`;
    });

  content += '## Using These Tools\n\n';
  content +=
    'When calling MCP tools, use the exact parameter names and types shown in this documentation.\n';
  content +=
    'The parameters here match what the MCP server expects, which may differ from the REST API.\n';

  return content;
}

// Run
generateDocumentation().catch(console.error);
