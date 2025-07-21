# list_release_groups

## Description

List all release groups

## Parameters

| Parameter        | Type    | Required   | Description                                                      |
| ---------------- | ------- | ---------- | ---------------------------------------------------------------- | --- | -------------------------------- |
| `detail`         | "basic" | "standard" | "full"                                                           | No  | Level of detail (default: basic) |
| `includeSubData` | boolean | No         | Include nested complex JSON sub-data                             |
| `instance`       | string  | No         | Productboard instance name (optional)                            |
| `limit`          | number  | No         | Maximum number of release groups to return (1-100, default: 100) |
| `startWith`      | number  | No         | Offset for pagination (default: 0)                               |
| `workspaceId`    | string  | No         | Workspace ID (optional)                                          |

## Example

```json
{
  "tool": "list_release_groups",
  "arguments": {
    "limit": 25,
    "startWith": 0
  }
}
```

## Category

releases
