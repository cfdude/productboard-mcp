# get_features

## Description
List all features in Productboard

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `archived` | boolean | No | Filter by archived status |
| `detail` | "basic" | "standard" | "full" | No | Level of detail (default: basic) |
| `includeSubData` | boolean | No | Include nested complex JSON sub-data |
| `instance` | string | No | Productboard instance name (optional) |
| `limit` | number | No | Maximum number of features to return (1-100, default: 100) |
| `noteId` | string | No | Filter by associated note ID |
| `ownerEmail` | string | No | Filter by owner email |
| `parentId` | string | No | Filter by parent feature ID |
| `startWith` | number | No | Offset for pagination (default: 0) |
| `statusId` | string | No | Filter by status ID |
| `statusName` | string | No | Filter by status name |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "get_features",
  "arguments": {
    "limit": 25,
    "startWith": 0
  }
}
```

## Category
features

