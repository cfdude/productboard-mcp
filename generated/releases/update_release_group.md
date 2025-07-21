# update_release_group

## Description

Update an existing release group

## Parameters

| Parameter     | Type    | Required | Description                           |
| ------------- | ------- | -------- | ------------------------------------- |
| `id`          | string  | Yes      | Release group ID                      |
| `description` | string  | No       | Updated description                   |
| `instance`    | string  | No       | Productboard instance name (optional) |
| `isDefault`   | boolean | No       | Updated default status                |
| `name`        | string  | No       | Updated release group name            |
| `workspaceId` | string  | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "update_release_group",
  "arguments": {
    "id": "example-id",
    "name": "Example Name",
    "description": "Example content text"
  }
}
```

## Category

releases
