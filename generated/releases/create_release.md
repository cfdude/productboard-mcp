# create_release

## Description
Create a new release

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Release name |
| `releaseGroupId` | string | Yes | Release group ID |
| `description` | string | No | Release description |
| `instance` | string | No | Productboard instance name (optional) |
| `releaseDate` | string | No | Release date (YYYY-MM-DD) |
| `startDate` | string | No | Release start date (YYYY-MM-DD) |
| `state` | "future" | "in_progress" | "released" | "archived" | No | Release state |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "create_release",
  "arguments": {
    "name": "Example Name",
    "releaseGroupId": "example-releaseGroupId",
    "state": "future",
    "description": "Example content text"
  }
}
```

## Category
releases

