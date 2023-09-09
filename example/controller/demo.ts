import { z } from "../../lib";
import { addSchemas, responses, routeConfig } from "../../lib/decorator";
import { Context } from "koa";

export class DemoController {
  @routeConfig({
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
  })
  @addSchemas(
    "ExtraStruct",
    z.object({
      msg: z.string().openapi({ example: "gg" }),
    })
  )
  @responses(
    z.object({
      msg: z.string().openapi({ example: "gg" }),
    })
  )
  async getDemo(ctx: Context) {
    ctx.body = { random: "ggg", ...ctx.request.query };
  }
}
