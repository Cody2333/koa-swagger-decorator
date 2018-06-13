'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwaggerRouter = exports.deprecated = exports.responses = exports.formData = exports.middlewares = exports.wrapper = exports.tags = exports.body = exports.path = exports.query = exports.description = exports.desc = exports.params = exports.summary = exports.request = undefined;

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _swaggerObject = require('./swaggerObject');

var _swaggerObject2 = _interopRequireDefault(_swaggerObject);

var _wrapper = require('./wrapper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _desc = (type, text) => (target, name, descriptor) => {
  descriptor.value[type] = text;
  _swaggerObject2.default.add(target, name, { [type]: text });
  return descriptor;
};

const _params = (type, parameters) => (target, name, descriptor) => {
  if (!descriptor.value.parameters) descriptor.value.parameters = {};
  descriptor.value.parameters[type] = parameters;

  // additional wrapper for body
  let swaggerParameters = parameters;
  if (type === 'body') {
    swaggerParameters = [{
      name: 'data',
      description: 'request body',
      schema: {
        type: 'object',
        properties: parameters
      }
    }];
  } else {
    swaggerParameters = Object.keys(swaggerParameters).map(key => Object.assign({ name: key }, swaggerParameters[key]));
  }
  swaggerParameters.forEach(item => {
    item.in = type;
  });

  _swaggerObject2.default.add(target, name, { [type]: swaggerParameters });
  return descriptor;
};

const request = (method, path) => (target, name, descriptor) => {
  method = _ramda2.default.toLower(method);
  descriptor.value.method = method;
  descriptor.value.path = path;
  _swaggerObject2.default.add(target, name, {
    request: { method, path },
    security: [{ ApiKeyAuth: [] }]
  });
  return descriptor;
};

const middlewares = middlewares => (target, name, descriptor) => {
  descriptor.value.middlewares = middlewares;
  return descriptor;
};

const deprecated = (target, name, descriptor) => {
  descriptor.value.deprecated = true;
  _swaggerObject2.default.add(target, name, { deprecated: true });
  return descriptor;
};

const responses = (responses = { 200: { description: 'success' } }) => (target, name, descriptor) => {
  descriptor.value.responses = responses;
  _swaggerObject2.default.add(target, name, { responses });
  return descriptor;
};
const desc = _ramda2.default.curry(_desc);

// description and summary
const description = desc('description');

const summary = desc('summary');

const tags = desc('tags');

const params = _ramda2.default.curry(_params);

// below are [parameters]

// query params
const query = params('query');

// path params
const path = params('path');

// body params
const body = params('body');

// formData params
const formData = params('formData');

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
  wrapper: _wrapper.wrapper,
  middlewares,
  formData,
  responses,
  deprecated,
  SwaggerRouter: _wrapper.SwaggerRouter
};

exports.default = Doc;
exports.request = request;
exports.summary = summary;
exports.params = params;
exports.desc = desc;
exports.description = description;
exports.query = query;
exports.path = path;
exports.body = body;
exports.tags = tags;
exports.wrapper = _wrapper.wrapper;
exports.middlewares = middlewares;
exports.formData = formData;
exports.responses = responses;
exports.deprecated = deprecated;
exports.SwaggerRouter = _wrapper.SwaggerRouter;