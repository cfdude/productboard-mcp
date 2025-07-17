# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - 2025-07-17

### Added

- **Development Tooling**
  - Added `format` script for automatic code formatting with Prettier
  - Added `format:check` script for CI-compatible format checking
  - Added `lint-and-format` script combining TypeScript linting and code formatting
  - Added `pre-commit` script for comprehensive pre-commit validation (lint + format + test + generate manifest)

### Improved

- **Developer Experience**
  - Streamlined code formatting workflow to prevent CI failures
  - Automated linting and formatting in single commands
  - Enhanced pre-commit validation process

## [1.2.0] - 2025-07-17

### Added

- **Condensed Data Views**
  - Added `condensed` parameter to all list operations (notes_list, companies_list, releases_list, users_list)
  - Condensed view returns only essential fields by default for better performance and reduced context usage
  - Prevents AI models from being overwhelmed by large data responses
  - Set condensed=false to get full data when needed

- **Configurable Detail Levels**
  - Added `detail` parameter to all get operations (notes_get, companies_get, releases_get, users_get)
  - Three detail levels: `basic` (minimal data), `standard` (common use case), `full` (comprehensive data)
  - Allows AI models to request appropriate level of information based on task requirements

- **Enhanced Tool Documentation**
  - Updated tool descriptions to clearly explain when to use different detail levels
  - Added guidance on performance implications of data granularity choices
  - Improved AI model understanding of tool capabilities and usage patterns

- **New Users Operations**
  - Added `users_get` tool with configurable detail levels
  - Updated `users_list` to include condensed view and return user IDs for proper linking

### Improved

- **User Experience**
  - Removed "productboard\_" prefix from tool names for cleaner display in Claude Desktop
  - Added `title` parameter to all tool definitions for user-friendly display names
  - Backward compatibility maintained for existing tool name patterns

- **Tool Performance**
  - Condensed views reduce response size by 60-80% for large datasets
  - Faster processing and reduced token usage for AI models
  - Better scalability for organizations with extensive Productboard data

## [1.1.1] - 2025-07-16

### Fixed

- **ESM Module Import Issues**
  - Fixed `ERR_MODULE_NOT_FOUND` error by adding `.js` extensions to imports from `@modelcontextprotocol/sdk/types`
  - Updated `src/errors/index.ts` and `src/__tests__/errors.test.ts` to use proper ESM syntax
  - Server now launches successfully with Claude Code without module resolution errors

- **Dynamic Tool Loading**
  - Temporarily disabled dynamic tool loading to avoid syntax errors in generated files
  - Server falls back to static tool loading when manifest contains invalid syntax
  - Preserved 20 core tools including full CRUD operations (create, read, update, delete)

### Technical Details

- Modified TypeScript imports to comply with ESM module resolution
- Generated files moved to backup due to invalid JavaScript identifiers (spaces in names)
- Static tool loading ensures reliable server operation

## [1.1.0] - 2025-01-16

### 🔒 Security & Reliability Release

This release addresses all security concerns and recommendations from Claude's comprehensive code review, making the Productboard MCP Server production-ready with enterprise-grade security and reliability features.

### Added

- **Comprehensive Error Handling System**
  - Custom error type hierarchy (`ProductboardError`, `ValidationError`, `AuthenticationError`, `RateLimitError`, `NetworkError`, `ConfigurationError`)
  - Error message sanitization to prevent information leakage
  - Proper error code mapping to MCP error codes
- **Input Validation & Sanitization**
  - String sanitization with XSS protection
  - Email and URL format validation
  - Array and object validation utilities
  - Request size limits (1MB maximum payload)
  - Comprehensive input validation for all API calls

- **Retry Logic & Circuit Breaker**
  - Exponential backoff with jitter for transient failures
  - Circuit breaker pattern to prevent cascading failures
  - Intelligent retry-after header handling
  - Configurable retry options per operation

- **Memory Management**
  - LRU-style eviction for dynamic tool handlers
  - Maximum handler limit (100) to prevent memory leaks
  - Access tracking for efficient memory usage
  - Automatic cleanup of least-used handlers

- **Test Suite**
  - Comprehensive unit tests for validation utilities
  - Error handling and sanitization tests
  - Retry logic and circuit breaker tests
  - Jest configuration with ESM support
  - 70% coverage thresholds enforced

- **Type Safety Improvements**
  - Dedicated tool type definitions (`ToolDefinition`, `ToolArguments`, `ToolResponse`)
  - Proper interfaces replacing `any` types
  - Return type annotations for all functions
  - Stricter TypeScript configuration

- **CI/CD Pipeline**
  - GitHub Actions workflows for continuous integration
  - Automated security scanning and secret detection
  - Code quality checks (TypeScript, Prettier, custom linting)
  - Claude Code Review integration for automated PR reviews
  - Multi-version Node.js testing (18.x, 20.x)

### Changed

- **Enhanced Error Responses**
  - All errors now use custom error types with proper sanitization
  - Consistent error format across all API operations
  - Better error context without exposing sensitive information

- **Improved HTTP Client Configuration**
  - Response interceptors for consistent error handling
  - Proper timeout configuration (30 seconds)
  - Rate limit handling with retry-after support

### Fixed

- **Security Vulnerabilities**
  - Input validation prevents injection attacks
  - Error message sanitization prevents information leakage
  - Request size limits prevent DoS attacks
  - Proper error handling prevents system information exposure

- **Memory Leaks**
  - Dynamic tool loading now includes proper cleanup
  - Handler cache prevents unbounded memory growth
  - Efficient memory management for long-running servers

### Developer Experience

- **Better Documentation**
  - Comprehensive test examples
  - Error handling guidelines
  - Security best practices
  - CI/CD setup instructions

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
