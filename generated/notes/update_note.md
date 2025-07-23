# update_note

## Description
Update an existing note

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Note ID |
| `content` | string | No | Updated content |
| `instance` | string | No | Productboard instance name (optional) |
| `tags` | string[] | No | Updated tags (replaces existing tags) |
| `title` | string | No | Updated title |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "update_note",
  "arguments": {
    "id": "example-id",
    "title": "Example Title",
    "content": "Example content text"
  }
}
```

## Category
notes

