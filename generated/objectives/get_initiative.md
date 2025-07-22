# get_initiative

## Description
Get a specific initiative by ID

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Initiative ID |
| `detail` | "basic" | "standard" | "full" | No | Level of detail (default: standard) |
| `includeSubData` | boolean | No | Include nested complex JSON sub-data |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "get_initiative",
  "arguments": {
    "id": "example-id",
    "detail": "basic",
    "includeSubData": false
  }
}
```

## Category
objectives

