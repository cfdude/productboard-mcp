# list_feature_release_assignments

## Description
List all feature release assignments

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `detail` | "basic" | "standard" | "full" | No | Level of detail (default: basic) |
| `featureId` | string | No | Filter by feature ID |
| `includeSubData` | boolean | No | Include nested complex JSON sub-data |
| `instance` | string | No | Productboard instance name (optional) |
| `limit` | number | No | Maximum number of assignments to return (1-100, default: 100) |
| `releaseEndDateFrom` | string | No | Filter by release end date from (YYYY-MM-DD) |
| `releaseEndDateTo` | string | No | Filter by release end date to (YYYY-MM-DD) |
| `releaseId` | string | No | Filter by release ID |
| `releaseState` | string | No | Filter by release state |
| `startWith` | number | No | Offset for pagination (default: 0) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "list_feature_release_assignments",
  "arguments": {
    "limit": 25,
    "startWith": 0
  }
}
```

## Category
releases

