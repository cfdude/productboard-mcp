# get_feature_release_assignment

## Description

Get a specific feature release assignment

## Parameters

| Parameter        | Type    | Required   | Description                           |
| ---------------- | ------- | ---------- | ------------------------------------- | --- | ----------------------------------- |
| `featureId`      | string  | Yes        | Feature ID                            |
| `releaseId`      | string  | Yes        | Release ID                            |
| `detail`         | "basic" | "standard" | "full"                                | No  | Level of detail (default: standard) |
| `includeSubData` | boolean | No         | Include nested complex JSON sub-data  |
| `instance`       | string  | No         | Productboard instance name (optional) |
| `workspaceId`    | string  | No         | Workspace ID (optional)               |

## Example

```json
{
  "tool": "get_feature_release_assignment",
  "arguments": {
    "featureId": "example-featureId",
    "releaseId": "example-releaseId",
    "detail": "basic",
    "includeSubData": false
  }
}
```

## Category

releases
