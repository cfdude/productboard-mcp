# Universal Search Tool Usage Guide

The search tool provides powerful, flexible searching across all Productboard entities with intelligent output control and messaging.

## Basic Usage

```javascript
// Find features missing descriptions
search({
  entityType: 'features',
  filters: { description: '' },
});

// Response:
// "Found 47 features. Filtered by: missing description"

// NEW: Search multiple entity types in a single request
search({
  entityType: ['products', 'components', 'features'],
  output: ['id', 'name'],
});

// Response:
// "Found 125 items across products, components, features"
// Data includes _entityType field to distinguish results
```

## Output Control Examples

### Get Only IDs (for bulk operations)

```javascript
search({
  entityType: 'features',
  filters: { description: '' },
  output: ['id'],
});

// Response data: ["feat-123", "feat-456", "feat-789"]
```

### Get Specific Fields

```javascript
search({
  entityType: 'features',
  filters: { archived: false },
  output: ['id', 'name', 'owner.email', 'status.name'],
});

// Response data:
// [
//   {
//     id: "feat-1",
//     name: "User Management",
//     owner: { email: "john@company.com" },
//     status: { name: "Active" }
//   }
// ]
```

### Preset Output Modes

```javascript
// Just IDs as simple array
search({ entityType: 'users', output: 'ids-only' });

// Key summary fields
search({ entityType: 'features', output: 'summary' });

// Full objects (default)
search({ entityType: 'notes', output: 'full' });
```

## Advanced Filtering

### Multiple Filters

```javascript
search({
  entityType: 'features',
  filters: {
    description: '',
    archived: false,
    'status.name': 'Active',
  },
});
```

### Multi-Entity Search

```javascript
// Search across multiple entity types simultaneously
search({
  entityType: ['products', 'components', 'features'],
  filters: { name: 'dashboard' },
  operators: { name: 'contains' },
  output: ['id', 'name', '_entityType'],
});

// Response data includes _entityType field:
// [
//   { id: "prod-1", name: "Admin Dashboard", _entityType: "products" },
//   { id: "comp-5", name: "Dashboard UI", _entityType: "components" },
//   { id: "feat-8", name: "Dashboard Analytics", _entityType: "features" }
// ]

// Note: Filters/output fields must be valid for at least one entity type
// Fields only available in some types will show a warning but still work
```

### Complex Operators

```javascript
search({
  entityType: 'notes',
  filters: {
    title: 'urgent',
    'company.domain': 'acme.com',
  },
  operators: {
    title: 'contains',
    'company.domain': 'equals',
  },
});
```

## Entity Types Supported

- `features` - Product features
- `notes` - Customer feedback notes
- `companies` - Customer companies
- `users` - Workspace users
- `products` - Product hierarchy
- `components` - Product components
- `releases` - Release management
- `release_groups` - Release groupings
- `objectives` - Strategic objectives
- `initiatives` - Strategic initiatives
- `key_results` - OKR key results
- `custom_fields` - Custom field definitions
- `webhooks` - Webhook subscriptions
- `plugin_integrations` - Plugin integrations
- `jira_integrations` - Jira integrations

## Pagination

```javascript
// First page
search({
  entityType: 'features',
  limit: 50,
  startWith: 0,
});

// Next page (based on response message hint)
search({
  entityType: 'features',
  limit: 50,
  startWith: 50,
});
```

## Parameter Interactions

### Output vs Detail Levels

```javascript
// When both are specified, output takes precedence
search({
  entityType: 'features',
  detail: 'basic', // Will be overridden
  output: ['id', 'name'], // This determines fields returned
});

// Response will include helpful warning:
// "Note: output parameter overrides detail level 'basic'"
```

## Intelligent Messaging Examples

### No Results

```
"No features found matching the search criteria. Filtered by: missing description.
Suggestions: Remove the description filter to see all features, then filter client-side if needed"
```

### Large Result Sets

```
"Found 150 notes, returning first 50. Filtered by: company domain = 'acme.com'.
Use startWith=50 to get the next batch.
Hint: Consider using output parameter to select only needed fields for better performance"
```

### Performance Warnings

```
"Found 25 features in 3200ms. Filtered by: archived status = false.
Note: Query took 3200ms - consider adding more specific filters or using pagination"
```

## Error Handling

### Invalid Entity Type

```javascript
search({ entityType: 'invalid' });
// Error: "Unsupported entity type: invalid. Supported types: features, notes, companies..."
```

### Invalid Fields

```javascript
search({
  entityType: 'features',
  output: ['id', 'nonexistent_field'],
});
// Error: "Invalid output fields: Output field 'nonexistent_field' is not available for features"
```

## Performance Tips

1. **Use output field selection** for large datasets
2. **Apply server-side filters** when possible (status, owner, etc.)
3. **Use pagination** for results over 50 items
4. **Prefer specific filters** over broad searches
5. **Consider ids-only mode** for bulk operations

## Multi-Entity Search Scenarios

### Searching Product Hierarchy

```javascript
// Find all product-related items with a common name pattern
search({
  entityType: ['products', 'components', 'features'],
  filters: { name: 'mobile' },
  operators: { name: 'contains' },
  output: ['id', 'name', '_entityType'],
});

// Response: "Found 32 items across products, components, features"
```

### Cross-Entity ID Collection

```javascript
// Collect IDs from multiple entity types for reporting
const result = search({
  entityType: ['features', 'objectives', 'initiatives'],
  output: 'ids-only',
  limit: 100,
});

// Response data: ["feat-1", "feat-2", "obj-1", "init-1", ...]
// Note: With ids-only mode, entity type distinction is lost
```

### Entity Type Filtering Considerations

```javascript
// When using filters that don't exist in all types
search({
  entityType: ['features', 'notes', 'companies'],
  filters: {
    status: 'active', // Only exists in features
  },
});

// Response includes warning:
// "Field 'status' is only searchable in: features"
// But search still executes, filtering features by status
```

## Real-World Scenarios

### Bulk Update Workflow

```javascript
// Step 1: Find items to update
const result = search({
  entityType: 'features',
  filters: { description: '' },
  output: ['id'],
});

// Step 2: Update each feature
result.data.forEach(id => {
  update_feature({ id, description: 'Updated description' });
});
```

### Data Analysis

```javascript
// Get feature status breakdown
search({
  entityType: 'features',
  output: ['id', 'name', 'status.name', 'owner.email'],
  filters: { archived: false },
});
```

### Reporting Dashboard

```javascript
// Get summary data for dashboard
search({
  entityType: 'releases',
  output: ['id', 'name', 'state', 'timeframe.endDate'],
  filters: { state: 'in_progress' },
});
```
