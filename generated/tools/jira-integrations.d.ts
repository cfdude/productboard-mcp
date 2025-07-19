export declare function setupJiraIntegrationsTools(): ({
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
            featureId?: undefined;
            "connection.issueKey"?: undefined;
            "connection.issueId"?: undefined;
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
            id?: undefined;
            featureId?: undefined;
            "connection.issueKey"?: undefined;
            "connection.issueId"?: undefined;
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
            "connection.issueKey"?: undefined;
            "connection.issueId"?: undefined;
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
            "connection.issueKey": {
                type: string;
                description: string;
            };
            "connection.issueId": {
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
            featureId?: undefined;
        };
        required: string[];
    };
})[];
export declare function handleJiraIntegrationsTool(name: string, args: any): Promise<any>;
export declare function jiraGetIntegration(args: any): Promise<any>;
export declare function jiraGetIntegrations(args: any): Promise<any>;
export declare function jiraGetIntegrationconnection(args: any): Promise<any>;
export declare function jiraGetIntegrationconnections(args: any): Promise<any>;
