# update_key_result

## Description

Update an existing key result

## Parameters

| Parameter      | Type   | Required | Description                           |
| -------------- | ------ | -------- | ------------------------------------- |
| `id`           | string | Yes      | Key result ID                         |
| `currentValue` | number | No       | Updated current value                 |
| `instance`     | string | No       | Productboard instance name (optional) |
| `name`         | string | No       | Updated name                          |
| `targetValue`  | number | No       | Updated target value                  |
| `workspaceId`  | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "update_key_result",
  "arguments": {
    "id": "example-id",
    "name": "Example Name",
    "currentValue": 10
  }
}
```

## Category

objectives
