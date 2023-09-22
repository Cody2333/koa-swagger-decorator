import { test, expect, describe } from "bun:test";
import swaggerHTML from "../lib/swagger-html";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { body, routeConfig } from "../lib";
import { prepareDocs } from "../lib/swagger-builder";
import { ParameterObject } from "openapi-client-axios";

describe("swagger-html", () => {
  test("# using custom swagger ui", () => {
    const res = swaggerHTML("", {
      "swagger-ui-bundle": "my_custom/swagger-ui-bundle.js",
      "swagger-ui-css": "my_custom/swagger-ui.css",
    });
    expect(res).toInclude('src="my_custom/swagger-ui');
  });
});

describe("swagger-builder", () => {
  test("#@routeConfig", () => {
    const c: Partial<RouteConfig> = {
      path: "/demo",
      method: "get",
      tags: ["DEMO"],
      request: {
        query: z.object({
          xxx: z.string().nullable().openapi({
            example: "110",
          }),
        }),
      },
    };
    routeConfig(c)({}, "testFn", {
      value: {},
    });
    const ret = prepareDocs("");
    expect(
      (ret.paths["/demo"].get?.parameters![0] as ParameterObject).name
    ).toBe("xxx");
    expect((ret.paths["/demo"].get?.parameters![0] as ParameterObject).in).toBe(
      "query"
    );
  });

  test("#@body", () => {
    const c: Partial<RouteConfig> = {
      path: "/demo_body",
      method: "post",
      tags: ["DEMO"],
      request: {},
    };
    routeConfig(c)({}, "testBodyFn", {
      value: {},
    });
    body(
      z.object({
        a: z.string(),
      })
    )({}, "testBodyFn", { value: {} });
    const ret = prepareDocs("");
    expect(
      (ret.paths["/demo_body"].post?.requestBody! as any).content[
        "application/json"
      ].schema.$ref
    ).toBe("#/components/schemas/Object-testBodyFnBodyRequest");
  });
});
