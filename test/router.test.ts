import { test, describe, expect } from "bun:test";
import { SwaggerRouter } from "../lib";
import { prepareDocs } from "../lib/swagger-builder";

describe("SwaggerRouter", () => {
  test("#init SwaggerRouter with OpenAPI spec", () => {
    const router = new SwaggerRouter({
      swaggerHtmlEndpoint: "/test-html",
      swaggerJsonEndpoint: "/test-json",
      spec: {
        info: {
          title: "TEST_TITLE",
          version: "v1.0",
        },
      },
    });
    const docs = prepareDocs();
    expect(docs.info.title).toBe("TEST_TITLE");
  });

  test("#init SwaggerRouter with OpenAPI spec", () => {
    const router = new SwaggerRouter({
      swaggerHtmlEndpoint: "/test-html",
      swaggerJsonEndpoint: "/test-json",
    });
    router.swagger();
    expect(router.stack[0].path).toBe("/test-json");
    expect(router.stack[1].path).toBe("/test-html");
  });
});
