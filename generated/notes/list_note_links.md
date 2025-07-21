# list_note_links

## Description

List all links on a note

## Parameters

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `noteId`      | string | Yes      | Note ID                               |
| `instance`    | string | No       | Productboard instance name (optional) |
| `workspaceId` | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "list_note_links",
  "arguments": {
    "noteId": "example-noteId",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

notes
