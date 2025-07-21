# create_component

## Description

Create a new component in Productboard

## Parameters

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `name`        | string | Yes      | Component name                        |
| `description` | string | No       | Component description                 |
| `instance`    | string | No       | Productboard instance name (optional) |
| `productId`   | string | No       | Product ID this component belongs to  |
| `workspaceId` | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "create_component",
  "arguments": {
    "name": "Example Name",
    "description": "Example content text",
    "productId": "example-productId"
  }
}
```

## Category

features
