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
import { registry } from "./registry";
import { OpenAPIRegistry, RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Context, Middleware } from "koa";
import { ZodTypeAny } from "zod";

export interface ItemMeta {
  bodySchema?: ZodTypeAny;
  responsesSchema?: ZodTypeAny;
  routeConfig: RouteConfig;
  middlewares?: Middleware[];
}
export interface SwaggerRouterConfig {
  swaggerJsonEndpoint?: string;
  swaggerHtmlEndpoint?: string;
  doValidation?: boolean;
  validateResponse?: boolean;
  validateRequest?: boolean;
  prefix?: string;
  spec?: Partial<OpenAPIObjectConfig>;
}
class SwaggerRouter<StateT = any, CustomT = {}> extends Router<
  StateT,
  CustomT
> {
  config: SwaggerRouterConfig;
  registry: OpenAPIRegistry;
  constructor(config: SwaggerRouterConfig = {}, opts: RouterOptions = {}) {
    super(opts);
    config.swaggerJsonEndpoint = config.swaggerJsonEndpoint ?? "/swagger-json";
    config.swaggerHtmlEndpoint = config.swaggerHtmlEndpoint ?? "/swagger-html";
    if (config.doValidation) {
      config.validateRequest = true;
    }
    this.config = config;
    this.registry = registry;
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
    ([...methods] as any)
      // filter methods withour @request decorator
      .filter((item: ItemMeta) => {
        const { routeConfig } = item;
        if (!routeConfig) {
          return false;
        }
        const { method, path } = routeConfig;
        if (!path && !method) {
          return false;
        }
        return true;
      })
      // add router
      .forEach((item: ItemMeta) => {
        const { routeConfig, bodySchema, responsesSchema } = item;
        let { middlewares = [] } = item;

        if (!is.array(middlewares)) {
          throw new Error("middlewares params must be an array or function");
        }
        middlewares.forEach((item: Function) => {
          if (!is.function(item)) {
            throw new Error("item in middlewares must be a function");
          }
        });

        const validationMid = (ctx: Context, next: any) => {
          ctx._swagger_decorator_meta = item;
          ctx.parsed = {
            query: ctx.request.query,
            params: (ctx.request as any)?.params,
            body: ctx.request.body,
          };
          if (this.config.validateRequest) {
            if (routeConfig.request?.query) {
              ctx.parsed.query = routeConfig.request?.query.parse(
                ctx.request.query
              );
            }
            if (routeConfig.request?.params) {
              ctx.parsed.params = routeConfig.request?.params.parse(
                (ctx.request as any).params
              );
            }
            if (bodySchema) {
              ctx.parsed.body = bodySchema.parse(ctx.request.body);
            }
          }

          next();
          // if (this.config.validateResponse) {
          //   if (responsesSchema) {
          //     responsesSchema.parse()
          //   }
          // }
        };
        const chain: [any] = [`${convertPath(`${routeConfig.path}`)}`];
        chain.push(validationMid);
        chain.push(...middlewares);
        chain.push((ctx) => (item as any)(ctx, ctx.parsed));
        this[routeConfig.method](...chain);
      });
    return this;
  }
}

export { SwaggerRouter };
