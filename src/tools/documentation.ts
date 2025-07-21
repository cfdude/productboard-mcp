/**
 * Documentation access tool
 */
import { withContext, formatResponse } from '../utils/tool-wrapper.js';
import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  toolDocumentation,
  categoryDocumentation,
  parameterDocumentation,
} from '../documentation/tool-documentation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Setup documentation tool definitions
 */
export function setupDocumentationTools() {
  return [
    {
      name: 'get_docs',
      description: `Access comprehensive documentation for Productboard MCP

This tool provides access to various documentation resources including:
- Tool examples with detailed usage patterns
- Tool categories and their descriptions
- Parameter documentation
- Best practices and workflows
- README and quick start guides
- Cheat sheets and quick references

Use this tool to understand how to effectively use any Productboard MCP functionality.`,
      inputSchema: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: [
              'tool-examples',
              'tool-categories',
              'parameter-guide',
              'best-practices',
              'workflows',
              'cheatsheet',
              'readme',
              'tool-help',
              'all-tools',
            ],
            description: `Type of documentation to retrieve:
- tool-examples: Comprehensive examples for all tools
- tool-categories: Overview of tool categories and their purposes
- parameter-guide: Detailed guide for common parameters
- best-practices: Best practices for using the MCP server
- workflows: Step-by-step workflow examples
- cheatsheet: Quick reference guide
- readme: Main README file
- tool-help: Detailed help for a specific tool (requires toolName)
- all-tools: Complete documentation for all tools`,
          },
          toolName: {
            type: 'string',
            description:
              'Specific tool name (required only when type is "tool-help")',
          },
          category: {
            type: 'string',
            description:
              'Filter by category (optional, e.g., "notes", "features", "companies")',
          },
          format: {
            type: 'string',
            enum: ['markdown', 'json'],
            default: 'markdown',
            description: 'Output format (default: markdown)',
          },
        },
        required: ['type'],
      },
      handler: async (args: any) => {
        return withContext(async _context => {
          const { type, toolName, category, format = 'markdown' } = args;

          try {
            let content: string;

            switch (type) {
              case 'tool-examples':
                content = generateToolExamples(category);
                break;

              case 'tool-categories':
                content = generateCategoryDocumentation();
                break;

              case 'parameter-guide':
                content = generateParameterGuide();
                break;

              case 'best-practices':
                content = generateBestPractices();
                break;

              case 'workflows':
                content = generateWorkflows();
                break;

              case 'cheatsheet':
                content = generateCheatsheet();
                break;

              case 'readme':
                content = getReadmeContent();
                break;

              case 'tool-help':
                if (!toolName) {
                  throw new Error(
                    'toolName is required when type is "tool-help"'
                  );
                }
                content = getGeneratedToolHelp(toolName);
                break;

              case 'all-tools':
                content = generateAllToolsDocumentation();
                break;

              default:
                throw new Error(`Unknown documentation type: ${type}`);
            }

            if (format === 'json') {
              return formatResponse({
                type,
                content,
                metadata: {
                  generated: new Date().toISOString(),
                  version: '1.0.0',
                },
              });
            }

            return formatResponse(content);
          } catch (error: any) {
            throw {
              code: ErrorCode.InvalidRequest,
              message: `Failed to retrieve documentation: ${error.message}`,
            };
          }
        });
      },
    },
  ];
}

/**
 * Handle documentation tool requests
 */
export async function handleDocumentationTool(
  tool: string,
  args: Record<string, any>
) {
  const toolDef = setupDocumentationTools().find(t => t.name === tool);
  if (!toolDef) {
    throw new Error(`Unknown documentation tool: ${tool}`);
  }

  return await (toolDef.handler as any)(args);
}

