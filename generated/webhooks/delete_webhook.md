# delete_webhook

## Description

Delete a webhook subscription

## Parameters

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `id`          | string | Yes      | Webhook ID                            |
| `instance`    | string | No       | Productboard instance name (optional) |
| `workspaceId` | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "delete_webhook",
  "arguments": {
    "id": "example-id",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

webhooks
