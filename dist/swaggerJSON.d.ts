/**
 * build swagger json from apiObjects
 */
declare const swaggerJSON: (options: {
    [name: string]: any;
}, apiObjects: any) => {
    info: {
        title: string;
        description: string;
        version: string;
    };
    paths: {};
    responses: {};
} & {
    definitions: {};
    tags: any[];
    swagger: string;
    securityDefinitions: {
        ApiKeyAuth: {
            type: string;
            in: string;
            name: string;
        };
    };
};
export default swaggerJSON;
export { swaggerJSON };
