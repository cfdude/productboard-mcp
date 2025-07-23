# create_company

## Description
Create a new company

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Company name |
| `description` | string | No | Company description |
| `domain` | string | No | Company domain |
| `externalId` | string | No | External ID for the company |
| `instance` | string | No | Productboard instance name (optional) |
| `workspaceId` | string | No | Workspace ID (optional) |

## Example

```json
{
  "tool": "create_company",
  "arguments": {
    "name": "Example Name",
    "domain": "example.com",
    "description": "Example content text"
  }
}
```

## Category
companies

