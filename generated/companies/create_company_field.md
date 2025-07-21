# create_company_field

## Description

Create a new custom field for companies

## Parameters

| Parameter     | Type                           | Required | Description                           |
| ------------- | ------------------------------ | -------- | ------------------------------------- |
| `body`        | { name: string, type: string } | Yes      | Company field data                    |
| `instance`    | string                         | No       | Productboard instance name (optional) |
| `workspaceId` | string                         | No       | Workspace ID (optional)               |

## Example

```json
{
  "tool": "create_company_field",
  "arguments": {
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
