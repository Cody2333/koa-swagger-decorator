"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = __importDefault(require("ramda"));
const is_type_of_1 = __importDefault(require("is-type-of"));
const swaggerObject_1 = __importDefault(require("./swaggerObject"));
const _desc = (type, text) => (target, name, descriptor) => {
    descriptor.value[type] = text;
    swaggerObject_1.default.add(target, name, { [type]: text });
    return descriptor;
};
const _params = (type, parameters) => (target, name, descriptor) => {
    if (!descriptor.value.parameters)
        descriptor.value.parameters = {};
    descriptor.value.parameters[type] = parameters;
    // additional wrapper for body
    let swaggerParameters = parameters;
    if (type === 'body') {
        swaggerParameters = [
            {
                name: 'data',
                description: 'request body',
                schema: {
                    type: 'object',
                    properties: parameters
                }
            }
        ];
    }
    else {
        swaggerParameters = Object.keys(swaggerParameters).map(key => Object.assign({ name: key }, swaggerParameters[key]));
    }
    swaggerParameters.forEach((item) => {
        item.in = type;
    });
    swaggerObject_1.default.add(target, name, { [type]: swaggerParameters });
    return descriptor;
};
const request = (method, path) => (target, name, descriptor) => {
    method = ramda_1.default.toLower(method);
    descriptor.value.method = method;
    descriptor.value.path = path;
    swaggerObject_1.default.add(target, name, {
        request: { method, path },
    });
    return descriptor;
};
exports.request = request;
const middlewares = (middlewares) => (target, name, descriptor) => {
    descriptor.value.middlewares = middlewares;
    return descriptor;
};
exports.middlewares = middlewares;
const security = (security) => (target, name, descriptor) => {
    swaggerObject_1.default.add(target, name, {
        security
    });
};
exports.security = security;
const deprecated = (target, name, descriptor) => {
    descriptor.value.deprecated = true;
    swaggerObject_1.default.add(target, name, { deprecated: true });
    return descriptor;
};
exports.deprecated = deprecated;
const defaultResp = {
    200: { description: 'success' }
};
const responses = (responses = defaultResp) => (target, name, descriptor) => {
    descriptor.value.responses = responses;
    swaggerObject_1.default.add(target, name, { responses });
    return descriptor;
};
exports.responses = responses;
const desc = ramda_1.default.curry(_desc);
exports.desc = desc;
// description and summary
const description = desc('description');
exports.description = description;
const summary = desc('summary');
exports.summary = summary;
const tags = desc('tags');
exports.tags = tags;
const params = ramda_1.default.curry(_params);
exports.params = params;
// below are [parameters]
// query params
const query = params('query');
exports.query = query;
// path params
const path = params('path');
exports.path = path;
// body params
const body = params('body');
exports.body = body;
// formData params
const formData = params('formData');
exports.formData = formData;
// class decorators
const tagsAll = (items) => (target) => {
    const tags = is_type_of_1.default.array(items) ? items : [items];
    swaggerObject_1.default.addMulti(target, { tags });
};
exports.tagsAll = tagsAll;
const responsesAll = (responses = defaultResp) => (target) => {
    swaggerObject_1.default.addMulti(target, { responses });
};
exports.responsesAll = responsesAll;
const middlewaresAll = (items) => (target) => {
    const middlewares = is_type_of_1.default.array(items) ? items : [items];
    target.middlewares = middlewares;
};
exports.middlewaresAll = middlewaresAll;
const securityAll = (security) => (target) => {
    const authentitactions = is_type_of_1.default.array(security) ? security : [security];
    swaggerObject_1.default.addMulti(target, {
        security: authentitactions
    });
};
exports.securityAll = securityAll;
const deprecatedAll = (target) => {
    swaggerObject_1.default.addMulti(target, { deprecated: true });
};
exports.deprecatedAll = deprecatedAll;
const prefix = (prefix) => (target) => {
    swaggerObject_1.default.addMulti(target, { prefix });
    target.prefix = prefix;
};
exports.prefix = prefix;
const queryAll = (parameters, filters = ['ALL']) => (target) => {
    if (!target.parameters)
        target.parameters = {};
    target.parameters.query = parameters; // used in wrapper.js for validation
    target.parameters.filters = filters; // used in wrapper.js for validation
    const swaggerParameters = Object.keys(parameters).map(key => Object.assign({ name: key }, parameters[key]));
    swaggerParameters.forEach((item) => {
        item.in = 'query';
    });
    swaggerObject_1.default.addMulti(target, { query: swaggerParameters }, filters);
};
exports.queryAll = queryAll;
const Doc = {
    request,
    summary,
    params,
    desc,
    description,
    query,
    path,
    body,
    tags,
    middlewares,
    security,
    formData,
    responses,
    deprecated,
    tagsAll,
    responsesAll,
    middlewaresAll,
    deprecatedAll,
    securityAll,
    queryAll,
    prefix
};
exports.default = Doc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9kZWNvcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQXNCO0FBQ3RCLDREQUE0QjtBQUM1QixvRUFBNEM7QUFFNUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFZLEVBQUUsSUFBb0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFXLEVBQUUsSUFBWSxFQUFFLFVBQThCLEVBQUUsRUFBRTtJQUNsSCxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztJQUM5Qix1QkFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQUVGLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBWSxFQUFFLFVBQW1DLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBVyxFQUFFLElBQVksRUFBRSxVQUE4QixFQUFFLEVBQUU7SUFDbkksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVTtRQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUNuRSxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUM7SUFFL0MsOEJBQThCO0lBQzlCLElBQUksaUJBQWlCLEdBQUcsVUFBVSxDQUFDO0lBQ25DLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUNuQixpQkFBaUIsR0FBRztZQUNsQjtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixXQUFXLEVBQUUsY0FBYztnQkFDM0IsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxRQUFRO29CQUNkLFVBQVUsRUFBRSxVQUFVO2lCQUN2QjthQUNGO1NBQ0YsQ0FBQztL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