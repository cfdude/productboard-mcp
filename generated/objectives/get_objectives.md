# get_objectives

## Description
List all objectives

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `detail` | "basic" | "standard" | "full" | No | Level of detail (default: basic) |
| `includeSubData` | boolean | No | Include nested complex JSON sub-data |
| `instance` | string | No | Productboard instance name (optional) |
| `limit` | number | No | Maximum number of objectives to return (1-100, default: 100) |
| `startWith` | number | No | Offset for pagination (default: 0) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "get_objectives",
  "arguments": {
    "limit": 25,
    "startWith": 0
  }
}
```

## Category
objectives

