import * as IRouter from 'koa-router';
import Router from 'koa-router';
export declare type Context<StateT = any, CustomT = {}> = IRouter.RouterContext<StateT, CustomT> & {
    validatedQuery: any;
    validatedBody: any;
    validatedParams: any;
};
export interface SwaggerDisplayConfiguration {
    deepLinking?: boolean;
    displayOperationId?: boolean;
    defaultModelsExpandDepth?: number;
    defaultModelExpandDepth?: number;
    defaultModelRendering?: 'example' | 'model';
    displayRequestDuration?: boolean;
    docExpansion?: 'list' | 'full' | 'none';
    filter?: boolean | string;
    maxDisplayedTags?: number;
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
}
export interface SwaggerConfiguration {
    display?: SwaggerDisplayConfiguration;
}
export interface SecurityDefinitions {
    [key: string]: {
        /** The type of the security scheme. Valid values are 'basic', 'apiKey' or 'oauth2' */
        type: 'basic' | 'apiKey' | 'oauth2';
        /** The name of the header or query parameter to be used */
        name?: string;
        /** The location of the API key. Valid values are "query" or "header" */
        in?: 'header' | 'query';
        /** Optional short description for security scheme */
        description?: string;
        /** The flow used by the OAuth2 security scheme */
        flow: 'implicit' | 'password' | 'application' | 'accessCode';
        /** The authorization URL to be used for this flow. This SHOULD be in the form of a URL */
        authorizationUrl: string;
        /** The token URL to be used for this flow. This SHOULD be in the form of a URL */
        tokenUrl: string;
        /** The available scopes for the OAuth2 security scheme */
        scopes: {
            [key: string]: string;
        };
    };
}
export interface SwaggerOptions {
    title?: string;
    description?: string;
    version?: string;
    swaggerJsonEndpoint?: string;
    swaggerHtmlEndpoint?: string;
    prefix?: string;
    swaggerOptions?: any;
    swaggerConfiguration?: SwaggerConfiguration;
    securityDefinitions?: SecurityDefinitions;
    [name: string]: any;
}
export interface MapOptions {
    doValidation?: boolean;
    recursive?: boolean;
    [name: string]: any;
    ignore?: string[];
}
declare const wrapper: (router: SwaggerRouter<any, {}>) => void;
declare class SwaggerRouter<StateT = any, CustomT = {}> extends Router<StateT, CustomT> {
    swaggerKeys: Set<String>;
    opts: IRouter.IRouterOptions;
    swaggerOpts: SwaggerOptions;
    constructor(opts?: IRouter.IRouterOptions, swaggerOpts?: SwaggerOptions);
    _addKey(str: String): void;
    swagger(options?: SwaggerOptions): void;
    map(SwaggerClass: any, options: MapOptions): void;
    mapDir(dir: string, options?: MapOptions): void;
}
export { wrapper, SwaggerRouter };
