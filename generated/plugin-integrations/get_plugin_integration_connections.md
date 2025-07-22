# get_plugin_integration_connections

## Description
List plugin integration connections for a specific integration

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Plugin integration ID |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "get_plugin_integration_connections",
  "arguments": {
    "id": "example-id",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category
plugin-integrations

