# get_custom_fields

## Description

List all custom fields for hierarchy entities

## Parameters

| Parameter     | Type     | Required | Description                              |
| ------------- | -------- | -------- | ---------------------------------------- |
| `type`        | string[] | Yes      | Array of custom field types to filter by |
| `instance`    | string   | No       | Productboard instance name (optional)    |
| `workspaceId` | string   | No       | Workspace ID (optional)                  |

## Example

```json
{
  "tool": "get_custom_fields",
  "arguments": {
    "type": [],
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

custom-fields
