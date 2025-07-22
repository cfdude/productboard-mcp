# create_initiative

## Description
Create a new initiative

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Initiative name |
| `description` | string | No | Initiative description |
| `instance` | string | No | Productboard instance name (optional) |
| `ownerId` | string | No | ID of the user who owns this initiative |
| `status` | string | No | Initiative status |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "create_initiative",
  "arguments": {
    "name": "Example Name",
    "description": "Example content text",
    "ownerId": "example-ownerId"
  }
}
```

## Category
objectives

