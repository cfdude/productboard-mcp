# get_company_field

## Description

Retrieve a specific company custom field

## Parameters

| Parameter     | Type   | Required | Description                           |
| ------------- | ------ | -------- | ------------------------------------- |
| `id`          | string | Yes      | Company field ID                      |
| `instance`    | string | No       | Productboard instance name (optional) |
| `workspaceId` | string | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "get_company_field",
  "arguments": {
    "id": "example-id",
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

companies
