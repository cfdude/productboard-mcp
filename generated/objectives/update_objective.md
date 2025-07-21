# update_objective

## Description

Update an existing objective

## Parameters

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `id`          | string | Yes      | Objective ID                          |
| `description` | string | No       | Updated description                   |
| `endDate`     | string | No       | Updated end date (YYYY-MM-DD)         |
| `instance`    | string | No       | Productboard instance name (optional) |
| `name`        | string | No       | Updated name                          |
| `ownerId`     | string | No       | Updated owner ID                      |
| `startDate`   | string | No       | Updated start date (YYYY-MM-DD)       |
| `workspaceId` | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "update_objective",
  "arguments": {
    "id": "example-id",
    "name": "Example Name",
    "description": "Example content text"
  }
}
```

## Category

objectives
