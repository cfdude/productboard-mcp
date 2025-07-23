# post_plugin_integration

## Description
Create a new plugin integration

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `body` | { type: string, name: string, integrationStatus: string, initialState: object, action: object } | Yes | Plugin integration data |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "post_plugin_integration",
  "arguments": {
    "body": {
      "type": "example-type",
      "name": "Example Name",
      "integrationStatus": "enabled",
      "initialState": {
        "label": "example-label"
      },
      "action": {
        "url": "https://example.com",
        "version": 10,
        "headers": {}
      }
    },
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category
plugin-integrations

