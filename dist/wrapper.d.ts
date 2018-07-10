import Router from 'koa-router';
declare const wrapper: (router: any) => void;
declare class SwaggerRouter extends Router {
    swagger(options: any): void;
    map(SwaggerClass: any, options: any): void;
    mapDir(dir: string, options?: any): void;
}
export { wrapper, SwaggerRouter };
