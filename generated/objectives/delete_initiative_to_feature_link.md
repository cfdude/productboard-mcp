# delete_initiative_to_feature_link

## Description

Delete a link between an initiative and a feature

## Parameters

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `featureId`   | string | Yes      | Feature ID to unlink                  |
| `id`          | string | Yes      | Initiative ID                         |
| `instance`    | string | No       | Productboard instance name (optional) |
| `workspaceId` | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "delete_initiative_to_feature_link",
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
