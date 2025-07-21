# get_custom_fields_values

## Description

List all custom field values

## Parameters

| Parameter            | Type     | Required | Description                                                             |
| -------------------- | -------- | -------- | ----------------------------------------------------------------------- |
| `customField.id`     | string   | No       | Show values for specific custom field (mandatory if type not specified) |
| `hierarchyEntity.id` | string   | No       | Show values for specific hierarchy entity (optional)                    |
| `instance`           | string   | No       | Productboard instance name (optional)                                   |
| `type`               | string[] | No       | Array of custom field types (mandatory if customField.id not specified) |
| `workspaceId`        | string   | No       | Workspace ID (optional)                                                 |

## Example

```json
{
  "tool": "get_custom_fields_values",
  "arguments": {
    "type": [],
    "customField.id": "example-customField.id"
  }
}
```

## Category

custom-fields
