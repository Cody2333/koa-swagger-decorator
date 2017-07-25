'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiObjects = exports.wrapper = exports.tags = exports.body = exports.path = exports.query = exports.description = exports.desc = exports.params = exports.summary = exports.request = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _wrapper = require('./wrapper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const apiObjects = {};

const _addToApiObject = (target, name, apiObjects, content) => {
  const key = `${target.name}-${name}`;
  if (!apiObjects[key]) apiObjects[key] = {};
  Object.assign(apiObjects[key], content);
};

const _desc = (type, text) => (target, name, descriptor) => {
  // 设置简介
  descriptor.value[type] = text;
  _addToApiObject(target, name, apiObjects, { [type]: text });
  return descriptor;
};

const _params = (type, parameters) => (target, name, descriptor) => {
  // 对 body 要再裹一层
  let swaggerParameters = parameters;
  if (type === 'body') {
    swaggerParameters = [{
      name: 'data',
      description: '请求体',
      schema: {
        type: 'object',
        properties: parameters
      }
    }];
  }

  swaggerParameters.forEach(item => {
    item.in = type;
  });
  if (!descriptor.value.parameters) descriptor.value.parameters = {};
  descriptor.value.parameters[type] = parameters;

  _addToApiObject(target, name, apiObjects, { [type]: swaggerParameters });
  return descriptor;
};

const request = (method, path) => (target, name, descriptor) => {
  // 设置请求方法,路径
  descriptor.value.method = method;
  descriptor.value.path = path;
  _addToApiObject(target, name, apiObjects, { request: { method, path } });
  return descriptor;
};

const desc = _lodash2.default.curry(_desc);
// description 和 summary 参数

const description = desc('description');

const summary = desc('summary');

const tags = desc('tags');

const params = _lodash2.default.curry(_params);
// 下面是parameters参数

// query 参数
const query = params('query');

// path 参数
const path = params('path');

// body 参数
const body = params('body');

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
exports.apiObjects = apiObjects;