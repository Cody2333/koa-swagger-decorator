import Router from 'koa-router';
import * as Koa from 'koa';
export interface Context extends Koa.Context {
    validatedQuery: any;
    validatedBody: any;
    validatedParams: any;
}
declare const wrapper: (router: any) => void;
declare class SwaggerRouter extends Router {
    swagger(options: any): void;
    map(SwaggerClass: any, options: any): void;
    mapDir(dir: string, options?: any): void;
}
export { wrapper, SwaggerRouter };
