import Router from 'koa-router';
import is from 'is-type-of';
import validate from './validate';
import { swaggerHTML } from './swaggerHTML';
import { swaggerJSON } from './swaggerJSON';
import swaggerObject from './swaggerObject';
import { convertPath, getPath, isSwaggerRouter, loadSwaggerClasses } from './utils';
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
    ctx.body = swaggerJSON(options, swaggerObject.data);
  });
  router.get(swaggerHtmlEndpoint, async (ctx) => {
    ctx.body = swaggerHTML(getPath(prefix, swaggerJsonEndpoint));
  });
};

const handleMap = (router, SwaggerClass, { doValidation = true }) => {
  if (!isSwaggerRouter(SwaggerClass)) return;
  // remove useless field in class object:  constructor, length, name, prototype
  const methods = Object
    .getOwnPropertyNames(SwaggerClass)
    .filter(method => !['name', 'constructor', 'length', 'prototype'].includes(method));
  // map all method in methods
  methods
  // filter methods withour @request decorator
    .filter((item) => {
      const { path, method } = SwaggerClass[item];
      if (!path && !method) { return false; }
      return true;
    })
  // add router
    .forEach((item) => {
      const { path, method } = SwaggerClass[item];
      let {
        middlewares = []
      } = SwaggerClass[item];
      if (is.function(middlewares)) { middlewares = [middlewares]; }
      if (!is.array(middlewares)) { throw new Error('middlewares params must be an array or function'); }
      middlewares.forEach((item) => {
        if (!is.function(item)) { throw new Error('item in middlewares must be a function'); }
      });
      if (!reqMethods.includes(method)) { throw new Error(`illegal API: ${method} ${path} at [${item}]`); }
      const chain = [
        `${convertPath(path)}`,
        doValidation ? validator(SwaggerClass[item].parameters) : async (ctx, next) => {
          await next();
        },
        ...middlewares,
        SwaggerClass[item]
      ];
      router[method](...chain);
    });
};

const handleMapDir = (router, dir, options) => {
  loadSwaggerClasses(dir, options)
    .forEach((c) => { router.map(c, options); });
};

const wrapper = (router) => {
  router.swagger = (options) => {
    handleSwagger(router, options);
  };
  router.map = (SwaggerClass, options) => {
    handleMap(router, SwaggerClass, options);
  };

  router.mapDir = (dir, options = {}) => {
    handleMapDir(router, dir, options);
  };
};

class SwaggerRouter extends Router {
  swagger(options) {
    handleSwagger(this, options);
  }

  map(SwaggerClass, options) {
    handleMap(this, SwaggerClass, options);
  }

  mapDir(dir, options = {}) {
    handleMapDir(this, dir, options);
  }
}

export { wrapper, SwaggerRouter };
