# remove_note_follower

## Description

Remove a follower from a note

## Parameters

| Parameter     | Type   | Required | Description                            |
| ------------- | ------ | -------- | -------------------------------------- |
| `email`       | string | Yes      | Email address to remove from followers |
| `noteId`      | string | Yes      | Note ID                                |
| `instance`    | string | No       | Productboard instance name (optional)  |
| `workspaceId` | string | No       | Workspace ID (optional)                |

## Example

```json
{
  "tool": "remove_note_follower",
  "arguments": {
    "noteId": "example-noteId",
    "email": "user@example.com",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

notes
