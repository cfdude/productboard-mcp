# add_note_tag

## Description

Add a tag to a note

## Parameters

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `noteId`      | string | Yes      | Note ID                               |
| `tagName`     | string | Yes      | Tag name to add                       |
| `instance`    | string | No       | Productboard instance name (optional) |
| `workspaceId` | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "add_note_tag",
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
