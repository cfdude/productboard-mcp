# update_release

## Description

Update an existing release

## Parameters

| Parameter     | Type     | Required      | Description                           |
| ------------- | -------- | ------------- | ------------------------------------- | ---------- | --- | --------------------- |
| `id`          | string   | Yes           | Release ID                            |
| `description` | string   | No            | Updated description                   |
| `instance`    | string   | No            | Productboard instance name (optional) |
| `name`        | string   | No            | Updated release name                  |
| `releaseDate` | string   | No            | Updated release date (YYYY-MM-DD)     |
| `startDate`   | string   | No            | Updated start date (YYYY-MM-DD)       |
| `state`       | "future" | "in_progress" | "released"                            | "archived" | No  | Updated release state |
| `workspaceId` | string   | No            | Workspace ID (optional)               |

## Example

```json
{
  "tool": "update_release",
  "arguments": {
    "id": "example-id",
    "name": "Example Name",
    "state": "future"
  }
}
```

## Category

releases