function generateToolExamples(category?: string): string {
  let content = '# Productboard MCP Tool Examples\n\n';

  if (category) {
    content += `Examples for ${category} tools.\n\n`;
  } else {
    content +=
      'Comprehensive examples for all tools organized by category.\n\n';
  }

  // Group tools by category
  const toolsByCategory: Record<string, Array<[string, any]>> = {
    notes: [],
    features: [],
    companies: [],
    releases: [],
    objectives: [],
    other: [],
  };

  Object.entries(toolDocumentation).forEach(([toolName, doc]) => {
    let matched = false;
    for (const cat of Object.keys(toolsByCategory)) {
      if (toolName.includes(cat.slice(0, -1))) {
        toolsByCategory[cat].push([toolName, doc]);
        matched = true;
        break;
      }
    }
    if (!matched) {
      toolsByCategory.other.push([toolName, doc]);
    }
  });

  // Filter by category if specified
  const categoriesToShow = category
    ? [category]
    : Object.keys(toolsByCategory).filter(
        cat => toolsByCategory[cat].length > 0
      );

  categoriesToShow.forEach(cat => {
    if (!toolsByCategory[cat] || toolsByCategory[cat].length === 0) return;

    const catDoc =
      categoryDocumentation[cat as keyof typeof categoryDocumentation];
    if (catDoc) {
      content += `## ${catDoc.name}\n\n`;
      content += `${catDoc.description}\n\n`;
    } else {
      content += `## ${cat.charAt(0).toUpperCase() + cat.slice(1)}\n\n`;
    }

    toolsByCategory[cat].forEach(([toolName, doc]) => {
      content += `### ${toolName}\n\n`;
      content += `${doc.description}\n\n`;

      doc.examples.forEach((example: any, i: number) => {
        content += `#### Example ${i + 1}: ${example.title}\n\n`;
        content += `${example.description}\n\n`;
        content += '```json\n';
        content += JSON.stringify(
          {
            tool: toolName,
            arguments: example.input,
          },
          null,
          2
        );
        content += '\n```\n\n';

        if (example.expectedOutput) {
          content += '**Expected Response:**\n```json\n';
          content += JSON.stringify(example.expectedOutput, null, 2);
          content += '\n```\n\n';
        }

        if (example.notes) {
          content += `> **Note:** ${example.notes}\n\n`;
        }
      });
    });
  });

  return content;
}

function generateCategoryDocumentation(): string {
  let content = '# Productboard MCP Tool Categories\n\n';
  content +=
    'Tools are organized into logical categories for easier discovery and use.\n\n';

  Object.entries(categoryDocumentation).forEach(([key, category]) => {
    content += `## ${category.name}\n\n`;
    content += `${category.description}\n\n`;
    content += category.overview.trim() + '\n\n';

    if (category.commonWorkflows && category.commonWorkflows.length > 0) {
      content += '### Common Workflows\n\n';
      category.commonWorkflows.forEach(workflow => {
        content += `#### ${workflow.name}\n\n`;
        workflow.steps.forEach((step, i) => {
          content += `${i + 1}. ${step}\n`;
        });
        content += '\n';
      });
    }

    // List tools in this category
    const toolsInCategory = Object.entries(toolDocumentation)
      .filter(([name]) => name.toLowerCase().includes(key.slice(0, -1)))
      .map(([name, doc]) => ({ name, description: doc.description }));

    if (toolsInCategory.length > 0) {
      content += '### Available Tools\n\n';
      toolsInCategory.forEach(tool => {
        content += `- **${tool.name}**: ${tool.description}\n`;
      });
      content += '\n';
    }
  });

  return content;
}

function generateParameterGuide(): string {
  let content = '# Parameter Guide\n\n';
  content +=
    'Detailed documentation for common parameters used across multiple tools.\n\n';

  Object.entries(parameterDocumentation).forEach(([paramName, param]) => {
    content += `## ${paramName}\n\n`;
    content += `**Description:** ${param.description}\n\n`;
    content += `**Type:** ${param.type}\n\n`;

    if ('format' in param && param.format) {
      content += `**Format:** ${param.format}\n\n`;
    }

    if ('values' in param && param.values) {
      content += '### Possible Values\n\n';
      Object.entries(param.values).forEach(([value, desc]) => {
        content += `- **${value}**: ${desc}\n`;
      });
      content += '\n';
    }

    if ('constraints' in param && param.constraints) {
      content += '### Constraints\n\n';
      Object.entries(param.constraints).forEach(([constraint, value]) => {
        content += `- **${constraint}**: ${value}\n`;
      });
      content += '\n';
    }

    if ('notes' in param && param.notes) {
      content += `### Notes\n\n${param.notes}\n\n`;
    }

    if (param.examples && param.examples.length > 0) {
      content += '### Examples\n\n';
      param.examples.forEach(ex => {
        content += `- \`${ex.value}\`: ${ex.useCase}\n`;
      });
      content += '\n';
    }
  });

  return content;
}

