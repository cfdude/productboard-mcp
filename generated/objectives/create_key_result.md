# create_key_result

## Description

Create a new key result

## Parameters

| Parameter      | Type     | Required     | Description                                    |
| -------------- | -------- | ------------ | ---------------------------------------------- | --------- | --- | ------------------------- |
| `name`         | string   | Yes          | Key result name                                |
| `objectiveId`  | string   | Yes          | ID of the objective this key result belongs to |
| `targetValue`  | number   | Yes          | Target value                                   |
| `type`         | "number" | "percentage" | "currency"                                     | "boolean" | Yes | Type of key result metric |
| `currentValue` | number   | No           | Current value                                  |
| `instance`     | string   | No           | Productboard instance name (optional)          |
| `startValue`   | number   | No           | Starting value                                 |
| `workspaceId`  | string   | No           | Workspace ID (optional)                        |

## Example

```json
{
  "tool": "create_key_result",
  "arguments": {
    "name": "Example Name",
    "objectiveId": "example-objectiveId",
    "type": "number",
    "targetValue": 10,
    "startValue": 10,
    "currentValue": 10
  }
}
```

## Category

objectives
