# Productboard MCP Script Generation

This directory contains scripts for generating tools and documentation from the Productboard OpenAPI specification.

## Automatic Generation

The generation scripts run automatically during the build process:

- `npm install` - Generates the manifest file
- `npm run build` - Generates all files (manifest + tools with documentation)

The `generated/` directory is created automatically and is not tracked in git.

## Scripts

### generate-manifest.ts

Parses the OpenAPI specification and generates a tool manifest (`generated/manifest.json`) that maps API operations to MCP tools.

### generate-tools.ts

The original tool generation script that creates basic tool implementations from the manifest.

### generate-tools-with-docs.ts

Enhanced tool generation script that creates tools with comprehensive documentation including:

- Detailed descriptions
- Multiple examples per tool
- Common errors and solutions
- Best practices
- Related tools

## Usage

### Generate Everything

```bash
npm run generate-all
```

This will:

1. Generate the manifest from OpenAPI spec
2. Generate tools with rich documentation

### Individual Scripts

```bash
# Generate just the manifest
npm run generate-manifest

# Generate tools with documentation
npm run generate-tools-with-docs

# Generate basic tools (legacy)
npm run generate-tools
```

## Generated Documentation

The enhanced script generates documentation that includes:

1. **Tool Descriptions**
   - Brief description (from OpenAPI summary)
   - Detailed description with context and use cases
   - Key capabilities specific to each operation

2. **Examples** (2-3 per tool)
   - Basic usage example
   - Advanced example with all fields
   - Search/filter examples for list operations

3. **Common Errors**
   - Authentication errors
   - Validation errors
   - Resource not found errors
   - Pagination errors

4. **Best Practices**
   - Performance optimization tips
   - Data handling recommendations
   - Workflow suggestions

5. **Related Tools**
   - Other CRUD operations for the same resource
   - Tools for related resources

## Output Files

- `generated/manifest.json` - Tool manifest mapping API operations to tools
- `generated/tool-documentation.ts` - Auto-generated documentation for all tools
- `generated/tools/*.ts` - Tool implementation files (if using dynamic loading)

## Customization

The documentation generation can be customized by modifying:

- `generateExample()` - Customize examples for each tool type
- `generateCommonErrors()` - Add tool-specific error cases
- `generateBestPractices()` - Add domain-specific best practices
- `getResourceContext()` - Provide context for each resource type

## Integration

The generated documentation integrates with the main documentation system:

1. Auto-generated docs are created in `generated/tool-documentation.ts`
2. Manual docs in `src/documentation/tool-documentation.ts` take precedence
3. The documentation provider merges both sources
4. Docs are accessible via MCP tools, prompts, and resources
