# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-01-19

### Added

- **Comprehensive Condensed Data Views**
  - Added flexible detail levels (basic/standard/full) to major list and get operations
  - Implemented data filtering based on detail level to optimize response sizes
  - Added `includeSubData` parameter to control nested JSON data inclusion
  - Supported tools include: features, components, products, releases, notes, companies, users, objectives, initiatives, and webhooks
  - Significantly improves performance for large datasets and reduces token usage

- **Enhanced Test Configuration**
  - Added mock configuration support for test environment (NODE_ENV=test)
  - Eliminated requirement for API tokens during CI/CD testing
  - Suppressed console errors in test mode to prevent log pollution

- **Documentation Improvements**
  - Added comprehensive "Condensed Data Views" section to README
  - Created "Future Improvements" section based on code review feedback
  - Updated key features to highlight condensed data functionality

### Fixed

- **Critical create_note API Fix**
  - Fixed create_note function that was sending requests incorrectly
  - Removed data wrapper for /notes endpoint (sends body directly unlike other endpoints)
  - Fixed field naming to use snake_case (display_url not displayUrl)
  - Added Accept header matching API requirements
  - Enhanced error handling with specific messages for 409 and 422 status codes
  - Documented MCP tool usage requirements (no JSON formatting or escape characters)

- **Enhanced Error Handling for All Tools**
  - Updated error interceptors to expose original API error details in structured format
  - Added originalData field to error responses to help AI understand request structure issues
  - Improved error messages for 400, 409, and 422 status codes with specific guidance

- **Fixed Webhook Tools Implementation**
  - Created missing webhooks.js file with proper API structure
  - Implemented correct webhook data format with events array and notification object
  - Added support for both create_webhook and post_webhook aliases
  - Fixed handler naming and routing for webhook operations

- **Fixed Release Tools Syntax Errors**
  - Replaced $2 placeholders with proper URLs in release and release-group endpoints
  - Fixed handler function name mismatch for releases tools

- **General Tool Fixes**
  - Fixed description format requirements (must be HTML-wrapped for features)
  - Fixed parameter type issues (create_user expects string name, not object)
  - Added support for tool name aliases (post_webhook/create_webhook, get_webhooks/list_webhooks)
  - Improved tool naming consistency across the codebase

- **CI/CD and Merge Conflicts**
  - Resolved merge conflicts between dev and main branches
  - Fixed prettier formatting issues
  - Updated security audit to avoid false positives with webhook descriptions
  - Fixed TypeScript compilation errors in test helpers

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

- **Improved Dynamic Loading**
  - Enhanced error messages for missing handlers
  - Better debugging output in registry system
  - More robust file loading with proper error handling

## [1.1.0] - 2025-01-16

### 🔐 Security & Reliability Update

This release addresses critical security vulnerabilities and significantly improves the server's reliability and error handling.

### Security

- **Critical Security Patches**
  - Updated cross-spawn from 7.0.3 to 7.0.7 (fixes command injection vulnerability)
  - Updated nanoid from 3.3.7 to 3.3.8 (improves randomness generation)
  - Updated Axios to 1.10.0 (patches request smuggling vulnerability)
  - All high and critical npm audit issues resolved

### Added

- **GitHub Actions CI/CD Pipeline**
  - Automated testing across Node.js 18.x and 20.x
  - ESLint and Prettier code quality checks
  - Weekly security audits
  - Automated dependency updates via Dependabot

- **Comprehensive Error Handling**
  - New custom error classes: `AuthenticationError`, `NetworkError`, `RateLimitError`
  - Detailed error messages with actionable guidance
  - Proper error propagation through the MCP protocol
  - Sanitized error messages to prevent information leakage

- **Retry Mechanism**
  - Exponential backoff for transient failures
  - Configurable retry attempts and delays
  - Smart retry logic that respects rate limits

- **Type System Enhancements**
  - Full TypeScript definitions for all tool parameters
  - Strict type checking in build process
  - Improved IDE autocomplete support

### Fixed

- **Tool Handler Registration**
  - Fixed dynamic tool loading failures
  - Corrected handler function naming inconsistencies
  - Improved error messages for missing tools

- **Input Validation**
  - Added comprehensive parameter validation
  - Fixed SQL injection vulnerabilities in user inputs
  - Improved date/time format validation

### Changed

- **Dependencies**
  - Minimum Node.js version now 18.0.0
  - Updated all development dependencies to latest stable versions
  - Removed deprecated packages

### Developer Experience

- **Testing Infrastructure**
  - Added Jest test framework with 80%+ coverage target
  - Unit tests for all utility functions
  - Integration tests for tool handlers

- **Documentation**
  - Added JSDoc comments for public APIs
  - Improved README with security best practices
  - Added CONTRIBUTING.md with development guidelines

## [1.0.0] - 2025-01-15

### 🎉 Initial Release

First stable release of the Productboard MCP Server with dynamic tool loading and comprehensive API coverage.

### Features

- **Dynamic Tool Loading**: Load only the tools you need, when you need them
- **119+ API Operations**: Complete coverage of Productboard's REST API
- **Category-Based Organization**: Tools organized into 15+ logical categories
- **Role-Based Profiles**: Pre-configured tool sets for different user types
- **Multi-Workspace Support**: Manage multiple Productboard instances
- **Auto-Generated Tools**: Tools generated directly from OpenAPI spec
- **TypeScript Support**: Full type safety and IDE autocomplete
- **Docker Support**: Ready-to-use Docker configuration

### Tool Categories

- Features (22 tools)
- Components (3 tools)
- Products (3 tools)
- Releases (5 tools)
- Release Groups (4 tools)
- Notes (15 tools)
- Companies (5 tools)
- Users (2 tools)
- Companies & Users (18 tools)
- Objectives (11 tools)
- Key Results (5 tools)
- Initiatives (11 tools)
- Custom Fields (6 tools)
- Webhooks (4 tools)
- Plugin Integrations (10 tools)
- Jira Integrations (4 tools)

### Performance

- Startup time: ~50ms (manifest only)
- First tool call: ~100ms (includes dynamic import)
- Subsequent calls: <10ms (cached handler)
- Memory usage: ~20MB base + 1-2MB per loaded category

[1.0.0]: https://github.com/cfdude/productboard-mcp/releases/tag/v1.0.0
[1.1.0]: https://github.com/cfdude/productboard-mcp/compare/v1.0.0...v1.1.0
[1.1.1]: https://github.com/cfdude/productboard-mcp/compare/v1.1.0...v1.1.1
[1.2.0]: https://github.com/cfdude/productboard-mcp/compare/v1.1.1...v1.2.0
