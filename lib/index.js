import _ from 'ramda';
import is from 'is-type-of';
import swaggerObject from './swaggerObject';
import { wrapper, SwaggerRouter } from './wrapper';

const _desc = (type, text) => (target, name, descriptor) => {
  descriptor.value[type] = text;
  swaggerObject.add(target, name, { [type]: text });
  return descriptor;
};

const _params = (type, parameters) => (target, name, descriptor) => {
  if (!descriptor.value.parameters) descriptor.value.parameters = {};
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
  } else {
    swaggerParameters = Object.keys(swaggerParameters).map(key =>
      Object.assign({ name: key }, swaggerParameters[key]));
  }
  swaggerParameters.forEach((item) => {
    item.in = type;
  });

  swaggerObject.add(target, name, { [type]: swaggerParameters });
  return descriptor;
};

const request = (method, path) => (target, name, descriptor) => {
  method = _.toLower(method);
  descriptor.value.method = method;
  descriptor.value.path = path;
  swaggerObject.add(target, name, {
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
  swaggerObject.add(target, name, { deprecated: true });
  return descriptor;
};

const responses = (responses = { 200: { description: 'success' } }) => (
  target,
  name,
  descriptor
) => {
  descriptor.value.responses = responses;
  swaggerObject.add(target, name, { responses });
  return descriptor;
};
const desc = _.curry(_desc);

// description and summary
const description = desc('description');

const summary = desc('summary');

const tags = desc('tags');

const params = _.curry(_params);

// below are [parameters]

// query params
const query = params('query');

// path params
const path = params('path');

// body params
const body = params('body');

// formData params
const formData = params('formData');

// class decorators
const tagsAll = tags => (target) => {
  tags = is.array(tags) ? tags : [tags];
  swaggerObject.addMulti(target, { tags });
};

const responsesAll = (responses = { 200: { description: 'success' } }) => (target) => {
  swaggerObject.addMulti(target, { responses });
};

const middlewaresAll = items => (target) => {
  items = is.array(items) ? items : [items];
  target.middlewares = items;
};

const deprecatedAll = (target) => {
  swaggerObject.addMulti(target, { deprecated: true });
};

const queryAll = (parameters, filters = ['ALL']) => (target) => {
  if (!target.parameters) target.parameters = {};
  target.parameters.query = parameters; // used in wrapper.js for validation
  target.parameters.filters = filters; // used in wrapper.js for validation
  const swaggerParameters = Object.keys(parameters).map(key =>
    Object.assign({ name: key }, parameters[key]));
  swaggerParameters.forEach((item) => {
    item.in = 'query';
  });
  swaggerObject.addMulti(target, { query: swaggerParameters }, filters);
};
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
  wrapper,
  middlewares,
  formData,
  responses,
  deprecated,
  SwaggerRouter,
  tagsAll,
  responsesAll,
  middlewaresAll,
  deprecatedAll,
  queryAll
};

export default Doc;

export {
  request,
  summary,
  params,
  desc,
  description,
  query,
  path,
  body,
  tags,
  wrapper,
  middlewares,
  formData,
  responses,
  deprecated,
  SwaggerRouter,
  tagsAll,
  responsesAll,
  middlewaresAll,
  deprecatedAll,
  queryAll
};
