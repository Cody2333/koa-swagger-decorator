'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.responses = exports.formData = exports.middlewares = exports.apiObjects = exports.wrapper = exports.tags = exports.body = exports.path = exports.query = exports.description = exports.desc = exports.params = exports.summary = exports.request = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _wrapper = require('./wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * used for building swagger docs object
 */
const apiObjects = {};

const _addToApiObject = (target, name, apiObjects, content) => {
  const key = `${target.name}-${name}`;
  if (!apiObjects[key]) apiObjects[key] = {};
  Object.assign(apiObjects[key], content);
};

const _desc = (type, text) => (target, name, descriptor) => {
  descriptor.value[type] = text;
  _addToApiObject(target, name, apiObjects, { [type]: text });
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

  _addToApiObject(target, name, apiObjects, { [type]: swaggerParameters });
  return descriptor;
};

const request = (method, path) => (target, name, descriptor) => {
  method = _lodash2.default.toLower(method);
  descriptor.value.method = method;
  descriptor.value.path = path;
  _addToApiObject(target, name, apiObjects, {
    request: { method, path },
    security: [{ ApiKeyAuth: [] }]
  });
  return descriptor;
};

const middlewares = middlewares => (target, name, descriptor) => {
  descriptor.value.middlewares = middlewares;
  return descriptor;
};

const responses = (responses = { 200: { description: 'success' } }) => (target, name, descriptor) => {
  descriptor.value.responses = responses;
  _addToApiObject(target, name, apiObjects, { responses });
  return descriptor;
};
const desc = _lodash2.default.curry(_desc);

// description and summary
const description = desc('description');

const summary = desc('summary');

const tags = desc('tags');

const params = _lodash2.default.curry(_params);

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
  wrapper: _wrapper2.default,
  apiObjects,
  middlewares,
  formData,
  responses
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
exports.wrapper = _wrapper2.default;
exports.apiObjects = apiObjects;
exports.middlewares = middlewares;
exports.formData = formData;
exports.responses = responses;