# delete_custom_field_value

## Description
Delete value of a custom field for a hierarchy entity

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customField.id` | string | Yes | ID of the custom field |
| `hierarchyEntity.id` | string | Yes | ID of the hierarchy entity |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "delete_custom_field_value",
  "arguments": {
    "customField.id": "example-customField.id",
    "hierarchyEntity.id": "example-hierarchyEntity.id",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category
custom-fields

