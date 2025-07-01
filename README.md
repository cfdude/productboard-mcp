# Productboard MCP Server

A comprehensive Model Context Protocol server for Productboard REST API integration, providing enterprise-grade tools for managing notes, features, companies, users, releases, and webhooks.

## Features

- **🏗️ 3-Tier Tool Architecture**: Workflows → Resource Operations → Power User Tools
- **🏢 Multi-Workspace Support**: Manage multiple Productboard instances and workspaces seamlessly
- **📊 Comprehensive API Coverage**: Full CRUD operations for all major Productboard entities
- **🛡️ Enterprise Error Handling**: Robust error handling with proper MCP error types
- **⚡ Smart Rate Limiting**: Built-in rate limiting with exponential backoff
- **🔄 Context Wrapper Pattern**: Eliminates code duplication and ensures consistency
- **🚀 Production Ready**: Built with TypeScript, following industry best practices

## Quick Start

```bash
# Clone and install
git clone <repository-url>
cd productboard-mcp
npm install
npm run build

# Configure (copy and edit example)
cp .productboard-config.json.example .productboard-config.json

# Test with MCP Inspector
npm run inspector
```

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Productboard API token

### Build from Source
```bash
npm install
npm run build
```

### Verify Installation
```bash
npm run inspector
# Opens MCP Inspector at http://localhost:6274
```

## Configuration

### Method 1: Configuration File (Recommended for Production)

Copy the example configuration file:
```bash
cp .productboard-config.json.example .productboard-config.json
```

Edit `.productboard-config.json` with your credentials:

```json
{
  "instances": {
    "production": {
      "apiToken": "pb_live_your_api_token_here",
      "baseUrl": "https://api.productboard.com", 
      "rateLimitPerMinute": 60,
      "workspaces": ["workspace-prod-1", "workspace-prod-2"]
    },
    "staging": {
      "apiToken": "pb_test_your_staging_token_here",
      "baseUrl": "https://api.productboard.com",
      "rateLimitPerMinute": 100,
      "workspaces": ["workspace-staging"]
    }
  },
  "workspaces": {
    "workspace-prod-1": {
      "instance": "production",
      "workspaceId": "workspace-prod-1",
      "customFields": {
        "priority": "Priority Level",
        "effort": "Development Effort"
      }
    },
    "workspace-staging": {
      "instance": "staging", 
      "workspaceId": "workspace-staging"
    }
  },
  "defaultInstance": "production"
}
```

### Method 2: Environment Variables (Simple Setup)

For single-workspace deployments:
```bash
export PRODUCTBOARD_API_TOKEN="pb_live_your_api_token_here"
export PRODUCTBOARD_BASE_URL="https://api.productboard.com"  # Optional
export PRODUCTBOARD_WORKSPACE_ID="your-workspace-id"        # Optional
```

## Getting Your API Token

1. **Login to Productboard** → Navigate to your workspace
2. **Go to Settings** → Integrations → Public API  
3. **Generate New Token** → Copy the token
4. **Token Format**: 
   - Production: `pb_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Sandbox: `pb_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Claude Desktop Integration

