# delete_plugin_integration_connection

## Description
Delete a plugin integration connection (reset to initial state)

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `featureId` | string | Yes | Feature ID |
| `id` | string | Yes | Plugin integration ID |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "delete_plugin_integration_connection",
  "arguments": {
    "id": "example-id",
    "featureId": "example-featureId",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category
plugin-integrations

