
import is from 'is-type-of';
import { curry, toLower } from 'ramda';
import swaggerObject from './swaggerObject';

const _desc = (type: string, text: string | any[]) => (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  descriptor.value[type] = text;
  swaggerObject.add(target, name, { [type]: text });
  return descriptor;
};

const _stripInvalidStructureFieldsFromBodyParams = (parameters: { [name: string]: any }) => {
  const keys = Object.keys(parameters);
  for (const key of keys) {
    delete parameters[key].required;
  }
  return parameters;
};

const _params = (type: string, parameters: { [name: string]: any }) => (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
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
          required: Object.keys(parameters).filter(parameterName => parameters[parameterName].required),
          properties: _stripInvalidStructureFieldsFromBodyParams(parameters)
        }
      }
    ];
    if (swaggerParameters[0].schema.required.length === 0) {
      delete swaggerParameters[0].schema.required;
    }
  } else {
    swaggerParameters = Object.keys(swaggerParameters).map(key =>
      Object.assign({ name: key }, swaggerParameters[key]));
  }
  swaggerParameters.forEach((item: any) => {
    item.in = type;
  });

  swaggerObject.add(target, name, { [type]: swaggerParameters });
  return descriptor;
};

const request = (method: string, path: string) => (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  method = toLower(method);
  descriptor.value.method = method;
  descriptor.value.path = path;
  swaggerObject.add(target, name, {
    request: { method, path },
    security: [{ ApiKeyAuth: [] }]
  });
  return descriptor;
};

const middlewares = (middlewares: Function[]) => (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  descriptor.value.middlewares = middlewares;
  return descriptor;
};

const security = (security: any[]) => (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  swaggerObject.add(target, name, {
    security
  });
};

const deprecated = (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  descriptor.value.deprecated = true;
  swaggerObject.add(target, name, { deprecated: true });
  return descriptor;
};

export interface IResponses {
  [name: number]: any;
}
const defaultResp: IResponses = {
  200: { description: 'success' }
};
const responses = (responses: IResponses = defaultResp) => (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  descriptor.value.responses = responses;
  swaggerObject.add(target, name, { responses });
  return descriptor;
};
const desc = curry(_desc);

// description and summary
const description = desc('description');

const summary = desc('summary');

const tags = desc('tags');

const params = curry(_params);

// below are [parameters]

// query params
const query = params('query');

// header params
const header = params('header');

// path params
const path = params('path');

// body params
const body = params('body');

// formData params
const formData = params('formData');

// class decorators
const orderAll = (weight: number) => (target: any) => {
  swaggerObject.addMulti(target, { order: weight });
};

const tagsAll = (items: string[] | string) => (target: any) => {
  const tags = is.array(items) ? items : [items];
  swaggerObject.addMulti(target, { tags });
};

const responsesAll = (responses: IResponses = defaultResp) => (target: any) => {
  swaggerObject.addMulti(target, { responses });
};

const middlewaresAll = (items: Function[] | Function) => (target: any) => {
  const middlewares = is.array(items) ? items : [items];
  target.middlewares = middlewares;
};

const securityAll = (security: any[] | any) => (target: any) => {
  const authentitactions = is.array(security) ? security : [security];
  swaggerObject.addMulti(target, {
    security: authentitactions
  });
};

const deprecatedAll = (target: any) => {
  swaggerObject.addMulti(target, { deprecated: true });
};

const prefix = (prefix: string) => (target: any) => {
  swaggerObject.addMulti(target, { prefix });
  target.prefix = prefix;
};

const queryAll = (parameters: { [name: string]: any }, filters = ['ALL']) => (target: any) => {
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

export default Doc;

export {
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
  securityAll,
  deprecatedAll,
  queryAll,
  prefix
};