Add to your Claude Desktop MCP settings file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "productboard": {
      "command": "node",
      "args": ["/absolute/path/to/productboard-mcp/build/index.js"],
      "env": {
        "PRODUCTBOARD_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Tool Reference

### 🔄 Workflow Tools (Tier 1)
**High-level operations combining multiple API calls:**

| Tool | Description | Use Case |
|------|-------------|----------|
| `productboard_notes_workflow_feedback_processing` | Complete customer feedback processing pipeline | Process support tickets, user interviews, feature requests |

### 📋 Resource Operations (Tier 2)
**Standard CRUD operations for all entities:**

#### Notes Management
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `productboard_notes_create` | Create new customer feedback notes | `title`, `content`, `userEmail`, `tags` |
| `productboard_notes_list` | List notes with advanced filtering | `createdFrom`, `term`, `companyId`, `anyTag` |
| `productboard_notes_get` | Retrieve specific note details | `noteId` |
| `productboard_notes_update` | Update existing notes | `noteId`, `title`, `content`, `tags` |
| `productboard_notes_delete` | Remove notes | `noteId` |

#### Features Management  
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `productboard_features_list` | List product features | `limit` |
| `productboard_features_get` | Get feature details | `featureId` |

#### Companies & Users
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `productboard_companies_list` | List customer companies | `limit` |
| `productboard_companies_get` | Get company details | `companyId` |
| `productboard_users_list` | List system users | `limit` |
| `productboard_users_update` | Update user information | `userEmail`, `name`, `companyName` |

#### Releases & Planning
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `productboard_releases_list` | List product releases | `limit` |
| `productboard_releases_get` | Get release details | `releaseId` |

#### Webhooks & Integrations
| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `productboard_webhooks_list` | List webhook subscriptions | - |
| `productboard_webhooks_create` | Create webhook subscriptions | `eventType`, `url` |
| `productboard_webhooks_delete` | Remove webhook subscriptions | `webhookId` |

### ⚡ Power User Tools (Tier 3)
**Advanced operations for power users:**

| Tool | Description | Use Case |
|------|-------------|----------|
| `productboard_notes_bulk_tag_management` | Bulk tag operations across multiple notes | Reorganize feedback categorization |
| `productboard_notes_analytics_insights` | Generate analytics insights from notes data | Understand feedback trends and patterns |

## Usage Examples

### Example 1: Process Customer Feedback
```typescript
// Use the workflow tool for complete feedback processing
{
  "tool": "productboard_notes_workflow_feedback_processing",
  "arguments": {
    "feedback": "The search functionality is too slow and doesn't find relevant results",
    "customerEmail": "john.smith@acme.com", 
    "customerName": "John Smith",
    "companyName": "Acme Corporation",
    "tags": ["performance", "search", "ux"],
    "instance": "production"
  }
}
```

### Example 2: Create Targeted Note
```typescript
// Create a specific feedback note
{
  "tool": "productboard_notes_create",
  "arguments": {
    "title": "Mobile App Performance Issues",
    "content": "Users report slow loading times on iOS devices, particularly on older models (iPhone 8 and below). This affects user retention.",
    "userEmail": "support@company.com",
    "companyName": "Enterprise Customer",
    "tags": ["mobile", "performance", "ios", "retention"],
    "includeRaw": false
  }
}
```

### Example 3: Analyze Recent Feedback
```typescript
// Get recent feedback for analysis
{
  "tool": "productboard_notes_list", 
  "arguments": {
    "createdFrom": "2024-01-01",
    "limit": 100,
    "anyTag": ["bug", "feature-request", "performance"],
    "term": "search"
  }
}
```

### Example 4: Bulk Tag Management
```typescript
// Reorganize feedback tags
{
  "tool": "productboard_notes_bulk_tag_management",
  "arguments": {
    "noteIds": ["note-1", "note-2", "note-3"],
    "addTags": ["q1-2024", "high-priority"],
    "removeTags": ["needs-review"]
  }
}
```

## Advanced Configuration

### Multi-Instance Setup
Perfect for organizations with multiple Productboard workspaces:

```json
{
  "instances": {
    "us-production": {
      "apiToken": "pb_live_us_token",
      "rateLimitPerMinute": 60
    },
    "eu-production": {
      "apiToken": "pb_live_eu_token", 
      "rateLimitPerMinute": 60
    },
    "development": {
      "apiToken": "pb_test_dev_token",
      "rateLimitPerMinute": 100
    }
  },
  "defaultInstance": "us-production"
}
```

### Custom Fields Mapping
Map Productboard custom fields for easier reference:

```json
{
  "workspaces": {
    "main-workspace": {
      "instance": "production",
      "customFields": {
        "effort_estimate": "Development Effort",
        "business_value": "Business Impact Score",
        "customer_tier": "Customer Segment"
      }
    }
  }
}
```

## Development

### Available Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch mode for development
- `npm run dev` - Build and run inspector
- `npm run inspector` - Launch MCP Inspector for testing

### Testing with MCP Inspector
```bash
npm run inspector
# Opens at http://localhost:6274
# Use the web interface to test all tools
```

### Debugging
Enable debug logging:
```bash
DEBUG=productboard:* npm run inspector
```

## Error Handling & Troubleshooting

### Common Issues

**Authentication Errors**
```
Error: Authentication failed. Check API token.
```
- Verify your API token is correct
- Ensure token has proper permissions
- Check if token has expired

**Rate Limiting**
```
Error: Rate limit exceeded. Please try again later.
```
- Built-in exponential backoff will retry automatically
- Adjust `rateLimitPerMinute` in configuration
- Consider spreading requests across multiple instances

**Configuration Errors**
```
Error: Instance 'production' not found in configuration
```
- Verify `.productboard-config.json` syntax
- Check instance names match exactly
- Ensure defaultInstance exists

### Logging
The server logs important events to stderr (not visible to MCP clients):
- Configuration loading
- Rate limiting events  
- API errors
- Tool execution timing

## API Compatibility

- **Productboard API Version**: v1
- **Supported Endpoints**: Notes, Features, Companies, Users, Releases, Webhooks
- **Rate Limits**: Configurable per instance (default: 60/minute)
- **Authentication**: Bearer token (API keys)

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes following existing patterns
4. **Test** with MCP Inspector (`npm run inspector`)
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to the branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Development Guidelines
- Follow existing TypeScript patterns
- Add comprehensive JSDoc comments
- Test all tools with MCP Inspector
- Update README for new features
- Maintain backward compatibility

## Security

- **API tokens** are never logged or exposed
- **Configuration files** should be excluded from version control
- **Rate limiting** prevents API abuse
- **Input validation** on all tool parameters
- **Error sanitization** prevents information leakage

## License

MIT License - see LICENSE file for details.

## Support

- **Issues**: Report bugs and request features via GitHub Issues
- **Documentation**: Comprehensive examples in this README
- **MCP Inspector**: Built-in testing tool for development
- **API Reference**: Based on official Productboard API documentation

---

**Built with ❤️ using the Model Context Protocol**
