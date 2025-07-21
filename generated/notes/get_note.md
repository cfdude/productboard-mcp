# get_note

## Description

Get a specific note by ID

## Parameters

| Parameter        | Type    | Required   | Description                           |
| ---------------- | ------- | ---------- | ------------------------------------- | --- | ----------------------------------- |
| `id`             | string  | Yes        | Note ID                               |
| `detail`         | "basic" | "standard" | "full"                                | No  | Level of detail (default: standard) |
| `includeSubData` | boolean | No         | Include nested complex JSON sub-data  |
| `instance`       | string  | No         | Productboard instance name (optional) |
| `workspaceId`    | string  | No         | Workspace ID (optional)               |

## Example

```json
{
  "tool": "get_note",
  "arguments": {
    "id": "example-id",
    "detail": "basic",
    "includeSubData": false
  }
}
```

## Category

notes
