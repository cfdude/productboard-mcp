# get_company

## Description

Retrieve a specific company

## Parameters

| Parameter        | Type    | Required   | Description                           |
| ---------------- | ------- | ---------- | ------------------------------------- | --- | --------------------------------------- |
| `id`             | string  | Yes        | Company ID                            |
| `detail`         | "basic" | "standard" | "full"                                | No  | Level of detail (basic, standard, full) |
| `includeSubData` | boolean | No         | Include nested sub-data               |
| `instance`       | string  | No         | Productboard instance name (optional) |
| `workspaceId`    | string  | No         | Workspace ID (optional)               |

## Example

```json
{
  "tool": "get_company",
  "arguments": {
    "id": "example-id",
    "detail": "basic",
    "includeSubData": false
  }
}
```

## Category

companies
