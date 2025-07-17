# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2025-01-17

### 🔧 Bug Fixes & Improvements

This release restores the condensed data functionality and improves the tool naming convention for better developer experience.

### Fixed

- **Restored Condensed Data Functionality**
  - Re-implemented data filtering logic in `get_features` and `get_companies` tools
  - Added `condensed` parameter that defaults to `true` for minimal data output
  - Fixed formatResponse helper to properly handle condensed views
  - Restored detail levels from previous implementation (commit 8939a92)

- **Tool Naming Convention**
  - Removed `productboard_` prefix from all tool names for cleaner API
  - Updated manifest.json and all generated JavaScript files
  - Created migration script (`scripts/remove-productboard-prefix.js`)
  - Tools now use simpler names like `get_features` instead of `productboard_get_features`

- **Handler Function Naming Issues**
  - Fixed handler function name mismatches in registry
  - Corrected `handleCompaniesAndUsersTools` to `handleCompaniesUsersTool`
  - Resolved "Handler not found" errors for dynamically loaded tools

- **JavaScript Syntax Errors**
  - Fixed files with spaces in names causing syntax errors
  - Corrected malformed property syntax in generated files
  - Removed TypeScript syntax from JavaScript files
  - Fixed import path issues

### Changed

- **Tool Parameter Documentation**
  - Updated tool descriptions to clarify `condensed` vs `pageLimit` parameters
  - Added proper documentation for detail level options
  - Improved parameter descriptions in manifest

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
