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
        security: [{ ApiKeyAuth: [] }]
    });
    return descriptor;
};
exports.request = request;
const middlewares = (middlewares) => (target, name, descriptor) => {
    descriptor.value.middlewares = middlewares;
    return descriptor;
};
exports.middlewares = middlewares;
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
    formData,
    responses,
    deprecated,
    tagsAll,
    responsesAll,
    middlewaresAll,
    deprecatedAll,
    queryAll,
    prefix
};
exports.default = Doc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9kZWNvcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQXNCO0FBQ3RCLDREQUE0QjtBQUM1QixvRUFBNEM7QUFFNUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFZLEVBQUUsSUFBb0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFXLEVBQUUsSUFBWSxFQUFFLFVBQThCLEVBQUUsRUFBRTtJQUNsSCxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztJQUM5Qix1QkFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQUVGLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBWSxFQUFFLFVBQW1DLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBVyxFQUFFLElBQVksRUFBRSxVQUE4QixFQUFFLEVBQUU7SUFDbkksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVTtRQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUNuRSxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUM7SUFFL0MsOEJBQThCO0lBQzlCLElBQUksaUJBQWlCLEdBQUcsVUFBVSxDQUFDO0lBQ25DLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUNuQixpQkFBaUIsR0FBRztZQUNsQjtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixXQUFXLEVBQUUsY0FBYztnQkFDM0IsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxRQUFRO29CQUNkLFVBQVUsRUFBRSxVQUFVO2lCQUN2QjthQUNGO1NBQ0YsQ0FBQztL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