# delete_release_group

## Description
Delete a release group

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Release group ID |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "delete_release_group",
  "arguments": {
    "id": "example-id",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category
releases

