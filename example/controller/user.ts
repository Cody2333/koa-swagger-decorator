import { Context } from "koa";
import { body, responses, routeConfig } from "../../lib/decorator";
import {
  CreateUserReq,
  CreateUserRes,
  GetUserByIdResponse,
  ListUserResponse,
  ListUsersRequest,
  UpdateUserReq,
  UpdateUserRes,
} from "../schemas/user";
import { z } from "../../lib";

class UserController {
  @routeConfig({
    method: "get",
    path: "/user/{uid}",
    summary: "get user by id",
    description: "detailed user",
    tags: ["USER"],
    operationId: "GetUserById",
    request: {
      params: z.object({
        uid: z.string().nonempty(),
      }),
    },
  })
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

  @routeConfig({
    method: "get",
    path: "/users",
    summary: "获取用户列表",
    description: "merge description",
    tags: ["USER", "HAHAHA"],
    operationId: "ListUsers",
    request: {
      query: ListUsersRequest,
    },
  })
  @responses(ListUserResponse)
  async ListUsers(ctx: Context) {
    console.log(ctx.request.query);
    type IListUserRes = z.infer<typeof ListUserResponse>;
    ctx.body = { users: [] } as IListUserRes;
  }

  @routeConfig({
    method: "post",
    path: "/users",
    summary: "创建用户",
    tags: ["USER"],
    operationId: "CreateUser",
  })
  @body(CreateUserReq)
  @responses(CreateUserRes)
  async CreateUser(ctx: Context) {
    console.log(ctx.request.body);
    type ICreateUserRes = z.infer<typeof CreateUserRes>;
    ctx.body = { message: "create", id: "123" } as ICreateUserRes;
  }

  @routeConfig({
    path: "/users/update",
    method: "put",
    tags: ["USER"],
    operationId: "UpdateUser",
  })
  @body(UpdateUserReq)
  @responses(UpdateUserRes)
  async UpdateUser(ctx: Context) {
    console.log(ctx.request.body);
    type IUpdateUserRes = z.infer<typeof UpdateUserRes>;
    ctx.body = { message: "updated", id: "123" } as IUpdateUserRes;
  }
}

export { UserController };
