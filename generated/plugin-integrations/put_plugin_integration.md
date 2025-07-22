# put_plugin_integration

## Description
Update a plugin integration (PUT - deprecated)

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `body` | { type: string, name: string, integrationStatus: string, initialState: object, action: object } | Yes | Complete plugin integration data |
| `id` | string | Yes | Plugin integration ID |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "put_plugin_integration",
  "arguments": {
    "id": "example-id",
    "body": {
      "type": "example-type",
      "name": "Example Name",
      "integrationStatus": "enabled",
      "initialState": {},
      "action": {}
    },
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category
plugin-integrations

