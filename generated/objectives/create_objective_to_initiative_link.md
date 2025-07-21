# create_objective_to_initiative_link

## Description

Create a new link between an objective and an initiative

## Parameters

| Parameter      | Type   | Required | Description                           |
| -------------- | ------ | -------- | ------------------------------------- |
| `id`           | string | Yes      | Objective ID                          |
| `initiativeId` | string | Yes      | Initiative ID to link                 |
| `instance`     | string | No       | Productboard instance name (optional) |
| `workspaceId`  | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "create_objective_to_initiative_link",
  "arguments": {
    "id": "example-id",
    "initiativeId": "example-initiativeId",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

objectives
