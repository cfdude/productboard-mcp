# create_user

## Description

Create a new user in Productboard

## Parameters

| Parameter     | Type   | Required | Description                             |
| ------------- | ------ | -------- | --------------------------------------- |
| `email`       | string | Yes      | User email address                      |
| `companyId`   | string | No       | Company ID to associate with the user   |
| `externalId`  | string | No       | External ID for the user                |
| `instance`    | string | No       | Productboard instance name (optional)   |
| `name`        | string | No       | User full name                          |
| `role`        | string | No       | User role (e.g., admin, member, viewer) |
| `workspaceId` | string | No       | Workspace ID (optional)                 |

## Example

```json
{
  "tool": "create_user",
  "arguments": {
    "email": "user@example.com",
    "name": "Example Name",
    "role": "example-role"
  }
}
```

## Category

users
