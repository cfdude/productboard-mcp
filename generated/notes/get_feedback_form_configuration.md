# get_feedback_form_configuration

## Description

Get a specific feedback form configuration

## Parameters

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `id`          | string | Yes      | Feedback form configuration ID        |
| `instance`    | string | No       | Productboard instance name (optional) |
| `workspaceId` | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "get_feedback_form_configuration",
  "arguments": {
    "id": "example-id",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

notes
