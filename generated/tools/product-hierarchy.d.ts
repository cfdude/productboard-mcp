export declare function setupProductHierarchyTools(): ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            "args.args.body": {
                type: string;
                description: string;
            };
            null: {
                type: string;
                description: string;
            };
            instance: {
                type: string;
                description: string;
            };
            workspaceId: {
                type: string;
                description: string;
            };
            includeRaw: {
                type: string;
                description: string;
            };
            "status.id"?: undefined;
            "status.name"?: undefined;
            "parent.id"?: undefined;
            archived?: undefined;
            "owner.email"?: undefined;
            "note.id"?: undefined;
            id?: undefined;
            initiativeId?: undefined;
            objectiveId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            null: {
                type: string;
                description: string;
            };
            "status.id": {
                type: string;
                description: string;
            };
            "status.name": {
                type: string;
                description: string;
            };
            "parent.id": {
                type: string;
                description: string;
            };
            archived: {
                type: string;
                description: string;
            };
            "owner.email": {
                type: string;
                description: string;
            };
            "note.id": {
                type: string;
                description: string;
            };
            instance: {
                type: string;
                description: string;
            };
            workspaceId: {
                type: string;
                description: string;
            };
            includeRaw: {
                type: string;
                description: string;
            };
            "args.args.body"?: undefined;
            id?: undefined;
            initiativeId?: undefined;
            objectiveId?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            id: {
                type: string;
                description: string;
            };
            null: {
                type: string;
                description: string;
            };
            instance: {
                type: string;
                description: string;
            };
            workspaceId: {
                type: string;
                description: string;
            };
            includeRaw: {
                type: string;
                description: string;
            };
            "args.args.body"?: undefined;
            "status.id"?: undefined;
            "status.name"?: undefined;
            "parent.id"?: undefined;
            archived?: undefined;
            "owner.email"?: undefined;
            "note.id"?: undefined;
            initiativeId?: undefined;
            objectiveId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            id: {
                type: string;
                description: string;
            };
            "args.args.body": {
                type: string;
                description: string;
            };
            null: {
                type: string;
                description: string;
            };
            instance: {
                type: string;
                description: string;
            };
            workspaceId: {
                type: string;
                description: string;
            };
            includeRaw: {
                type: string;
                description: string;
            };
            "status.id"?: undefined;
            "status.name"?: undefined;
            "parent.id"?: undefined;
            archived?: undefined;
            "owner.email"?: undefined;
            "note.id"?: undefined;
            initiativeId?: undefined;
            objectiveId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            id: {
                type: string;
                description: string;
            };
            initiativeId: {
                type: string;
                description: string;
            };
            null: {
                type: string;
                description: string;
            };
            instance: {
                type: string;
                description: string;
            };
            workspaceId: {
                type: string;
                description: string;
            };
            includeRaw: {
                type: string;
                description: string;
            };
            "args.args.body"?: undefined;
            "status.id"?: undefined;
            "status.name"?: undefined;
            "parent.id"?: undefined;
            archived?: undefined;
            "owner.email"?: undefined;
            "note.id"?: undefined;
            objectiveId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            id: {
                type: string;
                description: string;
            };
            objectiveId: {
                type: string;
                description: string;
            };
            null: {
                type: string;
                description: string;
            };
            instance: {
                type: string;
                description: string;
            };
            workspaceId: {
                type: string;
                description: string;
            };
            includeRaw: {
                type: string;
                description: string;
            };
            "args.args.body"?: undefined;
            "status.id"?: undefined;
            "status.name"?: undefined;
            "parent.id"?: undefined;
            archived?: undefined;
            "owner.email"?: undefined;
            "note.id"?: undefined;
            initiativeId?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            null: {
                type: string;
                description: string;
            };
            instance: {
                type: string;
                description: string;
            };
            workspaceId: {
                type: string;
                description: string;
            };
            includeRaw: {
                type: string;
                description: string;
            };
            "args.args.body"?: undefined;
            "status.id"?: undefined;
            "status.name"?: undefined;
            "parent.id"?: undefined;
            archived?: undefined;
            "owner.email"?: undefined;
            "note.id"?: undefined;
            id?: undefined;
            initiativeId?: undefined;
            objectiveId?: undefined;
        };
        required?: undefined;
    };
})[];
export declare function handleProductHierarchyTool(name: string, args: any): Promise<any>;
export declare function featureCreate(args: any): Promise<any>;
export declare function featuresGet(args: any): Promise<any>;
export declare function featureGet(args: any): Promise<any>;
export declare function featureUpdate(args: any): Promise<any>;
export declare function featureUpdateDeprecated(args: any): Promise<any>;
export declare function featureDelete(args: any): Promise<any>;
export declare function linksListToinitiatives(args: any): Promise<any>;
export declare function initiativeCreateLink(args: any): Promise<any>;
export declare function initiativeDeleteLink(args: any): Promise<any>;
export declare function linksListToobjectives(args: any): Promise<any>;
export declare function objectiveCreateLink(args: any): Promise<any>;
export declare function objectiveDeleteLink(args: any): Promise<any>;
export declare function componentCreate(args: any): Promise<any>;
export declare function componentsGet(args: any): Promise<any>;
export declare function componentGet(args: any): Promise<any>;
export declare function componentUpdate(args: any): Promise<any>;
export declare function componentUpdateDeprecated(args: any): Promise<any>;
export declare function productsGet(args: any): Promise<any>;
export declare function productGet(args: any): Promise<any>;
export declare function productUpdate(args: any): Promise<any>;
export declare function productUpdateDeprecated(args: any): Promise<any>;
export declare function featureGetStatuses(args: any): Promise<any>;
