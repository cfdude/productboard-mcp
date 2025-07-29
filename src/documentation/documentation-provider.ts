/**
 * Documentation provider for MCP prompts and resources
 */
import {
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ReadResourceRequestSchema,
  ListResourcesRequestSchema,
  Prompt,
} from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  toolDocumentation,
  parameterDocumentation,
  categoryDocumentation,
  ToolDocumentation,
} from './tool-documentation.js';
import {
  generatedToolDocumentation,
  mergeDocumentation,
} from '../../generated/tool-documentation.js';

export class DocumentationProvider {
  private server: Server;
  private mergedDocumentation: Record<string, ToolDocumentation> | null = null;

  constructor(server: Server) {
    this.server = server;
    // Merge manual and generated documentation
    this.mergedDocumentation = mergeDocumentation(
      toolDocumentation,
      generatedToolDocumentation
    );
    this.setupPrompts();
    this.setupResources();
  }

  private setupPrompts() {
    // List available prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
      prompts: [
        {
          name: 'tool-help',
          description: 'Get comprehensive help for a specific tool',
          arguments: [
            {
              name: 'tool',
              description:
                'Name of the tool (e.g., create_note, list_features)',
              required: true,
            },
          ],
        },
        {
          name: 'category-guide',
          description: 'Get a guide for all tools in a category',
          arguments: [
            {
              name: 'category',
              description: 'Category name (e.g., notes, features, companies)',
              required: true,
            },
          ],
        },
        {
          name: 'workflow-examples',
          description: 'Get workflow examples for common tasks',
          arguments: [
            {
              name: 'workflow',
              description:
                'Workflow type (e.g., feedback-to-feature, release-planning)',
              required: false,
            },
          ],
        },
        {
          name: 'parameter-help',
          description: 'Get detailed help for common parameters',
          arguments: [
            {
              name: 'parameter',
              description: 'Parameter name (e.g., detail, limit, dateFrom)',
              required: false,
            },
          ],
        },
        {
          name: 'quick-start',
          description: 'Get a quick start guide for using Productboard MCP',
          arguments: [],
        },
      ],
    }));

    // Handle prompt requests
    this.server.setRequestHandler(GetPromptRequestSchema, async request => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'tool-help':
          return this.getToolHelpPrompt(args?.tool as string);

        case 'category-guide':
          return this.getCategoryGuidePrompt(args?.category as string);

        case 'workflow-examples':
          return this.getWorkflowPrompt(args?.workflow as string);

        case 'parameter-help':
          return this.getParameterHelpPrompt(args?.parameter as string);

        case 'quick-start':
          return this.getQuickStartPrompt();

        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    });
  }

  private setupResources() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'productboard://docs/tools',
          name: 'All Tools Documentation',
          description: 'Complete documentation for all available tools',
          mimeType: 'text/markdown',
        },
        {
          uri: 'productboard://docs/examples',
          name: 'Tool Examples Collection',
          description: 'Comprehensive examples for all tools',
          mimeType: 'text/markdown',
        },
        {
          uri: 'productboard://docs/errors',
          name: 'Common Errors Guide',
          description: 'Troubleshooting guide for common errors',
          mimeType: 'text/markdown',
        },
        {
          uri: 'productboard://docs/best-practices',
          name: 'Best Practices Guide',
          description: 'Best practices for using Productboard MCP effectively',
          mimeType: 'text/markdown',
        },
        {
          uri: 'productboard://docs/cheatsheet',
          name: 'Quick Reference Cheatsheet',
          description: 'Quick reference for common operations',
          mimeType: 'text/markdown',
        },
      ],
    }));

    // Handle resource requests
    this.server.setRequestHandler(ReadResourceRequestSchema, async request => {
      const { uri } = request.params;

      switch (uri) {
        case 'productboard://docs/tools':
          return {
            contents: [
              {
                uri,
                mimeType: 'text/markdown',
                text: this.generateAllToolsDocumentation(),
              },
            ],
          };

        case 'productboard://docs/examples':
          return {
            contents: [
              {
                uri,
                mimeType: 'text/markdown',
                text: this.generateExamplesCollection(),
              },
            ],
          };

        case 'productboard://docs/errors':
          return {
            contents: [
              {
                uri,
                mimeType: 'text/markdown',
                text: this.generateErrorsGuide(),
              },
            ],
          };

        case 'productboard://docs/best-practices':
          return {
            contents: [
              {
                uri,
                mimeType: 'text/markdown',
                text: this.generateBestPracticesGuide(),
              },
            ],
          };

        case 'productboard://docs/cheatsheet':
          return {
            contents: [
              {
                uri,
                mimeType: 'text/markdown',
                text: this.generateCheatsheet(),
              },
            ],
          };

        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });
  }

  private getToolHelpPrompt(toolName: string): { prompt: Prompt } {
    const docs = this.mergedDocumentation || toolDocumentation;
    const doc = docs[toolName];
    if (!doc) {
      return {
        prompt: {
          name: 'tool-help',
          description: `No documentation found for tool: ${toolName}`,
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `I couldn't find documentation for the tool "${toolName}". 

Available tools include:
${Object.keys(toolDocumentation).join(', ')}

Please check the tool name and try again.`,
              },
            },
          ],
        },
      };
    }

    const content = this.formatToolDocumentation(toolName, doc);

    return {
      prompt: {
        name: 'tool-help',
        description: `Comprehensive help for ${toolName}`,
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Here's comprehensive documentation for the ${toolName} tool:\n\n${content}`,
            },
          },
        ],
      },
    };
  }

  private getCategoryGuidePrompt(category: string): { prompt: Prompt } {
    const categoryDoc =
      categoryDocumentation[category as keyof typeof categoryDocumentation];
    if (!categoryDoc) {
      return {
        prompt: {
          name: 'category-guide',
          description: `No documentation found for category: ${category}`,
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Category "${category}" not found. Available categories: ${Object.keys(categoryDocumentation).join(', ')}`,
              },
            },
          ],
        },
      };
    }

    const tools = Object.entries(toolDocumentation)
      .filter(([name]) => name.toLowerCase().includes(category.slice(0, -1)))
      .map(([name, doc]) => `### ${name}\n${doc.description}\n`)
      .join('\n');

    const content = `# ${categoryDoc.name}

${categoryDoc.description}

## Overview
${categoryDoc.overview}

## Available Tools
${tools}

## Common Workflows
${categoryDoc.commonWorkflows
  .map(
    (wf: any) => `
### ${wf.name}
${wf.steps.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}
`
  )
  .join('\n')}`;

    return {
      prompt: {
        name: 'category-guide',
        description: `Guide for ${categoryDoc.name}`,
        messages: [
          {
            role: 'user',
            content: { type: 'text', text: content },
          },
        ],
      },
    };
  }

  private getWorkflowPrompt(workflow?: string): { prompt: Prompt } {
    const workflows: Record<string, any> = {
      'feedback-to-feature': {
        title: 'Feedback to Feature Workflow',
        steps: [
          {
            step: 'Collect Feedback',
            tool: 'create_note',
            example: {
              title: 'Customer request from support ticket',
              content: 'Customer wants ability to export data as PDF',
              tags: ['export', 'feature-request'],
              user: { email: 'customer@example.com' },
            },
          },
          {
            step: 'Find Similar Feedback',
            tool: 'list_notes',
            example: {
              term: 'export PDF',
              tags: ['export'],
              limit: 50,
            },
          },
          {
            step: 'Create Feature',
            tool: 'create_feature',
            example: {
              name: 'PDF Export Functionality',
              description:
                'Enable users to export reports and data as PDF files',
              priority: 7.5,
              effort: 8,
            },
          },
          {
            step: 'Link Feedback to Feature',
            tool: 'link_note_to_feature',
            example: {
              noteId: 'note_123',
              featureId: 'feat_456',
            },
          },
        ],
      },
      'release-planning': {
        title: 'Release Planning Workflow',
        steps: [
          {
            step: 'Create Release',
            tool: 'create_release',
            example: {
              name: 'Q1 2025 Release',
              startDate: '2025-01-01',
              endDate: '2025-03-31',
            },
          },
          {
            step: 'Find Candidate Features',
            tool: 'list_features',
            example: {
              status: 'candidate',
              priority: { min: 7 },
              effort: { max: 13 },
            },
          },
          {
            step: 'Assign Features to Release',
            tool: 'assign_feature_to_release',
            example: {
              featureId: 'feat_789',
              releaseId: 'rel_123',
            },
          },
        ],
      },
    };

    if (!workflow) {
      const available = Object.keys(workflows).join('\n- ');
      return {
        prompt: {
          name: 'workflow-examples',
          description: 'Available workflows',
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Available workflows:\n- ${available}\n\nUse workflow-examples with a specific workflow name to see detailed steps.`,
              },
            },
          ],
        },
      };
    }

    const wf = workflows[workflow as keyof typeof workflows];
    if (!wf) {
      return {
        prompt: {
          name: 'workflow-examples',
          description: 'Workflow not found',
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Workflow "${workflow}" not found.`,
              },
            },
          ],
        },
      };
    }

    const content = `# ${wf.title}

${wf.steps
  .map(
    (step: any, i: number) => `
## Step ${i + 1}: ${step.step}

**Tool**: \`${step.tool}\`

**Example**:
\`\`\`json
${JSON.stringify(step.example, null, 2)}
\`\`\`
`
  )
  .join('\n')}`;

    return {
      prompt: {
        name: 'workflow-examples',
        description: wf.title,
        messages: [
          {
            role: 'user',
            content: { type: 'text', text: content },
          },
        ],
      },
    };
  }

  private getParameterHelpPrompt(parameter?: string): { prompt: Prompt } {
    if (!parameter) {
      const params = Object.keys(parameterDocumentation).join('\n- ');
      return {
        prompt: {
          name: 'parameter-help',
          description: 'Available parameters',
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Common parameters:\n- ${params}\n\nUse parameter-help with a specific parameter name for detailed information.`,
              },
            },
          ],
        },
      };
    }

    const paramDoc =
      parameterDocumentation[parameter as keyof typeof parameterDocumentation];
    if (!paramDoc) {
      return {
        prompt: {
          name: 'parameter-help',
          description: 'Parameter not found',
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Parameter "${parameter}" not documented.`,
              },
            },
          ],
        },
      };
    }

    const content = `# Parameter: ${parameter}

**Description**: ${paramDoc.description}
**Type**: ${paramDoc.type}

${
  'values' in paramDoc && paramDoc.values
    ? `## Values\n${Object.entries(paramDoc.values)
        .map(([k, v]) => `- **${k}**: ${v}`)
        .join('\n')}`
    : ''
}

${
  'constraints' in paramDoc && paramDoc.constraints
    ? `## Constraints\n${Object.entries(paramDoc.constraints)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n')}`
    : ''
}

${'notes' in paramDoc && paramDoc.notes ? `## Notes\n${paramDoc.notes}` : ''}

## Examples
${paramDoc.examples.map((ex: any) => `- **${ex.value}**: ${ex.useCase}`).join('\n')}`;

    return {
      prompt: {
        name: 'parameter-help',
        description: `Help for parameter: ${parameter}`,
        messages: [
          {
            role: 'user',
            content: { type: 'text', text: content },
          },
        ],
      },
    };
  }

  private getQuickStartPrompt(): { prompt: Prompt } {
    const content = `# Productboard MCP Quick Start Guide

## 🚀 Getting Started

### 1. Basic Operations

**Create a note (customer feedback)**:
\`\`\`json
{
  "tool": "create_note",
  "arguments": {
    "title": "Feature request: Dark mode",
    "content": "Customer wants dark mode for better night usage",
    "tags": ["ui", "enhancement"],
    "user": { "email": "customer@example.com" }
  }
}
\`\`\`

**Search for features**:
\`\`\`json
{
  "tool": "list_features",
  "arguments": {
    "term": "dashboard",
    "status": "in-progress",
    "detail": "standard"
  }
}
\`\`\`

**Create a company**:
\`\`\`json
{
  "tool": "create_company", 
  "arguments": {
    "name": "Acme Corp",
    "domain": "acme.com"
  }
}
\`\`\`

### 2. Key Concepts

- **Notes**: Customer feedback and insights
- **Features**: Items on your roadmap
- **Companies**: Customer accounts
- **Releases**: Time-based feature groupings
- **Objectives**: Strategic goals

### 3. Common Parameters

- **detail**: Control response size ("basic", "standard", "full")
- **limit/offset**: Pagination (max 100 per request)
- **dateFrom/dateTo**: Filter by date range (ISO 8601 format)
- **tags**: Categorize and filter items

### 4. Pro Tips

1. Start with "basic" detail level for performance
2. Use search terms to filter large datasets
3. Implement pagination for bulk operations
4. Link feedback to features for traceability
5. Use tags consistently across your team

### 5. Get More Help

- Use \`tool-help\` prompt for detailed tool documentation
- Use \`category-guide\` prompt for category overviews
- Use \`workflow-examples\` prompt for step-by-step guides
- Check resources for comprehensive documentation`;

    return {
      prompt: {
        name: 'quick-start',
        description: 'Quick start guide for Productboard MCP',
        messages: [
          {
            role: 'user',
            content: { type: 'text', text: content },
          },
        ],
      },
    };
  }

  private formatToolDocumentation(
    toolName: string,
    doc: ToolDocumentation
  ): string {
    let content = `# Tool: ${toolName}\n\n`;
    content += `**Description**: ${doc.description}\n\n`;

    if (doc.detailedDescription) {
      content += `## Detailed Description\n${doc.detailedDescription}\n\n`;
    }

    content += `## Examples\n\n`;
    doc.examples.forEach((example: any, i: number) => {
      content += `### Example ${i + 1}: ${example.title}\n`;
      content += `${example.description}\n\n`;
      content += `**Input**:\n\`\`\`json\n${JSON.stringify(example.input, null, 2)}\n\`\`\`\n\n`;

      if (example.expectedOutput) {
        content += `**Expected Output**:\n\`\`\`json\n${JSON.stringify(example.expectedOutput, null, 2)}\n\`\`\`\n\n`;
      }

      if (example.notes) {
        content += `**Notes**: ${example.notes}\n\n`;
      }
    });

    if (doc.commonErrors && doc.commonErrors.length > 0) {
      content += `## Common Errors\n\n`;
      doc.commonErrors.forEach(error => {
        content += `### ${error.error}\n`;
        content += `- **Cause**: ${error.cause}\n`;
        content += `- **Solution**: ${error.solution}\n\n`;
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

  private generateAllToolsDocumentation(): string {
    const docs = this.mergedDocumentation || toolDocumentation;

    // Debug what's actually available
    const availableKeys = Object.keys(docs);

    let content = '# Productboard MCP Tools Documentation\n\n';
    content += 'Complete documentation for all available tools.\n\n';
    content += `<!-- Found ${availableKeys.length} documented tools: ${availableKeys.join(', ')} -->\n\n`;
    content += '## Table of Contents\n\n';

    Object.keys(docs).forEach(tool => {
      content += `- [${tool}](#${tool.replace(/_/g, '-')})\n`;
    });
    content += '\n---\n\n';

    Object.entries(docs).forEach(([toolName, doc]) => {
      content += this.formatToolDocumentation(toolName, doc);
      content += '\n---\n\n';
    });

    return content;
  }

  private generateExamplesCollection(): string {
    let content = '# Productboard MCP Examples Collection\n\n';
    content +=
      'Comprehensive examples for all tools organized by use case.\n\n';

    Object.entries(toolDocumentation).forEach(([toolName, doc]) => {
      content += `## ${toolName}\n\n`;
      doc.examples.forEach(example => {
        content += `### ${example.title}\n`;
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
      });
    });

    return content;
  }

  private generateErrorsGuide(): string {
    let content = '# Common Errors Guide\n\n';
    content += 'Troubleshooting guide for common errors across all tools.\n\n';

    const allErrors: { tool: string; error: any }[] = [];
    Object.entries(toolDocumentation).forEach(([toolName, doc]) => {
      if (doc.commonErrors) {
        doc.commonErrors.forEach(error => {
          allErrors.push({ tool: toolName, error });
        });
      }
    });

    // Group by error type
    const errorGroups = allErrors.reduce(
      (acc, { tool, error }) => {
        const key = error.error;
        if (!acc[key]) acc[key] = [];
        acc[key].push({ tool, ...error });
        return acc;
      },
      {} as Record<string, any[]>
    );

    Object.entries(errorGroups).forEach(([errorType, errors]) => {
      content += `## ${errorType}\n\n`;
      errors.forEach(({ tool, cause, solution }) => {
        content += `### In ${tool}\n`;
        content += `- **Cause**: ${cause}\n`;
        content += `- **Solution**: ${solution}\n\n`;
      });
    });

    return content;
  }

  private generateBestPracticesGuide(): string {
    let content = '# Best Practices Guide\n\n';
    content += 'Best practices for using Productboard MCP effectively.\n\n';

    content += '## General Best Practices\n\n';
    content +=
      '1. **Use appropriate detail levels**: Start with "basic" for performance\n';
    content +=
      '2. **Implement pagination**: Use limit/offset for large datasets\n';
    content +=
      '3. **Cache responses**: Store frequently accessed data locally\n';
    content +=
      '4. **Handle errors gracefully**: Implement retry logic for transient failures\n';
    content +=
      "5. **Use consistent naming**: Follow your team's conventions\n\n";

    Object.entries(categoryDocumentation).forEach(([category, doc]) => {
      content += `## ${doc.name} Best Practices\n\n`;
      const toolsInCategory = Object.entries(toolDocumentation).filter(
        ([name]) => name.toLowerCase().includes(category.slice(0, -1))
      );

      const practices = new Set<string>();
      toolsInCategory.forEach(([_, toolDoc]) => {
        if (toolDoc.bestPractices) {
          toolDoc.bestPractices.forEach(p => practices.add(p));
        }
      });

      Array.from(practices).forEach(practice => {
        content += `- ${practice}\n`;
      });
      content += '\n';
    });

    return content;
  }

  private generateCheatsheet(): string {
    const content = `# Productboard MCP Cheatsheet

## 🔥 Most Common Operations

### Create Note (Feedback)
\`create_note\` - { title, content, tags[], user: {email} }

### Search Notes
\`list_notes\` - { term, tags[], dateFrom, limit }

### Create Feature
\`create_feature\` - { name, description, priority, effort }

### List Features  
\`list_features\` - { status, detail, limit }

### Create Company
\`create_company\` - { name, domain }

### Create Release
\`create_release\` - { name, startDate, endDate }

## 📊 Common Parameters

| Parameter | Values | Default | Notes |
|-----------|--------|---------|-------|
| detail | basic, standard, full | standard | Response detail level |
| limit | 1-100 | 100 | Items per request |
| offset | 0+ | 0 | For pagination |
| includeSubData | true/false | false | Include nested data |

## 📅 Date Formats
- Date: \`2025-01-19\` (YYYY-MM-DD)
- DateTime: \`2025-01-19T10:30:00Z\` (ISO 8601)

## 🏷️ Status Values
- Features: new, candidate, planned, in-progress, released
- Notes: active, processed, archived

## 🔗 Linking Operations
- \`link_note_to_feature\` - Connect feedback to features
- \`assign_feature_to_release\` - Add to release
- \`link_feature_to_objective\` - Align with goals

## ⚡ Performance Tips
1. Use \`detail: "basic"\` for lists
2. Limit to 25-50 items for UI display
3. Cache company/user lookups
4. Batch operations when possible`;

    return content;
  }
}

// Export a setup function to be called from the main server
export function setupDocumentation(server: Server) {
  new DocumentationProvider(server);
}
