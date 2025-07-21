# create_note

## Description

Create a new note in Productboard

## Parameters

| Parameter        | Type     | Required | Description                               |
| ---------------- | -------- | -------- | ----------------------------------------- |
| `content`        | string   | Yes      | Note content/body                         |
| `title`          | string   | Yes      | Note title                                |
| `companyDomain`  | string   | No       | Company domain to associate with the note |
| `displayUrl`     | string   | No       | Display URL for the note                  |
| `instance`       | string   | No       | Productboard instance name (optional)     |
| `ownerEmail`     | string   | No       | Email of the note owner                   |
| `sourceOrigin`   | string   | No       | Source origin (e.g., email, slack, api)   |
| `sourceRecordId` | string   | No       | Source record ID for tracking             |
| `tags`           | string[] | No       | Tags to apply to the note                 |
| `userEmail`      | string   | No       | Email of the user who created the note    |
| `userExternalId` | string   | No       | External ID for the user                  |
| `userName`       | string   | No       | Name of the user                          |
| `workspaceId`    | string   | No       | Workspace ID (optional)                   |

## Example

```json
{
  "tool": "create_note",
  "arguments": {
    "title": "Example Title",
    "content": "Example content text",
    "displayUrl": "https://example.com",
    "userEmail": "user@example.com"
  }
}
```

## Category

notes
