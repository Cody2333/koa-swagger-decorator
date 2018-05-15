import Router from 'koa-router';

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

const handleSwagger = (router, options) => {
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

const handleMap = (router, StaticClass, { doValidation = true }) => {
  if (!isSwaggerRouter(StaticClass)) return;
  // remove useless field in class object:  constructor, length, name, prototype
  const methods = Object
    .getOwnPropertyNames(StaticClass)
    .filter(method => !['name', 'constructor', 'length', 'prototype'].includes(method));
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
        doValidation ? validator(StaticClass[item].parameters) : async (ctx, next) => {
          await next();
        },
        ...middlewares,
        StaticClass[item]
      ];
      router[method](...chain);
    });
};

const handleMapDir = (router, dir, options) => {
  const { recursive = true } = options;
  const filenames = readSync(dir, [], recursive);
  /* eslint-disable */
  const classes = filenames.map(filename => require(filename));
  /* eslint-enable */
  classes.map(c => c.__esModule ? c.default : c).forEach((c) => { router.map(c, options); });
};

const wrapper = (router) => {
  router.swagger = (options) => {
    handleSwagger(router, options);
  };
  router.map = (StaticClass, options) => {
    handleMap(router, StaticClass, options);
  };

  router.mapDir = (dir, options = {}) => {
    handleMapDir(router, dir, options);
  };
};

class SwaggerRouter extends Router {
  swagger(options) {
    handleSwagger(this, options);
  }

  map(StaticClass, options) {
    handleMap(this, StaticClass, options);
  }

  mapDir(dir, options = {}) {
    handleMapDir(this, dir, options);
  }
}

export { wrapper, SwaggerRouter };
