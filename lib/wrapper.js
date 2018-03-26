import _ from 'lodash';
import validate from './validate';
import { swaggerHTML } from './swaggerHTML';
import { swaggerJSON } from './swaggerJSON';
import { apiObjects } from './index';
import { convertPath, getPath, isSwaggerRouter, readSync } from './utils';

/**
 * allowed http methods
 */
const reqMethods = ['get', 'post', 'put', 'patch', 'delete'];


/**
 * middlewara for validating [query, path, body] params
 * @param {Object} parameters
 */
const validator = parameters => async (ctx, next) => {
  if (!parameters) {
    await next();
    return;
  }

  if (parameters.query) {
    ctx.validatedQuery = validate(ctx.request.query, parameters.query);
  }
  if (parameters.path) {
    ctx.validatedParams = validate(ctx.params, parameters.path);
  }
  if (parameters.body) {
    ctx.validatedBody = validate(ctx.request.body, parameters.body);
  }
  await next();
};


/**
 * add [ router.map ] and [ router.swagger ] for router object
 * @param {Object} router
 */
export default (router) => {
  router.swagger = (options) => {
    const {
      swaggerJsonEndpoint = '/swagger-json',
      swaggerHtmlEndpoint = '/swagger-html',
      prefix = '',
    } = options;

    // setup swagger router
    router.get(swaggerJsonEndpoint, async (ctx) => {
      ctx.body = swaggerJSON(options, apiObjects);
    });
    router.get(swaggerHtmlEndpoint, async (ctx) => {
      ctx.body = swaggerHTML(getPath(prefix, swaggerJsonEndpoint));
    });
  };
  router.map = (StaticClass) => {
    if (!isSwaggerRouter(StaticClass)) return;
    const methods = Object.getOwnPropertyNames(StaticClass);

    // remove useless field in class object:  constructor, length, name, prototype
    _.pull(methods, 'name', 'constructor', 'length', 'prototype');
    // map all method in methods
    methods
    // filter methods withour @request decorator
      .filter((item) => {
        const { path, method } = StaticClass[item];
        if (!path && !method) { return false; }
        return true;
      })
    // add router
      .forEach((item) => {
        const { path, method } = StaticClass[item];
        let {
          middlewares = []
        } = StaticClass[item];
        if (typeof middlewares === 'function') { middlewares = [middlewares]; }
        if (!Array.isArray(middlewares)) { throw new Error('middlewares params must be an array or function'); }
        middlewares.forEach((item) => {
          if (typeof item !== 'function') { throw new Error('item in middlewares must be a function'); }
        });
        if (!reqMethods.includes(method)) { throw new Error(`illegal API: ${method} ${path} at [${item}]`); }
        const chain = [
          `${convertPath(path)}`,
          validator(StaticClass[item].parameters),
          ...middlewares,
          StaticClass[item]
        ];
        router[method](...chain);
      });
  };

  router.mapDir = (dir, options = {}) => {
    const { recursive = false } = options;
    const filenames = readSync(dir, [], recursive);
    /* eslint-disable*/
    const classes = filenames.map(filename => require(filename));
    /* eslint-disable*/
    classes.map(c => c.default).forEach((c) => { router.map(c); });
  };
};

