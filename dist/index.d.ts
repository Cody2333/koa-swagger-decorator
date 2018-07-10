import _ from 'ramda';
import { wrapper, SwaggerRouter, Context } from './wrapper';
declare const request: (method: any, path: any) => (target: any, name: any, descriptor: any) => any;
declare const middlewares: (middlewares: any) => (target: any, name: any, descriptor: any) => any;
declare const deprecated: (target: any, name: any, descriptor: any) => any;
declare const responses: (responses?: {
    200: {
        description: string;
    };
}) => (target: any, name: any, descriptor: any) => any;
declare const desc: _.CurriedFunction2<any, any, (target: any, name: any, descriptor: any) => any>;
declare const description: (t2: any) => (target: any, name: any, descriptor: any) => any;
declare const summary: (t2: any) => (target: any, name: any, descriptor: any) => any;
declare const tags: (t2: any) => (target: any, name: any, descriptor: any) => any;
declare const params: _.CurriedFunction2<any, any, (target: any, name: any, descriptor: any) => any>;
declare const query: (t2: any) => (target: any, name: any, descriptor: any) => any;
declare const path: (t2: any) => (target: any, name: any, descriptor: any) => any;
declare const body: (t2: any) => (target: any, name: any, descriptor: any) => any;
declare const formData: (t2: any) => (target: any, name: any, descriptor: any) => any;
declare const tagsAll: (tags: any) => (target: any) => void;
declare const responsesAll: (responses?: {
    200: {
        description: string;
    };
}) => (target: any) => void;
declare const middlewaresAll: (items: any) => (target: any) => void;
declare const deprecatedAll: (target: any) => void;
declare const prefix: (prefix: any) => (target: any) => void;
declare const queryAll: (parameters: any, filters?: string[]) => (target: any) => void;
declare const Doc: {
    request: (method: any, path: any) => (target: any, name: any, descriptor: any) => any;
    summary: (t2: any) => (target: any, name: any, descriptor: any) => any;
    params: _.CurriedFunction2<any, any, (target: any, name: any, descriptor: any) => any>;
    desc: _.CurriedFunction2<any, any, (target: any, name: any, descriptor: any) => any>;
    description: (t2: any) => (target: any, name: any, descriptor: any) => any;
    query: (t2: any) => (target: any, name: any, descriptor: any) => any;
    path: (t2: any) => (target: any, name: any, descriptor: any) => any;
    body: (t2: any) => (target: any, name: any, descriptor: any) => any;
    tags: (t2: any) => (target: any, name: any, descriptor: any) => any;
    wrapper: (router: any) => void;
    middlewares: (middlewares: any) => (target: any, name: any, descriptor: any) => any;
    formData: (t2: any) => (target: any, name: any, descriptor: any) => any;
    responses: (responses?: {
        200: {
            description: string;
        };
    }) => (target: any, name: any, descriptor: any) => any;
    deprecated: (target: any, name: any, descriptor: any) => any;
    SwaggerRouter: typeof SwaggerRouter;
    tagsAll: (tags: any) => (target: any) => void;
    responsesAll: (responses?: {
        200: {
            description: string;
        };
    }) => (target: any) => void;
    middlewaresAll: (items: any) => (target: any) => void;
    deprecatedAll: (target: any) => void;
    queryAll: (parameters: any, filters?: string[]) => (target: any) => void;
    prefix: (prefix: any) => (target: any) => void;
};
export default Doc;
export { request, summary, params, desc, description, query, path, body, tags, wrapper, middlewares, formData, responses, deprecated, SwaggerRouter, tagsAll, responsesAll, middlewaresAll, deprecatedAll, queryAll, prefix, Context, };
