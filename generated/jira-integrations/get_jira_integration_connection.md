# get_jira_integration_connection

## Description
Retrieve a specific JIRA integration connection between a feature and JIRA issue

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `featureId` | string | Yes | Feature ID |
| `id` | string | Yes | JIRA integration ID |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "get_jira_integration_connection",
  "arguments": {
    "id": "example-id",
    "featureId": "example-featureId",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category
jira-integrations

