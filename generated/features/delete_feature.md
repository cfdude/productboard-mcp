# delete_feature

## Description

Delete a feature

## Parameters

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `id`          | string | Yes      | Feature ID                            |
| `instance`    | string | No       | Productboard instance name (optional) |
| `workspaceId` | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "delete_feature",
  "arguments": {
    "id": "example-id",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

features
