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
    if (type === "body") {
        swaggerParameters = [
            {
                name: "data",
                description: "request body",
                schema: {
                    type: "object",
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
        request: { method, path }
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
    200: { description: "success" }
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
const description = desc("description");
exports.description = description;
const summary = desc("summary");
exports.summary = summary;
const tags = desc("tags");
exports.tags = tags;
const params = ramda_1.default.curry(_params);
exports.params = params;
// below are [parameters]
// query params
const query = (queryParams) => params("query")(queryParams);
exports.query = query;
// header params
const header = params('header');
exports.header = header;
// path params
const path = params("path");
exports.path = path;
// body params
const body = params("body");
exports.body = body;
// formData params
const formData = params("formData");
exports.formData = formData;
// class decorators
const orderAll = (weight) => (target) => {
    swaggerObject_1.default.addMulti(target, { order: weight });
};
exports.orderAll = orderAll;
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
const queryAll = (parameters, filters = ["ALL"]) => (target) => {
    if (!target.parameters)
        target.parameters = {};
    target.parameters.query = parameters; // used in wrapper.js for validation
    target.parameters.filters = filters; // used in wrapper.js for validation
    const swaggerParameters = Object.keys(parameters).map(key => Object.assign({ name: key }, parameters[key]));
    swaggerParameters.forEach(item => {
        item.in = "query";
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
    header,
    path,
    body,
    tags,
    middlewares,
    security,
    formData,
    responses,
    deprecated,
    orderAll,
    tagsAll,
    responsesAll,
    middlewaresAll,
    deprecatedAll,
    securityAll,
    queryAll,
    prefix
};
exports.default = Doc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9kZWNvcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQXNCO0FBQ3RCLDREQUE0QjtBQUM1QixvRUFBNEM7QUFHNUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFZLEVBQUUsSUFBb0IsRUFBRSxFQUFFLENBQUMsQ0FDcEQsTUFBVyxFQUNYLElBQVksRUFDWixVQUE4QixFQUM5QixFQUFFO0lBQ0YsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDOUIsdUJBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNsRCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDLENBQUM7QUFFRixNQUFNLE9BQU8sR0FBRyxDQUFDLElBQVksRUFBRSxVQUFtQyxFQUFFLEVBQUUsQ0FBQyxDQUNyRSxNQUFXLEVBQ1gsSUFBWSxFQUNaLFVBQThCLEVBQzlCLEVBQUU7SUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVO1FBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ25FLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUUvQyw4QkFBOEI7SUFDOUIsSUFBSSxpQkFBaUIsR0FBRyxVQUFVLENBQUM7SUFDbkMsSUFBSSxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQ25CLGlCQUFpQixHQUFHO1lBQ2xCO2dCQUNFLElBQUksRUFBRSxNQUFNO2dCQUNaLFdBQVcsRUFBRSxjQUFjO2dCQUMzQixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFLFVBQVU7aUJBQ3ZCO2FBQ0Y7U0FDRixDQUFD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