/**
 * Auto-generated custom fields management tools
 */
import { withContext, formatResponse } from "../../utils/tool-wrapper.js";
export function setupCustom() { }
fieldsTools();
{
    return [
        {
            name: "productboard_get_custom_fields",
            description: "List all custom fields",
            inputSchema: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        description: "type parameter"
                    },
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    instance: {
                        type: "string",
                        description: "instance parameter (optional)"
                    },
                    workspaceId: {
                        type: "string",
                        description: "workspaceId parameter (optional)"
                    },
                    includeRaw: {
                        type: "boolean",
                        description: "includeRaw parameter (optional)"
                    }
                },
                required: ["type"]
            }
        },
        {
            name: "productboard_get_custom_fields_values",
            description: "List all custom fields' values",
            inputSchema: {
                type: "object",
                properties: {
                    type: {
                        type: "string",
                        description: "type parameter (optional)"
                    },
                    customField, : .id
                }
            }
        }, {
            type: "string",
            description: "customField.id parameter (optional)"
        },
        hierarchyEntity.id, {
            type: "string",
            description: "hierarchyEntity.id parameter (optional)"
        },
        null, {
            type: "string",
            description: "null parameter (optional)"
        },
        instance, {
            type: "string",
            description: "instance parameter (optional)"
        },
        workspaceId, {
            type: "string",
            description: "workspaceId parameter (optional)"
        },
        includeRaw, {
            type: "boolean",
            description: "includeRaw parameter (optional)"
        }
    ];
}
{
    name: "productboard_get_custom_field",
        description;
    "Retrieve a custom field",
        inputSchema;
    {
        type: "object",
            properties;
        {
            id: {
                type: "string",
                    description;
                "id parameter";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
        required: ["id"];
    }
}
{
    name: "productboard_get_custom_field_value",
        description;
    "Retrieve a custom field's value",
        inputSchema;
    {
        type: "object",
            properties;
        {
            customField.id;
            {
                type: "string",
                    description;
                "customField.id parameter";
            }
            hierarchyEntity.id;
            {
                type: "string",
                    description;
                "hierarchyEntity.id parameter";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
        required: ["customField.id", "hierarchyEntity.id"];
    }
}
{
    name: "productboard_set_custom_field_value",
        description;
    "Set value of a custom field for a given hierarchy entity",
        inputSchema;
    {
        type: "object",
            properties;
        {
            customField.id;
            {
                type: "string",
                    description;
                "customField.id parameter";
            }
            hierarchyEntity.id;
            {
                type: "string",
                    description;
                "hierarchyEntity.id parameter";
            }
            body: {
                type: "string",
                    description;
                "body parameter";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
        required: ["customField.id", "hierarchyEntity.id", "body"];
    }
}
{
    name: "productboard_delete_custom_field_value",
        description;
    "Delete value of a custom field for a given hierarchy entity",
        inputSchema;
    {
        type: "object",
            properties;
        {
            customField.id;
            {
                type: "string",
                    description;
                "customField.id parameter";
            }
            hierarchyEntity.id;
            {
                type: "string",
                    description;
                "hierarchyEntity.id parameter";
            }
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            instance: {
                type: "string",
                    description;
                "instance parameter (optional)";
            }
            workspaceId: {
                type: "string",
                    description;
                "workspaceId parameter (optional)";
            }
            includeRaw: {
                type: "boolean",
                    description;
                "includeRaw parameter (optional)";
            }
        }
        required: ["customField.id", "hierarchyEntity.id"];
    }
}
;
export async function handleCustom() { }
fieldsTool(name, string, args, any);
{
    switch (name) {
        case "productboard_get_custom_fields":
            return await customGetFields(args);
        case "productboard_get_custom_fields_values":
            return await customGetFieldsvalues(args);
        case "productboard_get_custom_field":
            return await customGetField(args);
        case "productboard_get_custom_field_value":
            return await customGetFieldvalue(args);
        case "productboard_set_custom_field_value":
            return await customSetFieldvalue(args);
        case "productboard_delete_custom_field_value":
            return await customDeleteFieldvalue(args);
        default:
            throw new Error(`Unknown custom fields tool: ${name}`);
    }
}
export async function customGetFields(args) {
    return await withContext(async (context) => {
        const params = {};
        if (args.type)
            params.type = args.type;
        const response = await context.axios.get(`/hierarchy-entities/custom-fields`, { params });
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function customGetFieldsvalues(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/hierarchy-entities/custom-fields-values`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function customGetField(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/hierarchy-entities/custom-fields/${args.id}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function customGetFieldvalue(args) {
    return await withContext(async (context) => {
        const params = {};
        if (args.customField.id)
            params.customField.id = args.customField.id;
        if (args.hierarchyEntity.id)
            params.hierarchyEntity.id = args.hierarchyEntity.id;
        const response = await context.axios.get(`/hierarchy-entities/custom-fields-values/value`, { params });
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function customSetFieldvalue(args) {
    return await withContext(async (context) => {
        const params = {};
        if (args.customField.id)
            params.customField.id = args.customField.id;
        if (args.hierarchyEntity.id)
            params.hierarchyEntity.id = args.hierarchyEntity.id;
        const response = await context.axios.put(`/hierarchy-entities/custom-fields-values/value`, body, { params });
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function customDeleteFieldvalue(args) {
    return await withContext(async (context) => {
        const params = {};
        if (args.customField.id)
            params.customField.id = args.customField.id;
        if (args.hierarchyEntity.id)
            params.hierarchyEntity.id = args.hierarchyEntity.id;
        const response = await context.axios.delete(`/hierarchy-entities/custom-fields-values/value`, { params });
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
