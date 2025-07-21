# set_company_field_value

## Description

Set the value of a custom field for a specific company

## Parameters

| Parameter              | Type                     | Required | Description                           |
| ---------------------- | ------------------------ | -------- | ------------------------------------- |
| `body`                 | { value: string,number } | Yes      | Field value                           |
| `companyCustomFieldId` | string                   | Yes      | Company custom field ID               |
| `companyId`            | string                   | Yes      | Company ID                            |
| `instance`             | string                   | No       | Productboard instance name (optional) |
| `workspaceId`          | string                   | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "set_company_field_value",
  "arguments": {
    "companyId": "example-companyId",
    "companyCustomFieldId": "example-companyCustomFieldId",
    "body": {
      "value": null
    },
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

companies
