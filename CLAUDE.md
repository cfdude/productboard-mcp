# ProductBoard MCP Server - Claude Code Instructions

## Core Principles

- **ALWAYS** use claude-code `Bash` tool for shell commands - never suggest manual terminal operations
- **NEVER** create files unless explicitly required by the task
- **ALWAYS** prefer editing existing files over creating new ones
- **NEVER** create documentation files (\*.md, README) unless explicitly requested

## Development Workflow (CRITICAL - Follow Exactly)

### 1. Pre-Development Checklist

Before ANY code changes, run this diagnostic sequence:

```bash
# Check CI format expectations vs current state
npm run generate-manifest && git diff generated/manifest.json

# Verify prettierignore coverage for generated files
cat .prettierignore | grep -E "(generated/|build/)"

# Baseline: ensure clean build state
npm run build && npm run lint && npm test
```

### 2. MCP Server Testing Protocol (MANDATORY)

```bash
# 1. Shutdown any existing servers and build after changes
npm run shutdown && npm run build

# 2. Test data wrapper compatibility (after any tool changes)
npm run test-data-wrapper

# 3. Test with native Claude Code MCP calls

# 4. If debugging needed, check the debug log:
tail -f mcp-debug.log

# 5. Only use MCP inspector if you need real-time debugging output:
npm run inspector
```

**CRITICAL**: Always use `npm run shutdown && npm run build` after making code changes. Building alone is NOT sufficient - the MCP server must be restarted to clear in-memory caches and load new code.

**Debug Logging**: The server writes debug logs to `mcp-debug.log` in the project root. Use `tail -f mcp-debug.log` to monitor logs in real-time during testing.

### 3. Git Worktree Workflow (CRITICAL)

**Repository Setup**: This project uses git worktrees:

- `/Users/robsherman/Servers/productboard-mcp` = **dev branch** (development work)
- `/Users/robsherman/Servers/productboard-mcp-stable` = **main branch** (stable deployment)

**After committing to dev branch, ALWAYS update the stable directory:**

```bash
# 1. Commit and push dev changes to main
git push origin dev:main

# 2. Update stable directory with latest main branch
cd /Users/robsherman/Servers/productboard-mcp-stable
git stash -u  # Stash any local changes
git pull origin main  # Pull latest fixes
git stash pop  # Restore local changes if needed

# 3. Rebuild stable server
npm run shutdown && npm run build
```

### 4. Commit Preparation

```bash
# Pre-commit validation sequence
npm run generate-manifest
npm run lint
npm run test
git status
git diff --staged
```

## Critical Anti-Patterns (AVOID AT ALL COSTS)

### Manifest/CI Issues

- **NEVER** edit `generated/manifest.json` directly
- **NEVER** commit without running `npm run generate-manifest` first
- **NEVER** ignore CI format conflicts - they cause infinite loops
- **ALWAYS** check `.prettierignore` includes `generated/` before changes

### Code Quality

- **NO** console.log statements in production code (causes CI failures)
- **NO** unused imports or variables (ESLint failures)
- **NO** TypeScript type assertions without validation
- **NO** hardcoded IDs or sensitive data

## Expert-Level Patterns

### Error Handling

```typescript
// ✅ Robust error handling with context
try {
  const result = await apiCall(params);
  return formatResponse(result);
} catch (error: any) {
  if (isEnterpriseError(error)) {
    throw new ProductboardError(ErrorCode.InvalidRequest, error.message, error);
  }
  throw error;
}
```

### Parameter Validation

```typescript
// ✅ Comprehensive parameter normalization
const normalizedParams = normalizeListParams(args);
const params: any = {
  pageLimit: normalizedParams.limit,
  pageOffset: normalizedParams.startWith,
};

// Add filters with proper null checking
if (args.statusId) params['status.id'] = args.statusId;
```

### Tool Schema Design

