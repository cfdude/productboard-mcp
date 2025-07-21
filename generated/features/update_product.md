# update_product

## Description

Update a product

## Parameters

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `id`          | string | Yes      | Product ID                            |
| `description` | string | No       | Product description                   |
| `instance`    | string | No       | Productboard instance name (optional) |
| `name`        | string | No       | Product name                          |
| `workspaceId` | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "update_product",
  "arguments": {
    "id": "example-id",
    "name": "Example Name",
    "description": "Example content text"
  }
}
```

## Category

features