function generateBestPractices(): string {
  let content = '# Best Practices Guide\n\n';
  content += 'Best practices for using Productboard MCP effectively.\n\n';

  content += '## General Best Practices\n\n';
  content +=
    '1. **Use appropriate detail levels**: Start with "basic" for performance, use "full" only when needed\n';
  content +=
    '2. **Implement pagination**: Use limit/offset for large datasets (max 100 items per request)\n';
  content +=
    '3. **Cache responses**: Store frequently accessed data like companies and users locally\n';
  content +=
    '4. **Handle errors gracefully**: Implement retry logic with exponential backoff\n';
  content +=
    "5. **Use consistent naming**: Follow your team's conventions for tags and labels\n";
  content +=
    '6. **Link related entities**: Connect notes to features, features to releases\n';
  content +=
    '7. **Use date filters**: Narrow results to relevant time periods\n';
  content +=
    '8. **Batch operations**: Group related API calls when possible\n\n';

  // Collect best practices from all tools
  const allPractices: Record<string, Set<string>> = {};

  Object.entries(toolDocumentation).forEach(([toolName, doc]) => {
    if (doc.bestPractices) {
      doc.bestPractices.forEach(practice => {
        // Categorize by tool type
        const category = toolName.split('_')[0];
        if (!allPractices[category]) {
          allPractices[category] = new Set();
        }
        allPractices[category].add(practice);
      });
    }
  });

  Object.entries(allPractices).forEach(([category, practices]) => {
    content += `## ${category.charAt(0).toUpperCase() + category.slice(1)} Best Practices\n\n`;
    Array.from(practices).forEach(practice => {
      content += `- ${practice}\n`;
    });
    content += '\n';
  });

  return content;
}

function generateWorkflows(): string {
  let content = '# Common Workflows\n\n';
  content += 'Step-by-step guides for common product management workflows.\n\n';

  const workflows = [
    {
      title: 'Feedback to Feature Workflow',
      description: 'Transform customer feedback into roadmap features',
      steps: [
        {
          step: 'Collect Customer Feedback',
          tool: 'create_note',
          description: 'Import feedback from various sources',
          example: {
            title: 'Mobile app performance issue',
            content: 'App crashes when uploading large files',
            tags: ['bug', 'mobile', 'high-priority'],
            user: { email: 'customer@example.com' },
          },
        },
        {
          step: 'Find Related Feedback',
          tool: 'list_notes',
          description: 'Search for similar feedback to understand scope',
          example: {
            term: 'crash upload',
            tags: ['mobile'],
            dateFrom: '2024-01-01',
          },
        },
        {
          step: 'Create Feature',
          tool: 'create_feature',
          description: 'Create a feature to address the feedback',
          example: {
            name: 'Improve file upload reliability',
            description:
              'Fix crashes and improve performance for large file uploads',
            priority: 8.5,
            effort: 13,
            status: 'candidate',
          },
        },
        {
          step: 'Link Feedback',
          tool: 'link_note_to_feature',
          description: 'Connect all related feedback to the feature',
          example: {
            noteId: 'note_123',
            featureId: 'feat_456',
          },
        },
      ],
    },
    {
      title: 'Release Planning Workflow',
      description: 'Plan and manage product releases',
      steps: [
        {
          step: 'Create Release',
          tool: 'create_release',
          description: 'Define the release timeline',
          example: {
            name: 'Q1 2025 Release',
            description: 'Major performance improvements and bug fixes',
            startDate: '2025-01-01',
            endDate: '2025-03-31',
          },
        },
        {
          step: 'Find Candidate Features',
          tool: 'list_features',
          description: 'Identify features ready for release',
          example: {
            status: 'candidate',
            detail: 'standard',
            limit: 50,
          },
        },
        {
          step: 'Prioritize Features',
          tool: 'list_features',
          description: 'Filter by priority and effort',
          example: {
            status: 'candidate',
            minPriority: 7,
            maxEffort: 13,
          },
        },
        {
          step: 'Assign to Release',
          tool: 'update_feature_release_assignment',
          description: 'Add features to the release',
          example: {
            featureId: 'feat_789',
            releaseId: 'rel_123',
          },
        },
      ],
    },
    {
      title: 'Customer Segmentation Workflow',
      description: 'Analyze feedback by customer segment',
      steps: [
        {
          step: 'Create Company',
          tool: 'create_company',
          description: 'Set up company with segmentation data',
          example: {
            name: 'Enterprise Customer Inc',
            domain: 'enterprise.com',
            customFields: {
              tier: 'enterprise',
              arr: '500000',
              industry: 'finance',
            },
          },
        },
        {
          step: 'Get Company Feedback',
          tool: 'list_notes',
          description: 'Retrieve all feedback from the company',
          example: {
            companyId: 'comp_123',
            detail: 'full',
          },
        },
        {
          step: 'Analyze by Segment',
          tool: 'list_companies',
          description: 'Compare feedback across segments',
          example: {
            customField: 'tier',
            customFieldValue: 'enterprise',
          },
        },
      ],
    },
  ];

  workflows.forEach(workflow => {
    content += `## ${workflow.title}\n\n`;
    content += `${workflow.description}\n\n`;

    workflow.steps.forEach((step, i) => {
      content += `### Step ${i + 1}: ${step.step}\n\n`;
      content += `**Tool:** \`${step.tool}\`\n\n`;
      content += `${step.description}\n\n`;
      content += '**Example:**\n```json\n';
      content += JSON.stringify(
        {
          tool: step.tool,
          arguments: step.example,
        },
        null,
        2
      );
      content += '\n```\n\n';
    });
  });

  return content;
}

