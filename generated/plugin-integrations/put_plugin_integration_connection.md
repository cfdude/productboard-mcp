# put_plugin_integration_connection

## Description

Set the state of a plugin integration connection

## Parameters

| Parameter     | Type                   | Required | Description                           |
| ------------- | ---------------------- | -------- | ------------------------------------- |
| `body`        | { connection: object } | Yes      | Connection configuration              |
| `featureId`   | string                 | Yes      | Feature ID                            |
| `id`          | string                 | Yes      | Plugin integration ID                 |
| `instance`    | string                 | No       | Productboard instance name (optional) |
| `workspaceId` | string                 | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "put_plugin_integration_connection",
  "arguments": {
    "id": "example-id",
    "featureId": "example-featureId",
    "body": {
      "connection": {
        "state": "initial",
        "label": "example-label",
        "hoverLabel": "example-hoverLabel",
        "tooltip": "example-tooltip",
        "color": "blue",
        "targetUrl": "https://example.com"
      }
    },
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

plugin-integrations
