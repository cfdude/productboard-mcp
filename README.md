# Productboard MCP Server

A Model Context Protocol (MCP) server that provides programmatic access to Productboard's REST API with dynamic tool loading and category-based filtering.

## Features

- **Dynamic Tool Loading**: Lazy-loads tool implementations only when needed
- **Category-Based Organization**: 119+ tools organized into 15+ categories
- **Configurable Tool Sets**: Enable/disable categories or use role-based profiles
- **Auto-Generated Tools**: Generate tool implementations from OpenAPI spec
- **Multi-Workspace Support**: Manage multiple Productboard instances
- **Type-Safe**: Full TypeScript support

## Installation

```bash
npm install productboard-mcp
```

## Configuration

Create a `.productboard-config.json` file:

```json
{
  "instances": {
    "default": {
      "apiToken": "YOUR_API_TOKEN",
      "baseUrl": "https://api.productboard.com",
      "rateLimitPerMinute": 60
    }
  },
  "defaultInstance": "default",
  "toolCategories": {
    "enabled": ["notes", "features", "companies", "releases"],
    "profiles": {
      "product-manager": ["features", "releases", "objectives", "keyresults"],
      "customer-success": ["notes", "companies", "users"],
      "developer": ["webhooks", "pluginintegrations", "jiraintegrations"],
      "full": ["*"]
    },
    "activeProfile": "product-manager"
  }
}
```

## Tool Categories

The server organizes tools into the following categories:

### Core Product Management
- **features**: Feature management and roadmapping
- **components**: Component hierarchy management  
- **products**: Product line organization
- **releases**: Release planning and assignments
- **releaseGroups**: Multi-team release coordination

### Customer Insights
- **notes**: Customer feedback and insights
- **companies**: Company/account management
- **users**: User profile management
- **followers**: Stakeholder engagement

### Planning & Strategy
- **objectives**: Strategic objectives (OKRs)
- **keyResults**: Measurable key results
- **initiatives**: High-level initiatives
- **statuses**: Feature status workflow

### Customization & Extensions
- **hierarchyEntitiesCustomFields**: Custom field definitions
- **hierarchyEntitiesCustomFieldsValues**: Custom field data
- **companies/custom-fields**: Company-specific fields

### Integrations
- **webhooks**: Event notifications
- **pluginIntegrations**: Third-party integrations
- **jiraIntegrations**: Jira-specific integration

## Dynamic Loading Architecture

The server uses a manifest-based approach for tool discovery:

1. **Tool Manifest** (`generated/manifest.json`): Contains metadata for all tools
2. **Lazy Loading**: Tools are loaded only when called, reducing memory usage
3. **Category Filtering**: Only enabled categories are exposed to clients

### Generating Tools

```bash
# Generate manifest from OpenAPI spec
npm run generate-manifest

# Generate tool implementations
npm run generate-tools

# Build the project
npm run build
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "productboard": {
      "command": "node",
      "args": ["/path/to/productboard-mcp/build/index.js"],
      "env": {
        "PRODUCTBOARD_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Generate tools from OpenAPI
npm run generate-manifest
npm run generate-tools

# Build TypeScript
npm run build

# Run with inspector
npm run dev

# Test dynamic loading
npx tsx scripts/test-dynamic-loading.ts
```

## Tool Examples

### Notes Management
- `productboard_notes_create`: Create customer feedback
- `productboard_notes_list`: List all notes
- `productboard_notes_update`: Update note details

### Feature Management
- `productboard_features_list`: List product features
- `productboard_features_get`: Get feature details
- `productboard_features_update`: Update feature

### Custom Configuration

Enable specific categories:
```json
{
  "toolCategories": {
    "enabled": ["notes", "features", "webhooks"]
  }
}
```

Use role-based profiles:
```json
{
  "toolCategories": {
    "activeProfile": "product-manager"
  }
}
```

## Architecture Benefits

1. **Scalable**: Handles 100+ tools without context window overload
2. **Memory Efficient**: Lazy loading keeps runtime footprint small
3. **Flexible**: Easy to add new API endpoints
4. **Maintainable**: Auto-generation reduces manual coding
5. **User-Friendly**: Role-based profiles for different use cases

## License

MIT