# create_feature

## Description

Create a new feature in Productboard

## Parameters

| Parameter     | Type                         | Required | Description                                  |
| ------------- | ---------------------------- | -------- | -------------------------------------------- |
| `name`        | string                       | Yes      | Feature name                                 |
| `description` | string                       | No       | Feature description                          |
| `instance`    | string                       | No       | Productboard instance name (optional)        |
| `owner`       | { email: string }            | No       |                                              |
| `parent`      | { id: string, type: string } | No       | Parent entity to associate this feature with |
| `status`      | { id: string, name: string } | No       |                                              |
| `workspaceId` | string                       | No       | Workspace ID (optional)                      |

## Example

```json
{
  "tool": "create_feature",
  "arguments": {
    "name": "Example Name",
    "description": "Example content text",
    "status": {
      "id": "example-id",
      "name": "Example Name"
    }
  }
}
```

## Category

features
