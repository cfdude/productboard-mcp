# create_objective

## Description

Create a new objective

## Parameters

| Parameter     | Type   | Required | Description                            |
| ------------- | ------ | -------- | -------------------------------------- |
| `name`        | string | Yes      | Objective name                         |
| `description` | string | No       | Objective description                  |
| `endDate`     | string | No       | End date (YYYY-MM-DD)                  |
| `instance`    | string | No       | Productboard instance name (optional)  |
| `ownerId`     | string | No       | ID of the user who owns this objective |
| `startDate`   | string | No       | Start date (YYYY-MM-DD)                |
| `workspaceId` | string | No       | Workspace ID (optional)                |

## Example

```json
{
  "tool": "create_objective",
  "arguments": {
    "name": "Example Name",
    "description": "Example content text",
    "ownerId": "example-ownerId"
  }
}
```

## Category

objectives