```typescript
// ✅ Clear, comprehensive schemas with examples
inputSchema: {
  type: 'object',
  properties: {
    id: { type: 'string', description: 'Feature ID' },
    parentId: {
      type: 'string',
      description: 'Parent feature ID (for sub-features)'
    },
    componentId: {
      type: 'string',
      description: 'Component ID (to move feature to different component)'
    }
  },
  required: ['id']
}
```

## Performance & Efficiency

### Token Optimization

- Use specific file paths in responses: `src/tools/features.ts:687`
- Batch tool calls when possible: `Bash`, `Read`, `Edit` in single response
- Use concise variable names and minimize comments
- Leverage TypeScript inference over explicit types

### Search & Filter Patterns

```typescript
// ✅ Server-side filtering when possible
serverSideFilters: ['status.id', 'owner.email', 'parent.product.id'],
filterMappings: {
  'status.id': 'statusId',
  'parent.product.id': 'parent.product.id'
}
```

## Emergency Procedures

### Build Failures

```bash
# Quick diagnostic sequence
npm run lint --fix
npm run generate-manifest
git diff generated/
npm run shutdown && npm run build
```

### Test Failures

```bash
# Identify failing tests quickly
npm test -- --verbose
# Fix and verify
npm run shutdown && npm run build && npm test
```

### MCP Tool Issues

```bash
# Rebuild and test sequence
npm run shutdown && npm run build

# Test with Claude Code MCP calls directly

# Check debug logs for issues
tail -f mcp-debug.log

# Only if real-time debugging needed:
npm run inspector
```

### Multiple Instance Issues

```bash
# Check for multiple running instances (enhanced pattern matching)
ps aux | grep "productboard-mcp.*build/index.js" | grep -v grep

# Clean shutdown all instances (kills ALL productboard-mcp variants)
npm run shutdown

# If stable directory needs same fixes:
cd /Users/robsherman/Servers/productboard-mcp-stable
npm run shutdown && npm run build

# Return to dev directory
cd /Users/robsherman/Servers/productboard-mcp
npm run build
```

## Documentation Standards

- All tool functions must have JSDoc with @param and @returns
- Complex algorithms require inline comments explaining business logic
- API parameter mappings must be documented in filterMappings
- Breaking changes require version bump and changelog entry

This instruction set prioritizes: speed, accuracy, CI compliance, and expert-level TypeScript/Node.js practices.

## Systematic MCP Tool Testing Strategy

### Testing Protocol for API Compatibility Issues

**CRITICAL**: All Productboard POST/PUT/PATCH endpoints require `{ data: requestBody }` wrapper

#### 1. Create Test Script Template

```javascript
// Always create automated test script with cleanup tracking
const testResults = [];
const createdItems = [];

// Test pattern:
// 1. Try tool execution
// 2. Detect schema vs API errors
// 3. Track created items for cleanup
// 4. Automatic cleanup at end
```

#### 2. Test Environment Setup

```bash
# Create dedicated test product/feature for hierarchical testing
# 1. Create test product: "TEST-CLEANUP: Automated Testing Product"
# 2. Create test feature under product: "TEST-CLEANUP: Feature Container"
# 3. Create test components under feature
# 4. Clean up in reverse order: components → features → products
```

#### 3. Error Classification Strategy

- **Schema Error**: "properties which are not allowed by the schema" = needs `{ data: body }` fix
- **API Error**: Productboard validation errors = tool working, just missing required fields
- **Success**: Tool executes without MCP schema validation errors

#### 4. Test Execution Pattern

```bash
# 1. Shutdown and rebuild server
npm run shutdown && npm run build

# 2. Run systematic test script
node test-data-wrapper-tools.js

# 3. Review results and fix identified tools
# 4. Re-test fixed tools with native MCP calls
# 5. Check debug logs if issues occur
tail -f mcp-debug.log

# 6. Commit fixes with descriptive messages
```

#### 5. Cleanup Requirements

