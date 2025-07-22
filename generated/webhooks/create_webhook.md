# create_webhook

## Description
Create a new webhook subscription

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `events` | object[] | Yes | Array of event types to subscribe to (e.g., [{eventType: "feature.created"}, {eventType: "note.updated"}]) |
| `name` | string | Yes | Name for the webhook subscription |
| `url` | string | Yes | Webhook URL to receive notifications |
| `headers` | object | No | Optional headers to include in webhook requests (e.g., {"X-Custom-Header": "value", "Content-Type": "application/json"}) |
| `instance` | string | No | Productboard instance name (optional) |
| `version` | number | No | Notification version (default: 1) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "create_webhook",
  "arguments": {
    "events": [],
    "name": "Example Name",
    "url": "https://example.com",
    "headers": {},
    "version": 10
  }
}
```

## Category
webhooks

