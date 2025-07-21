# update_company_field

## Description

Update a company custom field

## Parameters

| Parameter     | Type                           | Required | Description                           |
| ------------- | ------------------------------ | -------- | ------------------------------------- |
| `body`        | { name: string, type: string } | Yes      | Company field data to update          |
| `id`          | string                         | Yes      | Company field ID                      |
| `instance`    | string                         | No       | Productboard instance name (optional) |
| `workspaceId` | string                         | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "update_company_field",
  "arguments": {
    "id": "example-id",
    "body": {
      "name": "Example Name",
      "type": "text"
    },
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

companies
