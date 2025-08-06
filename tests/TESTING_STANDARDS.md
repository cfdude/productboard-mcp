# Productboard MCP Server - Testing Standards

## Core Testing Principles

1. **Test Structure**: Follow Jest's AAA (Arrange, Act, Assert) pattern consistently
2. **Isolation**: Each test must be independent and not rely on other tests
3. **Clarity**: Test names should clearly describe what is being tested and the expected outcome
4. **Coverage**: Aim for 90%+ code coverage across all metrics
5. **Performance**: Tests should run quickly (individual tests < 100ms when possible)

## File Organization Standards

### Directory Structure

```
src/
  __tests__/
    tools/           # Tool handler tests
      features.test.ts
      notes.test.ts
      companies.test.ts
    utils/           # Utility function tests
      validation.test.ts
      search-engine.test.ts
    integration/     # Integration tests
      server.test.ts
    fixtures/        # Test data and mocks
      mock-data.ts
      test-helpers.ts
```

### Test File Naming

- **Unit tests**: `[module-name].test.ts`
- **Integration tests**: `[feature-name].integration.test.ts`
- **End-to-end tests**: `[workflow-name].e2e.test.ts`

## Test Structure Standards

### 1. Import Organization

```typescript
// External dependencies first
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';

// Internal imports grouped by type
import { ValidationUtils } from '../utils/validation.js';
import { MockApiClient } from './fixtures/mock-api-client.js';
import type { SearchParams } from '../types/search-types.js';
```

### 2. Test Suite Structure

```typescript
describe('ModuleName', () => {
  // Setup variables
  let mockApiClient: jest.Mocked<ApiClient>;
  let validationUtils: ValidationUtils;

  beforeEach(() => {
    // Fresh setup for each test
    mockApiClient = createMockApiClient();
    validationUtils = new ValidationUtils(mockApiClient);
  });

  afterEach(() => {
    // Cleanup
    jest.clearAllMocks();
  });

  describe('methodName', () => {
    it('should return valid result when given valid input', () => {
      // Arrange
      const input = { valid: 'data' };
      const expectedOutput = { result: 'success' };

      // Act
      const result = validationUtils.validate(input);

      // Assert
      expect(result).toEqual(expectedOutput);
    });

    it('should throw ValidationError when given invalid input', () => {
      // Arrange
      const invalidInput = { invalid: 'data' };

      // Act & Assert
      expect(() => validationUtils.validate(invalidInput)).toThrow(
        ValidationError
      );
    });
  });
});
```

### 3. Test Naming Convention

Use descriptive test names following this pattern:

```typescript
it('should [expected behavior] when [condition/input]', () => {});
```

Examples:

```typescript
it('should return normalized parameters when given valid search params', () => {});
it('should throw ValidationError when entity type is unsupported', () => {});
it('should filter results client-side when server-side filtering unavailable', () => {});
```

## Mock and Test Data Standards

### 1. Mock Creation Patterns

```typescript
// ✅ Good: Create specific, focused mocks
const createMockFeature = (overrides: Partial<Feature> = {}): Feature => ({
  id: 'feat-123',
  name: 'Test Feature',
  status: { id: 'active', name: 'Active' },
  owner: { email: 'test@example.com' },
  ...overrides,
});

// ✅ Good: Use jest.mocked for type-safe mocking
const mockApiClient = jest.mocked(apiClient);
mockApiClient.get.mockResolvedValue({ data: mockFeatures });
```

### 2. Test Data Organization

```typescript
// tests/fixtures/mock-data.ts
export const MOCK_FEATURES: Feature[] = [
  {
    id: 'feat-1',
    name: 'User Authentication',
    status: { id: 'active', name: 'Active' },
    owner: { email: 'dev@company.com' },
  },
  // ... more test data
];

export const MOCK_SEARCH_PARAMS: SearchParams = {
  entityType: 'features',
  filters: { status: 'active' },
  limit: 10,
};
```

### 3. Mock Helper Functions

```typescript
// tests/fixtures/test-helpers.ts
export const createMockToolResponse = (data: any): ToolResponse => ({
  content: [{ type: 'text', text: JSON.stringify(data) }],
});

export const expectValidationError = (
  fn: () => void,
  expectedMessage: string
) => {
  expect(fn).toThrow(ValidationError);
  try {
    fn();
  } catch (error) {
    expect((error as ValidationError).message).toContain(expectedMessage);
  }
};
```

