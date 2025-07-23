# set_custom_field_value

## Description
Set value of a custom field for a hierarchy entity

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `body` | { type: string, value: any } | Yes | Custom field value data |
| `customField.id` | string | Yes | ID of the custom field to be set |
| `hierarchyEntity.id` | string | Yes | ID of the hierarchy entity |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "set_custom_field_value",
  "arguments": {
    "customField.id": "example-customField.id",
    "hierarchyEntity.id": "example-hierarchyEntity.id",
    "body": {
      "type": "text",
      "value": null
    },
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category
custom-fields

