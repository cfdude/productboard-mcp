# add_note_followers

## Description
Add followers to a note

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `emails` | string[] | Yes | Array of email addresses to add as followers |
| `noteId` | string | Yes | Note ID |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "add_note_followers",
  "arguments": {
    "noteId": "example-noteId",
    "emails": [
      "user1@example.com",
      "user2@example.com"
    ],
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category
notes