## Async Testing Standards

### 1. Promise-Based Tests

```typescript
it('should handle async operations correctly', async () => {
  // Arrange
  const mockData = { id: 'test' };
  mockApiClient.fetchData.mockResolvedValue(mockData);

  // Act
  const result = await service.getData();

  // Assert
  expect(result).toEqual(mockData);
  expect(mockApiClient.fetchData).toHaveBeenCalledTimes(1);
});
```

### 2. Error Handling Tests

```typescript
it('should handle API errors gracefully', async () => {
  // Arrange
  const apiError = new Error('API Error');
  mockApiClient.fetchData.mockRejectedValue(apiError);

  // Act & Assert
  await expect(service.getData()).rejects.toThrow('API Error');
});
```

## Tool Handler Testing Standards

### 1. Tool Function Tests

```typescript
describe('handleFeaturesTool', () => {
  it('should route to correct function based on operation name', async () => {
    // Arrange
    const mockParams = { entityType: 'features', limit: 10 };

    // Act
    const result = await handleFeaturesTool('get_features', mockParams);

    // Assert
    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('features');
  });

  it('should handle invalid operation gracefully', async () => {
    // Arrange
    const invalidOperation = 'invalid_operation';

    // Act & Assert
    await expect(handleFeaturesTool(invalidOperation, {})).rejects.toThrow(
      /Unknown operation/
    );
  });
});
```

### 2. Schema Validation Tests

```typescript
describe('tool schema validation', () => {
  it('should validate required parameters correctly', () => {
    // Test required parameter validation
    const toolDef = getFeatureToolDefinition('get_features');
    const requiredParams = toolDef.inputSchema.required;

    expect(requiredParams).toContain('entityType');
    expect(requiredParams).not.toContain('limit'); // optional
  });
});
```

## Utility Function Testing Standards

### 1. Pure Function Tests

```typescript
describe('ValidationUtils.normalizeParams', () => {
  it('should normalize limit to minimum of 1', () => {
    // Arrange
    const params = { limit: -5 };

    // Act
    const result = ValidationUtils.normalizeParams(params);

    // Assert
    expect(result.limit).toBe(1);
  });

  it('should normalize limit to maximum of 100', () => {
    // Arrange
    const params = { limit: 500 };

    // Act
    const result = ValidationUtils.normalizeParams(params);

    // Assert
    expect(result.limit).toBe(100);
  });
});
```

### 2. Class Method Tests

```typescript
describe('SearchEngine', () => {
  let searchEngine: SearchEngine;

  beforeEach(() => {
    searchEngine = new SearchEngine();
  });

  describe('validateAndNormalizeParams', () => {
    it('should normalize entity type to array format', async () => {
      // Arrange
      const params = { entityType: 'features' };

      // Act
      const result = await searchEngine.validateAndNormalizeParams(params);

      // Assert
      expect(result.entityTypes).toEqual(['features']);
    });
  });
});
```

## Integration Testing Standards

### 1. Server Integration Tests

```typescript
describe('MCP Server Integration', () => {
  let server: Server;

  beforeAll(async () => {
    server = new Server({ name: 'test-server' });
    await server.connect(mockTransport);
  });

  afterAll(async () => {
    await server.close();
  });

  it('should handle list_tools request', async () => {
    // Act
    const result = await server.request({
      method: 'tools/list',
      params: {},
    });

    // Assert
    expect(result.tools).toBeDefined();
    expect(result.tools.length).toBeGreaterThan(0);
  });
});
```

## Coverage Requirements

