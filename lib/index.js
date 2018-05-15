import _ from 'ramda';
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
    swaggerParameters = [{
      name: 'data',
      description: 'request body',
      schema: {
        type: 'object',
        properties: parameters
      },
    }];
  } else {
    swaggerParameters = Object.keys(swaggerParameters).map(key => Object.assign({ name: key }, swaggerParameters[key]));
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

const responses = (responses = { 200: { description: 'success' } }) => (target, name, descriptor) => {
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
  SwaggerRouter
};

export default Doc;

export { request, summary, params, desc, description, query, path, body, tags,
  wrapper, middlewares, formData, responses, SwaggerRouter };
