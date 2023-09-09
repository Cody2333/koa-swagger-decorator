import { Context } from "koa";
import {
  body,
  description,
  pathParams,
  query,
  request,
  responses,
  summary,
  tags,
} from "../../lib/decorator";
import {
  CreateUserReq,
  CreateUserRes,
  GetUserByIdRequest,
  GetUserByIdResponse,
  ListUserResponse,
  ListUsersRequest,
  UpdateUserReq,
  UpdateUserRes,
} from "../schemas/user";
import { z } from "../../lib";

class UserController {
  @request("get", "/user/{uid}")
  @summary("第一次测试")
  @tags(["USER"])
  @description("详细的接口介绍水果蛋糕打广告发给")
  @pathParams(GetUserByIdRequest)
  @responses(GetUserByIdResponse)
  async GetUserById(ctx: Context) {
    console.log((ctx.request as any).params);
    type IGetUserByIdResponse = z.infer<typeof GetUserByIdResponse>;
    ctx.body = {
      user: {
        id: (ctx.request as any).params.id,
        uid: "111",
        name: "ggggg",
      },
      message: "ok",
    } as IGetUserByIdResponse;
  }

  @request("get", "/users")
  @summary("用户列表")
  @tags(["USER"])
  @query(ListUsersRequest)
  @responses(ListUserResponse)
  async ListUsers(ctx: Context) {
    console.log(ctx.request.query);
    type IListUserRes = z.infer<typeof ListUserResponse>;
    ctx.body = { users: [] } as IListUserRes;
  }

  @request("post", "/users")
  @summary("创建用户")
  @tags(["USER", "CREATE"])
  @body(CreateUserReq)
  @responses(CreateUserRes)
  async CreateUser(ctx: Context) {
    console.log(ctx.request.body);
    type ICreateUserRes = z.infer<typeof CreateUserRes>;
    ctx.body = { message: "create", id: "123" } as ICreateUserRes;
  }

  @request("put", "/users/update")
  @summary("修改用户")
  @tags(["USER", "UPDATE"])
  @body(UpdateUserReq)
  @responses(UpdateUserRes)
  async UpdateUser(ctx: Context) {
    console.log(ctx.request.body);
    type IUpdateUserRes = z.infer<typeof UpdateUserRes>;
    ctx.body = { message: "updated", id: "123" } as IUpdateUserRes;
  }
}

export { UserController };
