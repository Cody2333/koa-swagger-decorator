import { ItemMeta, z } from "../../lib";
import { middlewares, responses, routeConfig } from "../../lib/decorator";
import { Context } from "koa";
import { AUTH_KEY } from "../schemas/extra";

export class DemoController {
  @routeConfig({
    path: "/demo",
    method: "get",
    security: [{ [AUTH_KEY]: [] }],
    tags: ["DEMO"],
    request: {
      query: z.object({
        xxx: z.string().nullable().openapi({
          example: "110",
        }),
      }),
    },
  })
  @middlewares([
    async (ctx, next) => {
      const x = ctx._swagger_decorator_meta as ItemMeta; // get swagger decorator meta info through ctx
      console.log("biz mid", x.routeConfig);
      await next();
    },
  ])
  @responses(
    z.object({
      msg: z.string().openapi({ example: "gg" }),
    })
  )
  async getDemo(ctx: Context) {
    ctx.body = { random: "ggg", ...ctx.request.query };
  }
}
