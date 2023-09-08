import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";
import { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";
import { Container } from "./container";
import { CONFIG_SYMBOL, DECORATOR_REQUEST } from "./utils/constant";

export function prepareDocs(config: Partial<OpenAPIObjectConfig> = {}) {
  const apiList = Container.get(DECORATOR_REQUEST);
  for (const { method, path, name } of apiList) {
    const routeConfig = {
      path,
      method,
      request: {},
      responses: {
        "200": {
          description: "成功响应",
        },
      },
    };
    const bodyMeta = Container.get(`DECORATOR_BODY_${name}`);
    if (bodyMeta) {
      registry.register(`${name}Request`, bodyMeta);
      const bodyConfig = {
        body: {
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${name}Request`,
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

    const responsesMeta = Container.get(`DECORATOR_RESPONSES_${name}`);
    if (responsesMeta) {
      // TODO 处理非 200 状态码
      registry.register(`${name}Response`, responsesMeta);
      const responsesConfig = {
        responses: {
          "200": {
            description: "success",
            content: {
              "application/json": {
                schema: {
                  $ref: `#/components/schemas/${name}Response`,
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
