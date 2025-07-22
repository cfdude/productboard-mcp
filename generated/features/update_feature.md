# update_feature

## Description
Update a feature

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Feature ID |
| `archived` | boolean | No | Archive status |
| `description` | string | No | Feature description |
| `instance` | string | No | Productboard instance name (optional) |
| `name` | string | No | Feature name |
| `owner` | { email: string } | No |  |
| `status` | { id: string, name: string } | No |  |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "update_feature",
  "arguments": {
    "id": "example-id",
    "name": "Example Name",
    "description": "Example content text"
  }
}
```

## Category
features

