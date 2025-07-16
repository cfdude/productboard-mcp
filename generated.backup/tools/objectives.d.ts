export declare function setupObjectivesTools(): ({
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
            initiativeId?: undefined;
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
            initiativeId?: undefined;
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
            initiativeId?: undefined;
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
            initiativeId?: undefined;
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
            initiativeId?: undefined;
        };
        required: string[];
    };
})[];
export declare function handleObjectivesTool(name: string, args: any): Promise<any>;
export declare function objectivesGet(args: any): Promise<any>;
export declare function objectiveCreate(args: any): Promise<any>;
export declare function objectiveGet(args: any): Promise<any>;
export declare function objectiveUpdate(args: any): Promise<any>;
export declare function objectiveDelete(args: any): Promise<any>;
export declare function linksListObjectivetofeatures(args: any): Promise<any>;
export declare function linksListObjectivetoinitiatives(args: any): Promise<any>;
export declare function objectiveCreateToinitiativelink(args: any): Promise<any>;
export declare function objectiveDeleteToinitiativelink(args: any): Promise<any>;
export declare function objectiveCreateTofeaturelink(args: any): Promise<any>;
export declare function objectiveDeleteTofeaturelink(args: any): Promise<any>;