### 1. Coverage Thresholds

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    statements: 90,
    branches: 90,
    functions: 90,
    lines: 90
  },
  // Stricter requirements for critical modules
  './src/tools/': {
    statements: 95,
    branches: 90,
    functions: 95,
    lines: 95
  },
  './src/utils/': {
    statements: 95,
    branches: 95,
    functions: 95,
    lines: 95
  }
}
```

### 2. Coverage Exclusions

Only exclude files that genuinely shouldn't be tested:

```javascript
coveragePathIgnorePatterns: [
  '/node_modules/',
  '/build/',
  '/generated/',
  '/__tests__/',
  '/tests/fixtures/',
];
```

## Performance Testing Standards

### 1. Timeout Configuration

```typescript
// For async operations that might take longer
it('should handle large dataset processing', async () => {
  // Act
  const result = await searchEngine.processLargeDataset(largeDataset);

  // Assert
  expect(result).toBeDefined();
}, 10000); // 10 second timeout for this specific test
```

### 2. Performance Assertions

```typescript
it('should complete search within performance bounds', async () => {
  // Arrange
  const startTime = Date.now();

  // Act
  await searchEngine.executeSearch(searchParams);

  // Assert
  const executionTime = Date.now() - startTime;
  expect(executionTime).toBeLessThan(1000); // Should complete within 1 second
});
```

## Error Testing Standards

### 1. Error Type Testing

```typescript
it('should throw specific error types for different failure modes', () => {
  // ValidationError for invalid input
  expect(() => validator.validate(invalidData)).toThrow(ValidationError);

  // ProductboardError for API issues
  expect(() => apiClient.handleResponse(errorResponse)).toThrow(
    ProductboardError
  );
});
```

### 2. Error Message Testing

```typescript
it('should provide helpful error messages', () => {
  try {
    validator.validate({ entityType: 'invalid' });
    fail('Should have thrown ValidationError');
  } catch (error) {
    expect(error).toBeInstanceOf(ValidationError);
    expect((error as ValidationError).message).toContain(
      'Unsupported entity type: invalid'
    );
    expect((error as ValidationError).field).toBe('entityType');
  }
});
```

## Test Environment Configuration

### 1. Environment Variables

```typescript
// tests/setup.ts
process.env.NODE_ENV = 'test';
process.env.PRODUCTBOARD_API_TOKEN = 'test-token';
```

### 2. Global Test Setup

```typescript
// tests/setup.ts
import { jest } from '@jest/globals';

// Global mocks
jest.mock('../src/utils/debug-logger.js', () => ({
  debugLog: jest.fn(),
}));

// Global test utilities
global.createMockResponse = (data: any) => ({
  content: [{ type: 'text', text: JSON.stringify(data) }],
});
```

## Test Documentation Standards

### 1. Complex Test Documentation

```typescript
/**
 * Test suite for SearchEngine multi-entity search functionality.
 *
 * This covers the complex scenario where a single search request
 * spans multiple entity types (features, products, components) and
 * requires result aggregation, type tagging, and unified pagination.
 */
describe('SearchEngine multi-entity search', () => {
  // Tests here
});
```

### 2. Test Case Documentation

```typescript
it('should aggregate results from multiple entity types with proper tagging', async () => {
  /**
   * This test verifies that when searching across multiple entity types:
   * 1. Results from all types are fetched in parallel
   * 2. Each result item gets tagged with its entity type
   * 3. Results are aggregated into a single response
   * 4. Pagination information is properly merged
   */
  // Test implementation
});
```

## Quality Gates

### 1. Pre-commit Requirements

- All tests must pass
- Coverage thresholds must be met
- ESLint and Prettier must pass
- TypeScript compilation must succeed

### 2. Test Review Checklist

- [ ] Test names are descriptive and follow naming convention
- [ ] Each test focuses on a single behavior
- [ ] Mocks are appropriate and focused
- [ ] Error cases are covered
- [ ] Async operations are properly tested
- [ ] Performance considerations are addressed
- [ ] Coverage meets or exceeds requirements

## Anti-Patterns to Avoid

### ❌ Don't

```typescript
// Vague test names
it('should work', () => {});

// Testing implementation details
expect(mockFunction).toHaveBeenCalledWith(expect.any(Object));

// Shared mutable state between tests
let sharedData = { count: 0 };

// Testing multiple behaviors in one test
it('should validate and normalize and format data', () => {
  // Too much in one test
});
```

### ✅ Do

```typescript
// Specific, descriptive test names
it('should return validation error when entityType is missing', () => {});

// Testing behavior, not implementation
expect(result.isValid).toBe(false);

// Isolated test data
beforeEach(() => {
  testData = createFreshTestData();
});

// Single responsibility per test
it('should validate required fields', () => {
  // Test only validation
});

it('should normalize parameter formats', () => {
  // Test only normalization
});
```

This testing standards document provides comprehensive guidelines for writing consistent, maintainable, and effective tests for the Productboard MCP Server project.
