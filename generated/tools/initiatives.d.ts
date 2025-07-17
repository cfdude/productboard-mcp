export declare function setupInitiativesTools(): ({
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
            body?: undefined;
            id?: undefined;
            objectiveId?: undefined;
            featureId?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            body: {
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
            id?: undefined;
            objectiveId?: undefined;
            featureId?: undefined;
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
            body?: undefined;
            objectiveId?: undefined;
            featureId?: undefined;
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
            body: {
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
            objectiveId?: undefined;
            featureId?: undefined;
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
            body?: undefined;
            featureId?: undefined;
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
            featureId: {
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
            body?: undefined;
            objectiveId?: undefined;
        };
        required: string[];
    };
})[];
export declare function handleInitiativesTool(name: string, args: any): Promise<any>;
export declare function initiativesGet(args: any): Promise<any>;
export declare function initiativeCreate(args: any): Promise<any>;
export declare function initiativeGet(args: any): Promise<any>;
export declare function initiativeUpdate(args: any): Promise<any>;
export declare function initiativeDelete(args: any): Promise<any>;
export declare function linksListInitiativetoobjectives(args: any): Promise<any>;
export declare function linksListInitiativetofeatures(args: any): Promise<any>;
export declare function initiativeCreateToobjectivelink(args: any): Promise<any>;
export declare function initiativeDeleteToobjectivelink(args: any): Promise<any>;
export declare function initiativeCreateTofeaturelink(args: any): Promise<any>;
export declare function initiativeDeleteTofeaturelink(args: any): Promise<any>;
