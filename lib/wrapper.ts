import * as IRouter from 'koa-router';
import Router from 'koa-router';
import R from 'ramda';
import is from 'is-type-of';
import validate from './validate';
import { swaggerHTML } from './swaggerHTML';
import { swaggerJSON } from './swaggerJSON';
import swaggerObject from './swaggerObject';
import {
  convertPath,
  getPath,
  loadSwaggerClasses,
  reservedMethodNames,
  allowedMethods
} from './utils';

export interface Context extends IRouter.IRouterContext {
  validatedQuery: any;
  validatedBody: any;
  validatedParams: any;
}

const validator = (parameters: any) => async (ctx: Context, next: () => Promise<any>) => {
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

export interface SwaggerOptions {
  title?: string;
  description?: string;
  version?: string;
  swaggerJsonEndpoint?: string;
  swaggerHtmlEndpoint?: string;
  prefix?: string;
  swaggerOptions?: any;
  [name: string]: any;
}

const handleSwagger = (router: Router, options: SwaggerOptions) => {
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

const handleMap = (router: Router, SwaggerClass: any, { doValidation = true }) => {
  if (!SwaggerClass) return;
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
      const { path, method } = SwaggerClass[item] as {path: string, method: string};
      if (!path && !method) {
        return false;
      }
      return true;
    })
    // add router
    .forEach((item) => {
      const { path, method } = SwaggerClass[item] as {path: string, method: string};
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
      middlewares.forEach((item: Function) => {
        if (!is.function(item)) {
          throw new Error('item in middlewares must be a function');
        }
      });
      if (!allowedMethods.hasOwnProperty(method.toUpperCase())) {
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

      (router as any)[method](...chain);
    });
};

const handleMapDir = (router: SwaggerRouter, dir: string, options: MapOptions) => {
  loadSwaggerClasses(dir, options).forEach((c: any) => {
    router.map(c, options);
  });
};

export interface MapOptions {
  doValidation?: boolean;
  recursive?: boolean;
  [name: string]: any;
}
const wrapper = (router: SwaggerRouter) => {
  router.swagger = (options: SwaggerOptions = {}) => {
    handleSwagger(router, options);
  };
  router.map = (SwaggerClass: any, options: MapOptions = {}) => {
    handleMap(router, SwaggerClass, options);
  };

  router.mapDir = (dir: string, options: MapOptions = {}) => {
    handleMapDir(router, dir, options);
  };
};

class SwaggerRouter extends Router {
  swagger(options: SwaggerOptions = {}) {
    handleSwagger(this, options);
  }

  map(SwaggerClass: any, options: MapOptions) {
    handleMap(this, SwaggerClass, options);
  }

  mapDir(dir: string, options: MapOptions = {}) {
    handleMapDir(this, dir, options);
  }
}

export { wrapper, SwaggerRouter };
