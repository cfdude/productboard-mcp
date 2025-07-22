# get_notes

## Description
List all notes with filtering and pagination

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `allTags` | string | No | Filter by all of these tags (comma-separated) |
| `anyTag` | string | No | Filter by any of these tags (comma-separated) |
| `companyId` | string | No | Filter by company ID |
| `createdFrom` | string | No | Filter notes created from this date (YYYY-MM-DD) |
| `createdTo` | string | No | Filter notes created to this date (YYYY-MM-DD) |
| `dateFrom` | string | No | Filter notes by date from (YYYY-MM-DD) |
| `dateTo` | string | No | Filter notes by date to (YYYY-MM-DD) |
| `detail` | "basic" | "standard" | "full" | No | Level of detail (default: basic) |
| `featureId` | string | No | Filter by linked feature ID |
| `includeSubData` | boolean | No | Include nested complex JSON sub-data |
| `instance` | string | No | Productboard instance name (optional) |
| `limit` | number | No | Maximum number of notes to return (1-100, default: 100) |
| `ownerEmail` | string | No | Filter by owner email |
| `pageCursor` | string | No | Cursor for pagination |
| `source` | string | No | Filter by source |
| `startWith` | number | No | Offset for pagination (default: 0) |
| `term` | string | No | Search term for fulltext search |
| `updatedFrom` | string | No | Filter notes updated from this date (YYYY-MM-DD) |
| `updatedTo` | string | No | Filter notes updated to this date (YYYY-MM-DD) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "get_notes",
  "arguments": {
    "limit": 25,
    "startWith": 0
  }
}
```

## Category
notes

