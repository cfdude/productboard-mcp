# get_jira_integration_connections

## Description

List all JIRA integration connections for a specific integration

## Parameters

| Parameter             | Type   | Required | Description                                 |
| --------------------- | ------ | -------- | ------------------------------------------- |
| `id`                  | string | Yes      | JIRA integration ID                         |
| `connection.issueId`  | string | No       | Filter by JIRA issue ID (e.g., "123456")    |
| `connection.issueKey` | string | No       | Filter by JIRA issue key (e.g., "JIRA-123") |
| `instance`            | string | No       | Productboard instance name (optional)       |
| `workspaceId`         | string | No       | Workspace ID (optional)                     |

## Example

```json
{
  "tool": "get_jira_integration_connections",
  "arguments": {
    "id": "example-id",
    "connection.issueKey": "example-connection.issueKey",
    "connection.issueId": "example-connection.issueId"
  }
}
```

## Category

jira-integrations
