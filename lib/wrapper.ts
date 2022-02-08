import { RouterContext, RouterOptions } from '@koa/router';
import Router from '@koa/router';

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
import { Data } from './types';
import { writeFileSync } from 'fs';
import path from 'path';
import compose from 'koa-compose';
import { clone } from 'ramda';

export interface Context extends RouterContext {
  validatedQuery: any;
  validatedBody: any;
  validatedParams: any;
}

const validator = (parameters: any) => async (
  ctx: Context,
  next: () => Promise<any>
) => {
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
    ctx.validatedBody = validate((ctx.request as any).body, parameters.body);
  }
  await next();
};

export interface SwaggerDisplayConfiguration {
  deepLinking?: boolean;
  displayOperationId?: boolean;
  defaultModelsExpandDepth?: number;
  defaultModelExpandDepth?: number;
  defaultModelRendering?: 'example' | 'model';
  displayRequestDuration?: boolean;
  docExpansion?: 'list' | 'full' | 'none';
  filter?: boolean | string;
  maxDisplayedTags?: number;
  showExtensions?: boolean;
  showCommonExtensions?: boolean;
}

export interface SwaggerConfiguration {
  display?: SwaggerDisplayConfiguration;
}

export interface SwaggerOptions {
  title?: string;
  description?: string;
  version?: string;
  swaggerJsonEndpoint?: string;
  swaggerHtmlEndpoint?: string;
  prefix?: string;
  swaggerOptions?: any;
  swaggerConfiguration?: SwaggerConfiguration;
  [name: string]: any;
}

export interface DumpOptions {
  dir: string,
  filename: string,
}

const handleDumpSwaggerJSON = (
  router: SwaggerRouter,
  dumpOptions: DumpOptions,
  options: SwaggerOptions = {}
) => {
  let data: Data = {};
  const { dir = process.cwd(), filename = 'swagger.json' } = dumpOptions;
  Object.keys(swaggerObject.data).forEach((k) => {
    if (router.swaggerKeys.has(k)) {
      data[k] = swaggerObject.data[k];
    }
  });
  console.log(path.resolve(dir, filename));
  const jsonData = swaggerJSON(options, data);
  writeFileSync(path.resolve(dir, filename), JSON.stringify(jsonData, null, 2));
};
const handleSwagger = (router: SwaggerRouter, options: SwaggerOptions) => {
  const {
    swaggerJsonEndpoint = '/swagger-json',
    swaggerHtmlEndpoint = '/swagger-html',
    prefix = '',
    swaggerConfiguration = {},
  } = options;

  // setup swagger router
  router.get(swaggerJsonEndpoint, async (ctx: Context) => {
    let data: Data = {};
    if (router instanceof SwaggerRouter) {
      Object.keys(swaggerObject.data).forEach(k => {
        if (router.swaggerKeys.has(k)) {
          data[k] = swaggerObject.data[k];
        }
      });
    } else {
      // 兼容使用 wrapper 的情况
      data = swaggerObject.data;
    }
    ctx.body = swaggerJSON(options, data);
  });
  router.get(swaggerHtmlEndpoint, async (ctx: Context) => {
    ctx.body = swaggerHTML(
      getPath(prefix, swaggerJsonEndpoint),
      swaggerConfiguration
    );
  });
};