- **NEVER** leave test data in Productboard
- Track all created items with IDs for deletion
- Delete in dependency order (children before parents)
- Handle cleanup failures gracefully
- Verify cleanup completion

### MCP Inspector Integration

```bash
# Start inspector for manual verification
pkill -f inspector
npx @modelcontextprotocol/inspector build/index.js

# Browser: http://localhost:5173
# Manual verification of schema fixes
```

## Feature Development Process

- Productboard mcp server feature development / bug fix / feature enhancement process:
  1. Record the process to Serena memory & Claude.md (if not already written)
  2. Analyze user feedback/bug reports/suggestions and create individual memories for each improvement
  3. Use sequential-thinking, ask_perplexity and/or chat_opena and research tools to develop detailed plans
  4. Update memories with validated plans
  5. Implement features sequentially starting with highest priority
  6. For each implementation:
  - Shutdown and rebuild server: `npm run shutdown && npm run build`
  - Run/fix tests
  - Handle linting/formatting
  - Test with native MCP calls
  - Check debug logs if needed: `tail -f mcp-debug.log`
  - Commit using ~/.claude/commands/commit.md
  - Monitor with 'gh' CLI - ensure all tests pass, all claude code or security comments are addressed and fixed
  7. Continue until all features are built, tested, and committed (In progress)

## Debug Logging Process

### Enable Debug Logging

Debug logging is automatically enabled when the server runs. The logs are written to `mcp-debug.log` in the project root.

### Review Logs During Testing

```bash
# Monitor logs in real-time
tail -f mcp-debug.log

# Search for specific components
grep "search-engine" mcp-debug.log

# View recent entries
tail -100 mcp-debug.log

# Search for errors
grep -i "error\|fail" mcp-debug.log
```

### Clean Up After Testing

```bash
# Clear log contents but keep file
> mcp-debug.log

# Or remove log file completely
rm mcp-debug.log

# The shutdown script automatically clears debug logs
npm run shutdown
```

### When to Use Debug Logging

- Troubleshooting empty or unexpected results
- Tracking execution flow through the MCP pipeline
- Identifying where data transformations occur
- Debugging cache behavior
- Understanding performance bottlenecks

### Debug Log Format

Each log entry contains:

- `timestamp`: ISO timestamp
- `component`: Source component (e.g., 'search-engine', 'productboard-server')
- `message`: Description of the event
- `data`: Optional structured data related to the event

## Testing Standards

**CRITICAL**: All development must follow strict testing standards to maintain 90%+ code coverage.

### Testing Requirements

- **Coverage Thresholds**: 90% minimum across all metrics (statements, branches, functions, lines)
- **Test Structure**: Follow Jest AAA pattern (Arrange, Act, Assert)
- **Test Isolation**: Each test must be independent and not rely on other tests
- **Performance**: Individual tests should complete in <100ms when possible

### Testing Documentation

Complete testing standards are documented in **`tests/TESTING_STANDARDS.md`**. This includes:

- File organization and naming conventions
- Test structure patterns and examples
- Mock creation and test data standards
- Async testing and error handling patterns
- Tool handler and utility function testing guidelines
- Integration testing approaches
- Coverage requirements and quality gates
- Performance testing standards
- Anti-patterns to avoid

### Pre-Development Testing Protocol

```bash
# 1. Check current coverage status
NODE_OPTIONS='--experimental-vm-modules' npx jest --collectCoverage=true

# 2. Run full test suite before changes
npm test

# 3. After changes, rebuild and retest
npm run shutdown && npm run build && npm test

# 4. Verify coverage thresholds are met
NODE_OPTIONS='--experimental-vm-modules' npx jest --collectCoverage=true --coverageReporters=text-summary
```

### Testing Integration with Development Workflow

- **Before Code Changes**: Run tests to establish baseline
- **During Development**: Write tests alongside code changes
- **Before Commits**: Ensure all tests pass and coverage thresholds met
- **CI/CD Integration**: Tests must pass for merges to main branch
