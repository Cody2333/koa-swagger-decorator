import Router from 'koa-router';
import * as Koa from 'koa';
import R from 'ramda';
import is from 'is-type-of';
import validate from './validate';
import { swaggerHTML } from './swaggerHTML';
import { swaggerJSON } from './swaggerJSON';
import swaggerObject from './swaggerObject';
import {
  convertPath,
  getPath,
  isSwaggerRouter,
  loadSwaggerClasses,
  reservedMethodNames
} from './utils';

export interface Context extends Koa.Context {
  validatedQuery: any;
  validatedBody: any;
  validatedParams: any;
}
/**
 * allowed http methods
 */
const reqMethods = ['get', 'post', 'put', 'patch', 'delete'];

const validator = (parameters: any) => async (ctx: Context, next: any) => {
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

const handleSwagger = (router: any, options: any) => {
  const {
    swaggerJsonEndpoint = '/swagger-json',
    swaggerHtmlEndpoint = '/swagger-html',
    prefix = ''
  } = options;

  // setup swagger router
  router.get(swaggerJsonEndpoint, async (ctx: Context) => {
    ctx.body = swaggerJSON(options, swaggerObject.data);
  });
  router.get(swaggerHtmlEndpoint, async (ctx: Context) => {
    ctx.body = swaggerHTML(getPath(prefix, swaggerJsonEndpoint));
  });
};

const handleMap = (router: any, SwaggerClass: any, { doValidation = true }) => {
  if (!isSwaggerRouter(SwaggerClass)) return;
  const classMiddlewares: any[] = SwaggerClass.middlewares || [];
  const classPrefix: string = SwaggerClass.prefix || '';

  const classParameters: any = SwaggerClass.parameters || {};
  const classParametersFilters: any[] = SwaggerClass.parameters
    ? SwaggerClass.parameters.filters
    : ['ALL'];
  classParameters.query = classParameters.query ? classParameters.query : {};

  // remove useless field in class object:  constructor, length, name, prototype
  const methods = Object.getOwnPropertyNames(SwaggerClass).filter(method => !reservedMethodNames.includes(method));
  // map all method in methods
  methods
    // filter methods withour @request decorator
    .filter((item) => {
      const { path, method } = SwaggerClass[item];
      if (!path && !method) {
        return false;
      }
      return true;
    })
    // add router
    .forEach((item) => {
      const { path, method } = SwaggerClass[item];
      let { middlewares = [] } = SwaggerClass[item];
      const localParams = SwaggerClass[item].parameters || {};

      if (
        classParametersFilters.includes('ALL') ||
        classParametersFilters.map(i => i.toLowerCase()).includes(method)
      ) {
        const globalQuery = R.clone(classParameters.query);
        localParams.query = localParams.query ? localParams.query : {};
        // merge local query and class query
        // local query 的优先级更高
        localParams.query = Object.assign(globalQuery, localParams.query);
      }
      if (is.function(middlewares)) {
        middlewares = [middlewares];
      }
      if (!is.array(middlewares)) {
        throw new Error('middlewares params must be an array or function');
      }
      middlewares.forEach((item: any) => {
        if (!is.function(item)) {
          throw new Error('item in middlewares must be a function');
        }
      });
      if (!reqMethods.includes(method)) {
        throw new Error(`illegal API: ${method} ${path} at [${item}]`);
      }

      const chain = [
        `${convertPath(`${classPrefix}${path}`)}`,
        doValidation
          ? validator(localParams)
          : async (ctx: Context, next: any) => {
            await next();
          },
        ...classMiddlewares,
        ...middlewares,
        SwaggerClass[item]
      ];

      router[method](...chain);
    });
};

const handleMapDir = (router: any, dir: any, options: any) => {
  loadSwaggerClasses(dir, options).forEach((c: any) => {
    router.map(c, options);
  });
};

const wrapper = (router: any) => {
  router.swagger = (options: any = {}) => {
    handleSwagger(router, options);
  };
  router.map = (SwaggerClass: any, options = {}) => {
    handleMap(router, SwaggerClass, options);
  };

  router.mapDir = (dir: string, options: any = {}) => {
    handleMapDir(router, dir, options);
  };
};

class SwaggerRouter extends Router {
  swagger(options: any) {
    handleSwagger(this, options);
  }

  map(SwaggerClass: any, options: any) {
    handleMap(this, SwaggerClass, options);
  }

  mapDir(dir: string, options: any = {}) {
    handleMapDir(this, dir, options);
  }
}

export { wrapper, SwaggerRouter };
