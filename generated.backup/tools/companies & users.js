/**
 * Auto-generated companies & users management tools
 */
import { withContext, formatResponse } from "../../utils/tool-wrapper.js";
export function setupCompanies() { }
 & usersTools();
{
    return [
        {
            name: "productboard_create_company",
            description: "Create a company",
            inputSchema: {
                type: "object",
                properties: {
                    null: {
                        type: "string",
                        description: "null parameter (optional)"
                    },
                    Productboard
                } - Partner - Id
            }
        }, {
            type: "string",
            description: "Productboard-Partner-Id parameter (optional)"
        },
        body, {
            type: "string",
            description: "body parameter (optional)"
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
    name: "productboard_get_companies",
        description;
    "List all companies",
        inputSchema;
    {
        type: "object",
            properties;
        {
            null;
            {
                type: "string",
                    description;
                "null parameter (optional)";
            }
            pageLimit: {
                type: "string",
                    description;
                "pageLimit parameter (optional)";
            }
            pageOffset: {
                type: "string",
                    description;
                "pageOffset parameter (optional)";
            }
            term: {
                type: "string",
                    description;
                "term parameter (optional)";
            }
            hasNotes: {
                type: "string",
                    description;
                "hasNotes parameter (optional)";
            }
            featureId: {
                type: "string",
                    description;
                "featureId parameter (optional)";
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
    }
}
{
    name: "productboard_get_company",
        description;
    "Retrieve company",
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
    name: "productboard_update_company",
        description;
    "Update a company",
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
        required: ["id", "body"];
    }
}
{
    name: "productboard_delete_company",
        description;
    "Delete a company",
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
    name: "productboard_create_company_field",
        description;
    "Create a company field",
        inputSchema;
    {
        type: "object",
            properties;
        {
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
        required: ["body"];
    }
}
{
    name: "productboard_list_company_fields",
        description;
    "Retrieve company fields",
        inputSchema;
    {
        type: "object",
            properties;
        {
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
    }
}
{
    name: "productboard_get_company_field",
        description;
    "Retrieve a company field",
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
    name: "productboard_update_company_field",
        description;
    "Update a company field",
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
        required: ["id", "body"];
    }
}
{
    name: "productboard_delete_company_field",
        description;
    "Delete a company field",
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
    name: "productboard_get_company_field_value",
        description;
    "Retrieve company field value",
        inputSchema;
    {
        type: "object",
            properties;
        {
            companyId: {
                type: "string",
                    description;
                "companyId parameter";
            }
            companyCustomFieldId: {
                type: "string",
                    description;
                "companyCustomFieldId parameter";
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
        required: ["companyId", "companyCustomFieldId"];
    }
}
{
    name: "productboard_set_company_field_value",
        description;
    "Sets company field value",
        inputSchema;
    {
        type: "object",
            properties;
        {
            companyId: {
                type: "string",
                    description;
                "companyId parameter";
            }
            companyCustomFieldId: {
                type: "string",
                    description;
                "companyCustomFieldId parameter";
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
        required: ["companyId", "companyCustomFieldId", "body"];
    }
}
{
    name: "productboard_delete_company_field_value",
        description;
    "Delete company field value",
        inputSchema;
    {
        type: "object",
            properties;
        {
            companyId: {
                type: "string",
                    description;
                "companyId parameter";
            }
            companyCustomFieldId: {
                type: "string",
                    description;
                "companyCustomFieldId parameter";
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
        required: ["companyId", "companyCustomFieldId"];
    }
}
{
    name: "productboard_get_users",
        description;
    "List all users",
        inputSchema;
    {
        type: "object",
            properties;
        {
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
    }
}
{
    name: "productboard_create_user",
        description;
    "Create a user",
        inputSchema;
    {
        type: "object",
            properties;
        {
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
        required: ["body"];
    }
}
{
    name: "productboard_get_user",
        description;
    "Retrieve a user",
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
    name: "productboard_update_user",
        description;
    "Update a user",
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
        required: ["id", "body"];
    }
}
{
    name: "productboard_delete_user",
        description;
    "Delete a user",
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
;
export async function handleCompanies() { }
 & usersTool(name, string, args, any);
{
    switch (name) {
        case "productboard_create_company":
            return await companyCreate(args);
        case "productboard_get_companies":
            return await companiesGet(args);
        case "productboard_get_company":
            return await companyGet(args);
        case "productboard_update_company":
            return await companyUpdate(args);
        case "productboard_delete_company":
            return await companyDelete(args);
        case "productboard_create_company_field":
            return await companyCreateField(args);
        case "productboard_list_company_fields":
            return await companyListFields(args);
        case "productboard_get_company_field":
            return await companyGetField(args);
        case "productboard_update_company_field":
            return await companyUpdateField(args);
        case "productboard_delete_company_field":
            return await companyDeleteField(args);
        case "productboard_get_company_field_value":
            return await companyGetFieldvalue(args);
        case "productboard_set_company_field_value":
            return await companySetFieldvalue(args);
        case "productboard_delete_company_field_value":
            return await companyDeleteFieldvalue(args);
        case "productboard_get_users":
            return await usersGet(args);
        case "productboard_create_user":
            return await userCreate(args);
        case "productboard_get_user":
            return await userGet(args);
        case "productboard_update_user":
            return await userUpdate(args);
        case "productboard_delete_user":
            return await userDelete(args);
        default:
            throw new Error(`Unknown companies & users tool: ${name}`);
    }
}
export async function companyCreate(args) {
    return await withContext(async (context) => {
        const response = await context.axios.post(`/companies`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function companiesGet(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/companies`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function companyGet(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/companies/${args.id}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function companyUpdate(args) {
    return await withContext(async (context) => {
        const response = await context.axios.patch(`/companies/${args.id}`, body);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function companyDelete(args) {
    return await withContext(async (context) => {
        const response = await context.axios.delete(`/companies/${args.id}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function companyCreateField(args) {
    return await withContext(async (context) => {
        const response = await context.axios.post(`/companies/custom-fields`, body);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function companyListFields(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/companies/custom-fields`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function companyGetField(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/companies/custom-fields/${args.id}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function companyUpdateField(args) {
    return await withContext(async (context) => {
        const response = await context.axios.patch(`/companies/custom-fields/${args.id}`, body);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function companyDeleteField(args) {
    return await withContext(async (context) => {
        const response = await context.axios.delete(`/companies/custom-fields/${args.id}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function companyGetFieldvalue(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/companies/${args.companyId}/custom-fields/${args.companyCustomFieldId}/value`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function companySetFieldvalue(args) {
    return await withContext(async (context) => {
        const response = await context.axios.put(`/companies/${args.companyId}/custom-fields/${args.companyCustomFieldId}/value`, body);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function companyDeleteFieldvalue(args) {
    return await withContext(async (context) => {
        const response = await context.axios.delete(`/companies/${args.companyId}/custom-fields/${args.companyCustomFieldId}/value`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function usersGet(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/users`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function userCreate(args) {
    return await withContext(async (context) => {
        const response = await context.axios.post(`/users`, body);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function userGet(args) {
    return await withContext(async (context) => {
        const response = await context.axios.get(`/users/${args.id}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function userUpdate(args) {
    return await withContext(async (context) => {
        const response = await context.axios.patch(`/users/${args.id}`, body);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
export async function userDelete(args) {
    return await withContext(async (context) => {
        const response = await context.axios.delete(`/users/${args.id}`);
        return {
            content: [{
                    type: "text",
                    text: formatResponse(response.data, args.includeRaw)
                }]
        };
    }, args.instance, args.workspaceId);
}
