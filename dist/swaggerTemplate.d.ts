/**
 * init swagger definitions
 * @param {String} title
 * @param {String} description
 * @param {String} version
 * @param {Object} options other options for swagger definition
 */
declare const _default: (title?: string, description?: string, version?: string, options?: {}) => {
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
export default _default;