const handleMap = (
  router: SwaggerRouter,
  SwaggerClass: any,
  { doValidation = true },
) => {
  if (!SwaggerClass) return;
  const classMiddlewares: any[] = SwaggerClass.middlewares || [];
  const classPrefix: string = SwaggerClass.prefix || '';

  const classParameters: any = SwaggerClass.parameters || {};
  const classParametersFilters: any[] = SwaggerClass.parameters
    ? SwaggerClass.parameters.filters
    : ['ALL'];
  classParameters.query = classParameters.query ? classParameters.query : {};

  const staticMethods = Object.getOwnPropertyNames(SwaggerClass)
    .filter(method => !reservedMethodNames.includes(method))
    .map((method) => {
      const func = SwaggerClass[method];
      if (typeof func !== 'object' && typeof func !== 'function') {
        return {};
      }
      func['fnName'] = method;
      return func;
    });

  const SwaggerClassPrototype = SwaggerClass.prototype;
  const methods = Object.getOwnPropertyNames(SwaggerClassPrototype)
    .filter((method) => !reservedMethodNames.includes(method))
    .map((method) => {
      const wrapperMethod = async (ctx: Context) => {
        const c = new SwaggerClass(ctx);
        await c[method](ctx);
      };
      // 添加了一层 wrapper 之后，需要把原函数的名称暴露出来 fnName
      // wrapperMethod 继承原函数的 descriptors
      const descriptors = Object.getOwnPropertyDescriptors(SwaggerClassPrototype[method]);
      Object.defineProperties(wrapperMethod, {
        fnName: {
          value: method,
          enumerable: true,
          writable: true,
          configurable: true,
        },
        ...descriptors
      })
      return wrapperMethod;
    });

  // map all methods
  [...staticMethods, ...methods]
    // filter methods withour @request decorator
    .filter((item) => {
      const { path, method } = item;
      if (!path && !method) {
        return false;
      }
      return true;
    })
    // add router
    .forEach((item) => {
      router._addKey(`${SwaggerClass.name}-${item.fnName}`);
      const { path, method } = item;
      let { middlewares = [] } = item;
      const localParams = item.parameters || {};

      if (
        classParametersFilters.includes('ALL') ||
        classParametersFilters.map(i => i.toLowerCase()).includes(method)
      ) {
        const globalQuery = clone(classParameters.query);
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

      const chain: [any] = [`${convertPath(`${classPrefix}${path}`)}`];
      if (doValidation) {
        chain.push(validator(localParams));
      }
      chain.push(...classMiddlewares);
      chain.push(...middlewares);
      chain.push(item);
      (router as any)[method](...chain);
    });
};

const handleMapDir = (router: SwaggerRouter, dir: string, options: MapOptions) => {
  loadSwaggerClasses(dir, options).forEach((c: any) => {
    router.map(c, options);
  });
};


const handleBuildMiddleware = (
  router: SwaggerRouter,
  SwaggerClass: any,
  { doValidation = true },
) => {
  const meta: { path: string, method: string, middlewares: any[], name: string }[] = [];
  if (!SwaggerClass) return meta;
  const classMiddlewares: any[] = SwaggerClass.middlewares || [];
  const classPrefix: string = SwaggerClass.prefix || '';

  const classParameters: any = SwaggerClass.parameters || {};
  const classParametersFilters: any[] = SwaggerClass.parameters
    ? SwaggerClass.parameters.filters
    : ['ALL'];
  classParameters.query = classParameters.query ? classParameters.query : {};

  const staticMethods = Object.getOwnPropertyNames(SwaggerClass)
    .filter(method => !reservedMethodNames.includes(method))
    .map((method) => {
      const func = SwaggerClass[method];
      func['fnName'] = method;
      return func;
    });

  const SwaggerClassPrototype = SwaggerClass.prototype;
  const methods = Object.getOwnPropertyNames(SwaggerClassPrototype)
    .filter((method) => !reservedMethodNames.includes(method))
    .map((method) => {
      const wrapperMethod = async (ctx: Context) => {
        const c = new SwaggerClass(ctx);
        await c[method](ctx);
      };
      // 添加了一层 wrapper 之后，需要把原函数的名称暴露出来 fnName
      // wrapperMethod 继承原函数的 descriptors
      const descriptors = Object.getOwnPropertyDescriptors(SwaggerClassPrototype[method]);
      Object.defineProperties(wrapperMethod, {
        fnName: {
          value: method,
          enumerable: true,
          writable: true,
          configurable: true,
        },
        ...descriptors
      })
      return wrapperMethod;
    });

  // map all methods
  [...staticMethods, ...methods]
    // filter methods withour @request decorator
    .filter((item) => {
      const { path, method } = item;
      if (!path && !method) {
        return false;
      }
      return true;
    })
    // add router
    .forEach((item) => {
      router._addKey(`${SwaggerClass.name}-${item.fnName}`);
      const { path, method } = item;
      let { middlewares = [] } = item;
      const localParams = item.parameters || {};

      if (
        classParametersFilters.includes('ALL') ||
        classParametersFilters.map(i => i.toLowerCase()).includes(method)
      ) {
        const globalQuery = clone(classParameters.query);
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


      const endpoint = `${convertPath(`${classPrefix}${path}`)}`;
      const chain: any[] = [];
      if (doValidation) {
        chain.push(validator(localParams));
      }
      chain.push(...classMiddlewares);
      chain.push(...middlewares);
      meta.push({ path: endpoint, method: method.toLowerCase(), middlewares: chain, name: item.name });
    });
  return meta.map(m => ({
    path: m.path, method: m.method, middleware: compose(m.middlewares), name: m.name
  })) as { path: string, method: string, middleware: any, name: string }[];
};
export interface MapOptions {
  doValidation?: boolean;
  recursive?: boolean;
  [name: string]: any;
  ignore?: string[];
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

class SwaggerRouter<StateT = any, CustomT = {}> extends Router<StateT, CustomT> {
  public swaggerKeys: Set<String>;
  public opts: RouterOptions;
  public swaggerOpts: SwaggerOptions;

  constructor(opts: RouterOptions = {}, swaggerOpts: SwaggerOptions = {}) {
    super(opts);
    this.opts = opts || {}; // koa-router opts
    this.swaggerKeys = new Set();
    this.swaggerOpts = swaggerOpts || {}; // swagger-router opts

    if (this.opts.prefix && !this.swaggerOpts.prefix) {
      this.swaggerOpts.prefix = this.opts.prefix;
    }
  }

  _addKey(str: String) {
    this.swaggerKeys.add(str);
  }

  swagger(options: SwaggerOptions = {}) {
    const opts = Object.assign(options, this.swaggerOpts);
    handleSwagger(this, opts);
  }

  dumpSwaggerJson(dumpOptions: DumpOptions, options: SwaggerOptions = {}) {
    const opts = Object.assign(options, this.swaggerOpts);
    handleDumpSwaggerJSON(this, dumpOptions, opts);
  }

  map(SwaggerClass: any, options: MapOptions) {
    handleMap(this, SwaggerClass, options);
  }

  mapDir(dir: string, options: MapOptions = {}) {
    handleMapDir(this, dir, options);
  }

  // compose & create a middleware for validator & @middlewares decorators
  buildMiddleware(SwaggerClass: any, options: MapOptions) {
    return handleBuildMiddleware(this, SwaggerClass, options)
  }
}

export { wrapper, SwaggerRouter };
