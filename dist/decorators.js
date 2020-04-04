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
const query = params("query");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9kZWNvcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQXNCO0FBQ3RCLDREQUE0QjtBQUM1QixvRUFBNEM7QUFFNUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFZLEVBQUUsSUFBb0IsRUFBRSxFQUFFLENBQUMsQ0FDcEQsTUFBVyxFQUNYLElBQVksRUFDWixVQUE4QixFQUM5QixFQUFFO0lBQ0YsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDOUIsdUJBQWEsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNsRCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDLENBQUM7QUFFRixNQUFNLE9BQU8sR0FBRyxDQUFDLElBQVksRUFBRSxVQUFtQyxFQUFFLEVBQUUsQ0FBQyxDQUNyRSxNQUFXLEVBQ1gsSUFBWSxFQUNaLFVBQThCLEVBQzlCLEVBQUU7SUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVO1FBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ25FLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUUvQyw4QkFBOEI7SUFDOUIsSUFBSSxpQkFBaUIsR0FBRyxVQUFVLENBQUM7SUFDbkMsSUFBSSxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQ25CLGlCQUFpQixHQUFHO1lBQ2xCO2dCQUNFLElBQUksRUFBRSxNQUFNO2dCQUNaLFdBQVcsRUFBRSxjQUFjO2dCQUMzQixNQUFNLEVBQUU7b0JBQ04sSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFLFVBQVU7aUJBQ3ZCO2FBQ0Y7U0FDRixDQUFD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