# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-15

### 🎉 Initial Release

This is the first official release of the Productboard MCP Server, providing comprehensive access to Productboard's REST API through the Model Context Protocol.

### Added

- **Dynamic Tool Loading System**
  - 119+ API operations loaded on-demand
  - Lazy loading to minimize memory usage
  - Automatic tool discovery from manifest

- **Category-Based Organization**
  - 15+ logical tool categories
  - Role-based profiles (product-manager, customer-success, developer)
  - Configurable tool filtering

- **Multi-Installation Support**
  - Smithery package registry
  - Docker containerization
  - NPM package distribution
  - Claude Desktop Connectors

- **Tool Generation**
  - Auto-generation from OpenAPI specification
  - Consistent implementation patterns
  - Type-safe TypeScript interfaces

- **Configuration Options**
  - Environment variable support
  - File-based configuration
  - Multi-workspace management
  - Profile-based tool selection

### Tool Categories

- Core Product Management: features, components, products, releases
- Customer Insights: notes, companies, users
- Planning & Strategy: objectives, key results, initiatives
- Customization: custom fields, hierarchy entities
- Integrations: webhooks, plugin integrations, Jira integrations

### Technical Features

- Full TypeScript support
- Comprehensive error handling
- Rate limiting support
- Health checks for Docker deployment
- MCP v1.0.0 compatibility

### Documentation

- Comprehensive README with examples
- Developer experience template (.dxt)
- Installation guides for all methods
- Architecture documentation

[1.0.0]: https://github.com/cfdude/productboard-mcp/releases/tag/v1.0.0
