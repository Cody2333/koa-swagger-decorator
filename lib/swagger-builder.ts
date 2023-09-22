import {
  OpenApiGeneratorV3,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";
import { Container } from "./utils/container";
import {
  CONFIG_SYMBOL,
  DECORATOR_REQUEST,
  DECORATOR_SCHEMAS,
} from "./utils/constant";
import deepmerge from "deepmerge";

function handleRouteConfig(routeConfig: RouteConfig, identifier: string) {
  const meta =
    (Container.get(`DECORATOR_MERGE_${identifier}`) as Partial<RouteConfig>) ??
    {};
  delete meta.path;
  delete meta.method;
  if (!meta.operationId) {
    // set default operationId
    meta.operationId = identifier;
  }
  if (meta) {
    return deepmerge(routeConfig, meta);
  } else {
    return routeConfig;
  }
}

function handleSchemas() {
  const meta = Container.get(DECORATOR_SCHEMAS);
  if (meta) {
    for (const o of meta) {
      registry.register(o.refId, o.zodSchema);
    }
  }
}

function handleBody(routeConfig: RouteConfig, identifier: string) {
  const bodyMeta = Container.get(`DECORATOR_BODY_${identifier}`);
  if (bodyMeta) {
    registry.register(`${identifier}BodyRequest`, bodyMeta);
    const bodyConfig = {
      body: {
        content: {
          "application/json": {
            schema: {
              $ref: `#/components/schemas/${identifier}BodyRequest`,
            },
          },
        },
      },
    };
    routeConfig.request = {
      ...routeConfig.request,
      ...bodyConfig,
    };
  }
}

function handleResponse(routeConfig: RouteConfig, identifier: string) {
  const responsesMeta = Container.get(`DECORATOR_RESPONSES_${identifier}`);
  if (responsesMeta) {
    // TODO 处理非 200 状态码
    registry.register(`${identifier}Response`, responsesMeta);
    const responsesConfig = {
      responses: {
        "200": {
          description: "success",
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${identifier}Response`,
              },
            },
          },
        },
      },
    };
    routeConfig.responses = {
      ...routeConfig.responses,
      ...responsesConfig.responses,
    };
  }
}
export function prepareDocs(prefix?: string) {
  const apiList = Container.has(DECORATOR_REQUEST)
    ? Container.get(DECORATOR_REQUEST)
    : [];
  for (const { method, path, identifier } of apiList) {
    const routePath = prefix ? `${prefix}${path}` : path;
    const routeConfig: RouteConfig = {
      path: routePath,
      method,
      request: {},
      responses: {
        "200": {
          description: "成功响应",
        },
      },
    };

    handleBody(routeConfig, identifier);
    handleResponse(routeConfig, identifier);
    handleSchemas();

    // 注册 swagger 路由
    registry.registerPath(handleRouteConfig(routeConfig, identifier));
  }
  const g = new OpenApiGeneratorV3(registry.definitions);
  const spec = Container.get(CONFIG_SYMBOL).spec ?? {};
  return g.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0",
      title: "Swagger OpenAPI",
    },
    ...spec,
  });
}
