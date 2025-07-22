# update_component

## Description
Update a component

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Component ID |
| `description` | string | No | Component description |
| `instance` | string | No | Productboard instance name (optional) |
| `name` | string | No | Component name |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "update_component",
  "arguments": {
    "id": "example-id",
    "name": "Example Name",
    "description": "Example content text"
  }
}
```

## Category
features

