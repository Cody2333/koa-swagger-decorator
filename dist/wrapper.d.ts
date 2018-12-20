import * as IRouter from 'koa-router';
import Router from 'koa-router';
export interface Context extends IRouter.IRouterContext {
    validatedQuery: any;
    validatedBody: any;
    validatedParams: any;
}
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
export interface SwaggerOptions {
    title?: string;
    description?: string;
    version?: string;
    swaggerJsonEndpoint?: string;
    swaggerHtmlEndpoint?: string;
    prefix?: string;
    swaggerOptions?: any;
    swaggerConfiguration?: SwaggerConfiguration;
    [name: string]: any;
}
export interface MapOptions {
    doValidation?: boolean;
    recursive?: boolean;
    [name: string]: any;
}
declare const wrapper: (router: SwaggerRouter) => void;
declare class SwaggerRouter extends Router {
    swagger(options?: SwaggerOptions): void;
    map(SwaggerClass: any, options: MapOptions): void;
    mapDir(dir: string, options?: MapOptions): void;
}
export { wrapper, SwaggerRouter };
