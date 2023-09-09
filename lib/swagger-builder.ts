import {
  OpenApiGeneratorV3,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";
import { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";
import { Container } from "./utils/container";
import { CONFIG_SYMBOL, DECORATOR_REQUEST } from "./utils/constant";

function handlePathParams(routeConfig: RouteConfig, identifier: string) {
  const meta = Container.get(`DECORATOR_PATHPARAMS_${identifier}`);
  if (meta) {
    routeConfig.request!.params = meta;
  }
}

function handleQuery(routeConfig: RouteConfig, identifier: string) {
  const meta = Container.get(`DECORATOR_QUERY_${identifier}`);
  if (meta) {
    routeConfig.request!.query = meta;
  }
}

function handleTags(routeConfig: RouteConfig, identifier: string) {
  const meta = Container.get(`DECORATOR_TAGS_${identifier}`);
  if (meta) {
    routeConfig.tags = meta;
  }
}

function handleSummary(routeConfig: RouteConfig, identifier: string) {
  const meta = Container.get(`DECORATOR_SUMMARY_${identifier}`);
  if (meta) {
    routeConfig.summary = meta;
  }
}

function handleDescription(routeConfig: RouteConfig, identifier: string) {
  const meta = Container.get(`DECORATOR_DESCRIPTION_${identifier}`);
  if (meta) {
    routeConfig.description = meta;
  }
}

function handleBody(routeConfig: RouteConfig, identifier: string) {
  const bodyMeta = Container.get(`DECORATOR_BODY_${identifier}`);
  if (bodyMeta) {
    registry.register(`${identifier}Request`, bodyMeta);
    const bodyConfig = {
      body: {
        content: {
          "application/json": {
            schema: {
              $ref: `#/components/schemas/${identifier}Request`,
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
export function prepareDocs(config: Partial<OpenAPIObjectConfig> = {}) {
  const apiList = Container.get(DECORATOR_REQUEST);
  for (const { method, path, name } of apiList) {
    const routeConfig: RouteConfig = {
      path,
      method,
      request: {},
      responses: {
        "200": {
          description: "成功响应",
        },
      },
    };
    handlePathParams(routeConfig, name);
    handleQuery(routeConfig, name);
    handleBody(routeConfig, name);
    handleResponse(routeConfig, name);
    handleTags(routeConfig, name);
    handleSummary(routeConfig, name);
    handleDescription(routeConfig, name);

    // 注册 swagger 路由
    registry.registerPath(routeConfig);
  }
  const g = new OpenApiGeneratorV3(registry.definitions);
  return g.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0",
      title: "Swagger OpenAPI",
    },
    ...(Container.get(CONFIG_SYMBOL) ?? {}),
    ...config,
  });
}
