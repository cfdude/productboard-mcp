# submit_feedback_form

## Description
Submit a feedback form

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `content` | string | Yes | Feedback content |
| `email` | string | Yes | Email of the person submitting feedback |
| `formId` | string | Yes | Feedback form ID |
| `additionalFields` | object | No | Additional form fields as key-value pairs |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "submit_feedback_form",
  "arguments": {
    "formId": "example-formId",
    "email": "user@example.com",
    "content": "Example content text",
    "additionalFields": {},
    "instance": "example-instance"
  }
}
```

## Category
notes

