# create_release_group

## Description
Create a new release group

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Release group name |
| `description` | string | No | Release group description |
| `instance` | string | No | Productboard instance name (optional) |
| `isDefault` | boolean | No | Whether this is the default release group |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "create_release_group",
  "arguments": {
    "name": "Example Name",
    "description": "Example content text",
    "isDefault": false
  }
}
```

## Category
releases

