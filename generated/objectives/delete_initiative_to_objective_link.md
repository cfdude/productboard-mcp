# delete_initiative_to_objective_link

## Description

Delete a link between an initiative and an objective

## Parameters

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `id`          | string | Yes      | Initiative ID                         |
| `objectiveId` | string | Yes      | Objective ID to unlink                |
| `instance`    | string | No       | Productboard instance name (optional) |
| `workspaceId` | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "delete_initiative_to_objective_link",
  "arguments": {
    "id": "example-id",
    "objectiveId": "example-objectiveId",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

objectives
