# Productboard MCP Server

[![Version](https://img.shields.io/npm/v/@the_cfdude/productboard-mcp)](https://www.npmjs.com/package/@the_cfdude/productboard-mcp)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![MCP Version](https://img.shields.io/badge/MCP-1.0.0-green)](https://modelcontextprotocol.io)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

A Model Context Protocol (MCP) server that provides comprehensive access to Productboard's REST API with intelligent dynamic tool loading, category-based filtering, and role-based profiles.

## 🚀 Key Features

- **Dynamic Tool Loading**: 119+ API operations loaded on-demand to minimize memory usage
- **Category-Based Organization**: Tools organized into 15+ logical categories
- **Role-Based Profiles**: Pre-configured tool sets for different user types
- **Auto-Generated Tools**: Generate tool implementations directly from OpenAPI spec
- **Multi-Workspace Support**: Manage multiple Productboard instances seamlessly
- **Full TypeScript Support**: Type-safe implementation with comprehensive interfaces
- **Backward Compatible**: Falls back to static tools when needed

## 📦 Installation

### Option 1: Via Smithery (Recommended)

```bash
smithery install productboard
```

Then add to your Claude Desktop config:

```json
{
  "mcpServers": {
    "productboard": {
      "command": "node",
      "args": ["${SMITHERY_PATH}/productboard/build/index.js"],
      "env": {
        "PRODUCTBOARD_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

### Option 2: Docker

```bash
# Using Docker Compose (recommended)
git clone https://github.com/cfdude/productboard-mcp.git
cd productboard-mcp

# Create .env file
echo "PRODUCTBOARD_API_TOKEN=your-api-token" > .env

# Run the server
docker-compose up -d

# Or using Docker directly
docker run -d \
  --name productboard-mcp \
  -e PRODUCTBOARD_API_TOKEN="your-api-token" \
  ghcr.io/cfdude/productboard-mcp:latest
```

### Option 3: NPM Package

```bash
npm install @the_cfdude/productboard-mcp
```

### Option 4: From Source

```bash
git clone https://github.com/cfdude/productboard-mcp.git
cd productboard-mcp
npm install
npm run generate-manifest
npm run build
```

## 🔧 Configuration

### Basic Setup

Create a `.productboard-config.json` file in your project root:

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
    "enabled": ["*"] // Enable all tools
  }
}
```

### Advanced Configuration

#### Role-Based Profiles

```json
{
  "toolCategories": {
    "activeProfile": "product-manager" // or "customer-success", "developer"
  }
}
```

#### Custom Tool Selection

```json
{
  "toolCategories": {
    "enabled": ["notes", "features", "companies", "releases"],
    "disabled": ["jiraintegrations", "pluginintegrations"]
  }
}
```

#### Multi-Workspace Setup

```json
{
  "instances": {
    "production": {
      "apiToken": "PROD_TOKEN",
      "baseUrl": "https://api.productboard.com"
    },
    "staging": {
      "apiToken": "STAGING_TOKEN",
      "baseUrl": "https://api-staging.productboard.com"
    }
  },
  "workspaces": {
    "main": {
      "instance": "production",
      "workspaceId": "main-workspace"
    },
    "test": {
      "instance": "staging",
      "workspaceId": "test-workspace"
    }
  }
}
```

## 📚 Tool Categories

### Core Product Management

- **features** (22 tools): Feature management, roadmapping, and prioritization
- **components** (3 tools): Component hierarchy and organization
- **products** (3 tools): Product line management
- **releases** (5 tools): Release planning and tracking
- **releaseGroups** (4 tools): Multi-team release coordination

### Customer Insights

- **notes** (15 tools): Customer feedback, insights, and research
- **companies** (5 tools): Company/account management
- **users** (2 tools): User profile and segmentation
- **companies & users** (18 tools): Combined customer data operations

### Planning & Strategy

- **objectives** (11 tools): Strategic objectives and OKRs
- **keyResults** (5 tools): Measurable outcomes and KPIs
- **initiatives** (11 tools): High-level strategic initiatives
- **statuses** (1 tool): Feature status workflows

### Customization

- **custom fields** (6 tools): Custom field definitions and values
- **hierarchyEntitiesCustomFields** (3 tools): Entity-specific custom fields

### Integrations

- **webhooks** (4 tools): Event notifications and subscriptions
- **pluginIntegrations** (10 tools): Third-party integration management
- **jiraIntegrations** (4 tools): Jira-specific integrations

## 🎯 Usage Examples

### With Claude Desktop

#### Option A: Using Claude Desktop Connectors (New!)

1. Open Claude Desktop settings
2. Navigate to "Connectors" section
3. Click "Add Connector"
4. Search for "Productboard MCP"
5. Enter your API token and select your preferred tool profile
6. Click "Connect"

#### Option B: Manual Configuration

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

### Common Tool Examples

```typescript
// Create a note from customer feedback
productboard_notes_create({
  title: 'Feature request: Dark mode',
  content: 'Customer wants dark mode support',
  tags: ['ui', 'enhancement'],
  user: { email: 'customer@example.com' },
});

// List features with filtering
productboard_features_list({
  limit: 50,
  status: 'in-progress',
  includeRaw: false,
});

// Create a release
productboard_releases_create({
  name: 'Q1 2025 Release',
  description: 'Major feature updates',
  startDate: '2025-01-01',
  endDate: '2025-03-31',
});
```

## 🛠️ Development

### Generate Tools from OpenAPI

```bash
# 1. Generate tool manifest (required first)
npm run generate-manifest

# 2. Generate missing tool implementations
npm run generate-tools

# 3. Build the TypeScript project
npm run build
```

### Testing

```bash
# Run the MCP inspector
npm run dev

# Test dynamic loading system
npx tsx scripts/test-dynamic-loading.ts
```

### Project Structure

```
productboard-mcp/
├── src/
│   ├── tools/
│   │   ├── registry.ts        # Dynamic tool loading system
│   │   ├── index-dynamic.ts   # Dynamic tool handler
│   │   └── *.ts              # Tool implementations
│   ├── utils/
│   │   └── tool-wrapper.ts   # API client wrapper
│   └── productboard-server.ts # Main server class
├── generated/
│   ├── manifest.json          # Tool metadata
│   └── tools/                 # Auto-generated tools
├── scripts/
│   ├── generate-manifest.ts   # Manifest generator
│   └── generate-tools.ts      # Tool generator
└── .productboard-config.json  # Your configuration
```

## 🔍 Dynamic Loading Architecture

The server uses a three-tier approach:

1. **Discovery**: Tool manifest provides metadata without loading code
2. **Registration**: Tools are registered with lazy loaders
3. **Execution**: Implementation loaded only when tool is called

This enables:

- Fast startup times
- Minimal memory usage
- Dynamic tool filtering
- Runtime configuration updates

## 🔐 Security

- API tokens should be stored in `.productboard-config.json` (gitignored)
- Use environment variables for CI/CD: `PRODUCTBOARD_API_TOKEN`
- The example config uses placeholder values
- Never commit real tokens to version control

## 📊 Performance

- Initial load: ~50ms (manifest only)
- First tool call: ~100ms (includes dynamic import)
- Subsequent calls: <10ms (cached handler)
- Memory usage: ~20MB base + 1-2MB per loaded category

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Run `npm run generate-manifest` after API changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Resources

- [Productboard API Documentation](https://developer.productboard.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## 🏗️ Roadmap

- [ ] Add caching layer for frequently used tools
- [ ] Implement tool usage analytics
- [ ] Add GraphQL support
- [ ] Create tool composition workflows
- [ ] Add rate limit handling strategies

---

Built with ❤️ for the Productboard community
