# create_objective_to_feature_link

## Description

Create a new link between an objective and a feature

## Parameters

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `featureId`   | string | Yes      | Feature ID to link                    |
| `id`          | string | Yes      | Objective ID                          |
| `instance`    | string | No       | Productboard instance name (optional) |
| `workspaceId` | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "create_objective_to_feature_link",
  "arguments": {
    "id": "example-id",
    "featureId": "example-featureId",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

objectives
