# remove_note_tag

## Description
Remove a tag from a note

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `noteId` | string | Yes | Note ID |
| `tagName` | string | Yes | Tag name to remove |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "remove_note_tag",
  "arguments": {
    "noteId": "example-noteId",
    "tagName": "Example Name",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category
notes

