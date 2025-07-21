# get_plugin_integrations

## Description

List all plugin integrations

## Parameters

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `instance`    | string | No       | Productboard instance name (optional) |
| `workspaceId` | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "get_plugin_integrations",
  "arguments": {
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

plugin-integrations
