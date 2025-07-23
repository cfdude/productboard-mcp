# create_note_link

## Description
Create a link from a note to another entity

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `entityId` | string | Yes | ID of entity to link to (e.g., feature ID) |
| `noteId` | string | Yes | Note ID |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "create_note_link",
  "arguments": {
    "noteId": "example-noteId",
    "entityId": "example-entityId",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category
notes

