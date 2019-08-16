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
                schema: parameters
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9kZWNvcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQXNCO0FBQ3RCLDREQUE0QjtBQUM1QixvRUFBNEM7QUFFNUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFZLEVBQUUsSUFBb0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFXLEVBQUUsSUFBWSxFQUFFLFVBQThCLEVBQUUsRUFBRTtJQUNsSCxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztJQUM5Qix1QkFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMsQ0FBQztBQUVGLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBWSxFQUFFLFVBQW1DLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBVyxFQUFFLElBQVksRUFBRSxVQUE4QixFQUFFLEVBQUU7SUFDbkksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVTtRQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUNuRSxVQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUM7SUFFL0MsOEJBQThCO0lBQzlCLElBQUksaUJBQWlCLEdBQUcsVUFBVSxDQUFDO0lBQ25DLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtRQUNuQixpQkFBaUIsR0FBRztZQUNsQjtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixXQUFXLEVBQUUsY0FBYztnQkFDM0IsTUFBTSxFQUFFLFVBQVU7YUFDbkI7U0FDRixDQUFDO0tBQ0g7U0FBTTtRQUNMLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENB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