# update_feature_release_assignment

## Description

Update or create a feature release assignment

## Parameters

| Parameter     | Type    | Required | Description                                    |
| ------------- | ------- | -------- | ---------------------------------------------- |
| `featureId`   | string  | Yes      | Feature ID                                     |
| `isAssigned`  | boolean | Yes      | Whether the feature is assigned to the release |
| `releaseId`   | string  | Yes      | Release ID                                     |
| `instance`    | string  | No       | Productboard instance name (optional)          |
| `workspaceId` | string  | No       | Workspace ID (optional)                        |

## Example

```json
{
  "tool": "update_feature_release_assignment",
  "arguments": {
    "featureId": "example-featureId",
    "releaseId": "example-releaseId",
    "isAssigned": false,
    "instance": "example-instance",
    "workspaceId": "example-workspaceId"
  }
}
```

## Category

releases
