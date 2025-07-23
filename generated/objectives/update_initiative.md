# update_initiative

## Description
Update an existing initiative

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Initiative ID |
| `description` | string | No | Updated description |
| `instance` | string | No | Productboard instance name (optional) |
| `name` | string | No | Updated name |
| `ownerId` | string | No | Updated owner ID |
| `status` | string | No | Updated status |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "update_initiative",
  "arguments": {
    "id": "example-id",
    "name": "Example Name",
    "description": "Example content text"
  }
}
```

## Category
objectives

