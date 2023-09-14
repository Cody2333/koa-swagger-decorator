import { Context } from "koa";
import { body, middlewares, responses, routeConfig } from "../../lib/decorator";
import {
  CreateUserReq,
  CreateUserRes,
  GetUserByIdResponse,
  ICreateUserRes,
  IGetUserByIdResponse,
  IListUserReq,
  IListUserRes,
  ListUserResponse,
  ListUsersRequest,
  UpdateUserReq,
  UpdateUserRes,
} from "../schemas/user";
import { ParsedArgs, z } from "../../lib";
import { AUTH_KEY } from "../schemas/extra";

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
  async ListUsers(ctx: Context, args: ParsedArgs<IListUserReq>) {
    console.log(ctx.request.query, ctx.parsed.query);
    ctx.body = { users: [], args } as IListUserRes;
  }

  @routeConfig({
    method: "post",
    path: "/users",
    summary: "创建用户",
    tags: ["USER"],
    security: [{ [AUTH_KEY]: [] }],
    operationId: "CreateUser",
  })
  @middlewares([
    async (ctx: Context, next) => {
      console.log("CreateUser Middleware Test", ctx.headers.authorization);
      if (!ctx.headers.authorization) {
        throw new Error("request forbidden");
      }
      await next();
    },
  ])
  @body(CreateUserReq)
  @responses(CreateUserRes)
  async CreateUser(ctx: Context) {
    console.log(ctx.request.body);
    ctx.body = { message: "create", id: "123" } as ICreateUserRes;
  }

  @routeConfig({
    path: "/users/update",
    method: "put",
    tags: ["USER"],
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