function generateCheatsheet(): string {
  return `# Productboard MCP Cheatsheet

## 🚀 Quick Reference

### Most Common Tools

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| \`create_note\` | Add customer feedback | title, content, tags, user |
| \`list_notes\` | Search feedback | term, tags, dateFrom, limit |
| \`create_feature\` | Add to roadmap | name, description, priority, effort |
| \`list_features\` | Find features | status, term, detail |
| \`create_company\` | Add customer | name, domain |
| \`create_release\` | Plan release | name, startDate, endDate |

### Common Parameters

| Parameter | Values | Default | Usage |
|-----------|--------|---------|--------|
| \`detail\` | basic, standard, full | standard | Response detail level |
| \`limit\` | 1-100 | 100 | Items per page |
| \`offset\` | 0+ | 0 | Pagination offset |
| \`includeSubData\` | true/false | false | Include nested data |
| \`dateFrom/To\` | YYYY-MM-DD | - | Date filtering |

### Status Values

**Features:**
- new
- candidate  
- planned
- in-progress
- released

**Notes:**
- active
- processed
- archived

### Quick Examples

#### Get Recent High-Priority Feedback
\`\`\`json
{
  "tool": "list_notes",
  "arguments": {
    "tags": ["high-priority"],
    "dateFrom": "2025-01-01",
    "limit": 25
  }
}
\`\`\`

#### Create Feature from Feedback
\`\`\`json
{
  "tool": "create_feature",
  "arguments": {
    "name": "Dark mode support",
    "description": "Enable dark theme",
    "priority": 8,
    "effort": 5
  }
}
\`\`\`

#### Find In-Progress Features
\`\`\`json
{
  "tool": "list_features",
  "arguments": {
    "status": "in-progress",
    "detail": "basic"
  }
}
\`\`\`

### Performance Tips

1. Use \`detail: "basic"\` for lists
2. Paginate with \`limit: 25\` for UI
3. Cache company/user lookups
4. Filter by date to reduce results
5. Use search terms to narrow scope

### Error Codes

| Code | Meaning | Action |
|------|---------|---------|
| 400 | Bad request | Check parameters |
| 401 | Unauthorized | Check API token |
| 404 | Not found | Verify IDs exist |
| 429 | Rate limited | Retry with backoff |`;
}

