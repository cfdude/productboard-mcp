# get_companies

## Description
List all companies

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `detail` | "basic" | "standard" | "full" | No | Level of detail (basic, standard, full) |
| `featureId` | string | No | Filter by feature ID |
| `hasNotes` | boolean | No | Filter companies that have notes |
| `includeSubData` | boolean | No | Include nested sub-data |
| `instance` | string | No | Productboard instance name (optional) |
| `limit` | number | No | Maximum number of records to return (1-100) |
| `startWith` | number | No | Number of records to skip |
| `term` | string | No | Search term |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "get_companies",
  "arguments": {
    "limit": 25,
    "startWith": 0
  }
}
```

## Category
companies

