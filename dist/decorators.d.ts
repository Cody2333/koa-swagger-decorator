import _ from "ramda";
declare const request: (method: string, path: string) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
declare const middlewares: (middlewares: Function[]) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
declare const security: (security: any[]) => (target: any, name: string, descriptor: PropertyDescriptor) => void;
declare const deprecated: (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export interface IResponses {
    [name: number]: any;
}
declare const responses: (responses?: IResponses) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
declare const desc: _.CurriedFunction2<string, string | any[], (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor>;
declare const description: (t2: string | any[]) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
declare const summary: (t2: string | any[]) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
declare const tags: (t2: string | any[]) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
declare const params: _.CurriedFunction2<string, {
    [name: string]: any;
}, (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor>;
declare const query: (t2: {
    [name: string]: any;
}) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
declare const header: (t2: {
    [name: string]: any;
}) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
declare const path: (t2: {
    [name: string]: any;
}) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
declare const body: (t2: {
    [name: string]: any;
}) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
declare const formData: (t2: {
    [name: string]: any;
}) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
declare const orderAll: (weight: number) => (target: any) => void;
declare const tagsAll: (items: string | string[]) => (target: any) => void;
declare const responsesAll: (responses?: IResponses) => (target: any) => void;
declare const middlewaresAll: (items: Function | Function[]) => (target: any) => void;
declare const securityAll: (security: any) => (target: any) => void;
declare const deprecatedAll: (target: any) => void;
declare const prefix: (prefix: string) => (target: any) => void;
declare const queryAll: (parameters: {
    [name: string]: any;
}, filters?: string[]) => (target: any) => void;
declare const Doc: {
    request: (method: string, path: string) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    summary: (t2: string | any[]) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    params: _.CurriedFunction2<string, {
        [name: string]: any;
    }, (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor>;
    desc: _.CurriedFunction2<string, string | any[], (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor>;
    description: (t2: string | any[]) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    query: (t2: {
        [name: string]: any;
    }) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    header: (t2: {
        [name: string]: any;
    }) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    path: (t2: {
        [name: string]: any;
    }) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    body: (t2: {
        [name: string]: any;
    }) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    tags: (t2: string | any[]) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    middlewares: (middlewares: Function[]) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    security: (security: any[]) => (target: any, name: string, descriptor: PropertyDescriptor) => void;
    formData: (t2: {
        [name: string]: any;
    }) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    responses: (responses?: IResponses) => (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    deprecated: (target: any, name: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
    orderAll: (weight: number) => (target: any) => void;
    tagsAll: (items: string | string[]) => (target: any) => void;
    responsesAll: (responses?: IResponses) => (target: any) => void;
    middlewaresAll: (items: Function | Function[]) => (target: any) => void;
    deprecatedAll: (target: any) => void;
    securityAll: (security: any) => (target: any) => void;
    queryAll: (parameters: {
        [name: string]: any;
    }, filters?: string[]) => (target: any) => void;
    prefix: (prefix: string) => (target: any) => void;
};
export default Doc;
export { request, summary, params, desc, description, query, header, path, body, tags, middlewares, security, formData, responses, deprecated, orderAll, tagsAll, responsesAll, middlewaresAll, securityAll, deprecatedAll, queryAll, prefix };
