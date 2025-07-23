# update_user

## Description
Update an existing user

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | User ID |
| `companyId` | string | No | Updated company ID |
| `externalId` | string | No | Updated external ID |
| `instance` | string | No | Productboard instance name (optional) |
| `name` | string | No | Updated user name |
| `role` | string | No | Updated user role |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "update_user",
  "arguments": {
    "id": "example-id",
    "name": "Example Name",
    "role": "example-role"
  }
}
```

## Category
users

