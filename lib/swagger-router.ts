import { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";
import Router, { RouterOptions } from "@koa/router";
import { Container } from "./utils/container";
import {
  CONFIG_SYMBOL,
  convertPath,
  reservedMethodNames,
} from "./utils/constant";
import is from "is-type-of";
import swaggerHTML from "./swagger-html";
import { prepareDocs } from "./swagger-builder";

export interface SwaggerRouterConfig {
  swaggerJsonEndpoint?: string;
  swaggerHtmlEndpoint?: string;
  doValidation?: boolean;
  prefix?: string;
  spec?: Partial<OpenAPIObjectConfig>;
}
class SwaggerRouter<StateT = any, CustomT = {}> extends Router<
  StateT,
  CustomT
> {
  config: SwaggerRouterConfig;
  constructor(config: SwaggerRouterConfig = {}, opts: RouterOptions = {}) {
    super(opts);
    config.swaggerJsonEndpoint = config.swaggerJsonEndpoint ?? "/swagger-json";
    config.swaggerHtmlEndpoint = config.swaggerHtmlEndpoint ?? "/swagger-html";
    this.config = config;
    Container.set(CONFIG_SYMBOL, config);
  }
  swagger() {
    this.get(this.config.swaggerJsonEndpoint!, (ctx) => {
      ctx.body = prepareDocs();
    });

    this.get(this.config.swaggerHtmlEndpoint!, (ctx) => {
      ctx.body = swaggerHTML(this.config.swaggerJsonEndpoint!);
    });
  }

  applyRoute(SwaggerClass: any) {
    const SwaggerClassPrototype = SwaggerClass.prototype;
    const methods = Object.getOwnPropertyNames(SwaggerClassPrototype)
      .filter((method) => !reservedMethodNames.includes(method))
      .map((method) => {
        const wrapperMethod = async (ctx) => {
          const c = new SwaggerClass(ctx);
          await c[method](ctx);
        };
        // 添加了一层 wrapper 之后，需要把原函数的名称暴露出来 fnName
        // wrapperMethod 继承原函数的 descriptors
        const descriptors = Object.getOwnPropertyDescriptors(
          SwaggerClassPrototype[method]
        );
        Object.defineProperties(wrapperMethod, {
          fnName: {
            value: method,
            enumerable: true,
            writable: true,
            configurable: true,
          },
          ...descriptors,
        });
        return wrapperMethod;
      });
    [...methods]
      // filter methods withour @request decorator
      .filter((item: any) => {
        const { path, method } = item;
        if (!path && !method) {
          return false;
        }
        return true;
      })
      // add router
      .forEach((item: any) => {
        const { path, method } = item;
        let { middlewares = [] } = item;
        const localParams = item.parameters || {};

        if (is.function(middlewares)) {
          middlewares = [middlewares];
        }
        if (!is.array(middlewares)) {
          throw new Error("middlewares params must be an array or function");
        }
        middlewares.forEach((item: Function) => {
          if (!is.function(item)) {
            throw new Error("item in middlewares must be a function");
          }
        });

        const chain: [any] = [`${convertPath(`${path}`)}`];
        chain.push(...middlewares);
        chain.push(item);
        this[method](...chain);
      });
    return this;
  }
}

export { SwaggerRouter };
