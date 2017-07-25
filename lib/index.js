import _ from 'lodash';
import { wrapper } from './wrapper';

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
  parameters.forEach(item => {
    item.in = type;
  });
  if (!descriptor.value.parameters) descriptor.value.parameters = {};
  descriptor.value.parameters[type] = parameters;
  _addToApiObject(target, name, apiObjects, { [type]: parameters });
  return descriptor;
};

const request = (method, path) => (target, name, descriptor) => {
  // 设置请求方法,路径
  descriptor.value.method = method;
  descriptor.value.path = path;
  _addToApiObject(target, name, apiObjects, { request: { method, path } });
  return descriptor;
};

const desc = _.curry(_desc);
// description 和 summary 参数

const description = desc('description');

const summary = desc('summary');

const tags = desc('tags');

const params = _.curry(_params);
// 下面是parameters参数

// query 参数
const query = params('query');

// path 参数
const path = params('path');

// body 参数
const body = params('body');


export { request, summary, params, desc, description, query, path, body, tags,
  wrapper, apiObjects };
