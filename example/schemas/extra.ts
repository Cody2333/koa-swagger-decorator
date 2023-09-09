import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "../../lib";

export const AUTH_KEY = "authorization";

export function registerExtraComponents(registry: OpenAPIRegistry) {
  registry.registerComponent("securitySchemes", "authorization", {
    type: "apiKey",
    name: "authorization",
    in: "header",
  });

  registry.registerComponent("schemas", "ExtraSchemasA", {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
  });

  registry.register(
    "ExtraZodSchema",
    z.object({
      age: z.number().min(18).openapi({ example: 20 }),
    })
  );
}
