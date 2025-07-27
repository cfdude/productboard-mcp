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
# 1. Build after changes
npm run build

# 2. Test with MCP inspector first (external tool)
# 3. Only after MCP inspector verification, use native Claude Code MCP calls
# 4. If issues found, fix and repeat from step 1
```

### 3. Commit Preparation

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
npm run build
```

### Test Failures

```bash
# Identify failing tests quickly
npm test -- --verbose
# Fix and verify
npm run build && npm test
```

### MCP Tool Issues

```bash
# Rebuild and test sequence
npm run build
# Test with MCP inspector
# Verify with Claude Code MCP calls
```

## Documentation Standards

- All tool functions must have JSDoc with @param and @returns
- Complex algorithms require inline comments explaining business logic
- API parameter mappings must be documented in filterMappings
- Breaking changes require version bump and changelog entry

This instruction set prioritizes: speed, accuracy, CI compliance, and expert-level TypeScript/Node.js practices.
