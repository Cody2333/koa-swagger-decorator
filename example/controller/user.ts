import { Context } from "koa";
import { body, request, responses, summary } from "../../lib/decorator";
import { GetUserByIdRequest, GetUserByIdResponse } from "../schemas/user";

class UserController {
  @request("post", "/user")
  @summary("第一次测试")
  @body(GetUserByIdRequest)
  @responses(GetUserByIdResponse)
  async GetUserById(ctx: Context) {
    ctx.body = { uid: "aa" };
  }
}

export { UserController };