function generateToolHelp(toolName: string): string {
  const doc = toolDocumentation[toolName];
  if (!doc) {
    return `# Tool Not Found

The tool "${toolName}" was not found in the documentation.

Available tools include:
${Object.keys(toolDocumentation)
  .map(t => `- ${t}`)
  .join('\n')}

Use \`get_docs\` with \`type: "all-tools"\` to see documentation for all tools.`;
  }

  let content = `# Tool: ${toolName}\n\n`;
  content += `**Description:** ${doc.description}\n\n`;

  if (doc.detailedDescription) {
    content += `## Detailed Description\n${doc.detailedDescription.trim()}\n\n`;
  }

  content += `## Examples\n\n`;
  doc.examples.forEach((example, i) => {
    content += `### Example ${i + 1}: ${example.title}\n\n`;
    content += `${example.description}\n\n`;
    content += '**Request:**\n```json\n';
    content += JSON.stringify(
      {
        tool: toolName,
        arguments: example.input,
      },
      null,
      2
    );
    content += '\n```\n\n';

    if (example.expectedOutput) {
      content += '**Expected Response:**\n```json\n';
      content += JSON.stringify(example.expectedOutput, null, 2);
      content += '\n```\n\n';
    }

    if (example.notes) {
      content += `> **Note:** ${example.notes}\n\n`;
    }
  });

  if (doc.commonErrors && doc.commonErrors.length > 0) {
    content += `## Common Errors\n\n`;
    doc.commonErrors.forEach(error => {
      content += `### ${error.error}\n\n`;
      content += `- **Cause:** ${error.cause}\n`;
      content += `- **Solution:** ${error.solution}\n\n`;
    });
  }

  if (doc.bestPractices && doc.bestPractices.length > 0) {
    content += `## Best Practices\n\n`;
    doc.bestPractices.forEach(practice => {
      content += `- ${practice}\n`;
    });
    content += '\n';
  }

  if (doc.relatedTools && doc.relatedTools.length > 0) {
    content += `## Related Tools\n\n`;
    content += doc.relatedTools.map(tool => `- \`${tool}\``).join('\n');
    content += '\n';
  }

  return content;
}

function generateAllToolsDocumentation(): string {
  let content = '# All Tools Documentation\n\n';
  content += 'Complete documentation for all Productboard MCP tools.\n\n';
  content += '## Table of Contents\n\n';

  Object.keys(toolDocumentation).forEach(tool => {
    content += `- [${tool}](#${tool.replace(/_/g, '-')})\n`;
  });
  content += '\n---\n\n';

  Object.entries(toolDocumentation).forEach(([toolName, _doc]) => {
    content += generateToolHelp(toolName);
    content += '\n---\n\n';
  });

  return content;
}

function getReadmeContent(): string {
  try {
    const readmePath = join(dirname(__dirname), '..', 'README.md');
    if (existsSync(readmePath)) {
      return readFileSync(readmePath, 'utf-8');
    }
    return '# README not found\n\nThe README.md file could not be located.';
  } catch (error) {
    return `# Error reading README\n\nFailed to read README.md: ${error}`;
  }
}

function getGeneratedToolHelp(toolName: string): string {
  try {
    // First check if generated docs exist
    const generatedDir = join(dirname(__dirname), '..', 'generated');
    if (!existsSync(generatedDir)) {
      return generateToolHelp(toolName); // Fallback to old method
    }

    // Find the tool's documentation file
    const categories = readdirSync(generatedDir).filter((f: string) =>
      statSync(join(generatedDir, f)).isDirectory()
    );

    for (const category of categories) {
      const toolFile = join(generatedDir, category, `${toolName}.md`);
      if (existsSync(toolFile)) {
        return readFileSync(toolFile, 'utf-8');
      }
    }

    // If not found, fallback to old method or return not found
    const doc = toolDocumentation[toolName];
    if (doc) {
      return generateToolHelp(toolName);
    }

    return `# Tool Not Found

The tool "${toolName}" was not found in the documentation.

Use \`get_docs\` with \`type: "all-tools"\` to see documentation for all tools.`;
  } catch (error) {
    return `# Error reading tool documentation

Failed to read documentation for "${toolName}": ${error}`;
  }
}
