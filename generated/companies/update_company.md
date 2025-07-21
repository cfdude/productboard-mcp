# update_company

## Description

Update a company

## Parameters

| Parameter     | Type                                                  | Required | Description                           |
| ------------- | ----------------------------------------------------- | -------- | ------------------------------------- |
| `body`        | { name: string, domain: string, description: string } | Yes      | Company data to update                |
| `id`          | string                                                | Yes      | Company ID                            |
| `instance`    | string                                                | No       | Productboard instance name (optional) |
| `workspaceId` | string                                                | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "update_company",
  "arguments": {
    "id": "example-id",
    "body": {
      "name": "Example Name",
      "domain": "example.com",
      "description": "Example content text"
    },
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

companies
