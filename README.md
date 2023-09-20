# koa-swagger-decorator

> defined your api with simple decorators and generate api docs automatically

## Important

this docs is written for V2 and it's currently under development. 
refer to [V1 Docs](https://github.com/Cody2333/koa-swagger-decorator/tree/develop) for V1 version

V2 version has undergone complete refactoring, introducing break change and new APIs to provide more type-safe functionality.

1. [Installation](#installation)
2. [Introduction](#introduction)
3. [Usage](#usage)
    1. [Quick Example](#quick-example)
    2. [Runnable Example](#runnable-example)
    3. [Typescript Configuration](#typescript-configuration)
    4. [Integrate with Koa](#integrate-with-koa)
    5. [Define query/path params](#define-querypath-params)
    6. [Define body/responses params](#define-bodyresponses-params)
    7. [Using router.prefix](#using-routerprefix)
    8. [Using Middlewares](#using-middlewares)

4. [TODO List](#todo-list)

## Installation

`npm i koa-swagger-decorator@next`

## Introduction

Developing your type-safe API using simple decorators and zod schema with auto-generated OpenAPI docs based on [OpenAPI V3](https://swagger.io/specification/).

- use [zod schema](https://github.com/colinhacks/zod) to define and validate Request/Response objects.
- use [zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi) to convert zod schema into [OpenAPI V3](https://swagger.io/specification/) schemas.
- use [@koa/router](https://github.com/koajs/router) to register routes & api handler to Koa application.

## Usage

### Quick Example
```typescript
// define your api handler with @routeConfig decorator and it will generate OpenAPI Docs automatically
class UserController {
  @routeConfig({ // define your API route info using @routeConfig decorator
    method: "post",
    path: "/users",
    summary: "create a user",
    tags: ["USER"],
    operationId: "CreateUser",
  })
  @body(z.object({uid: z.string(), name: z.string(), age: z.number().min(18).optional()}))
  async CreateUser(ctx: Context, args) {
    // body params will be validated using zodSchema.parse(ctx.request.body)
    // and assigned the parsed value to args.
    console.log(args, args.body.uid, args.body.name);
    ctx.body = { message: "create", id: "123" } as ICreateUserRes;
  }
}
```
### Runnable Example

you can refer to example dir for details.

```typescript
git clone https://github.com/Cody2333/koa-swagger-decorator.git
cd koa-swagger-decorator
npm i
npm run dev

// open http://localhost:3000/api/swagger-html to execute api
// open example dir for detail codes.
```
### Typescript Configuration

typescript is required. Please make sure **compilerOptions** is set correctly in tsconfig.json

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true,
  }
}
```

### Integrate with Koa

following below steps to integrate your koa application with koa-swagger-decorator


1. Define your Request/Response with [Zod Schema](https://github.com/colinhacks/zod)
```typescript
// file -> ./schema/user.ts
import { z } from 'koa-swagger-decorator'
// define req/res schema
const CreateUserReq = z.object({
  uid: z.string().nonempty(),
  name: z.string().nullable().optional(),
  age: z.number().min(18).nullable(),
  operator: z.string().nonempty().optional(),
});

const CreateUserRes = z.object({
  id: z.string().nullable(),
  message: z.string().nullable(),
});

// export req/res typings
export type ICreateUserRes = z.infer<typeof CreateUserRes>;
export type ICreateUserReq = z.infer<typeof CreateUserReq>;
```
2. Write your API Handler with decorator and zod schema 

```typescript
// file -> ./controller/user.ts
import { Context } from "koa";
import { body, responses, routeConfig } from "../../lib/decorator";
import {
  CreateUserReq,
  CreateUserRes,
} from "../schemas/user";
import { ParsedArgs, z } from "../../lib";

class UserController {
 
  @routeConfig({ // define your API route info using @routeConfig decorator
    method: "post",
    path: "/users",
    summary: "create a user",
    tags: ["USER"],
    operationId: "CreateUser",
  })
  @body(CreateUserReq)
  @responses(CreateUserRes)
  async CreateUser(ctx: Context, args: ParsedArgs<ICreateUserReq>) {
    // args is injected with values = CreateUserReq.parse(ctx.request.body)
    console.log(args, args.body.uid, args.body.name);
    ctx.body = { message: "create", id: "123" } as ICreateUserRes;
  }

}

export { UserController };

```
3. Init SwaggerRouter Instance

```typescript
// file -> ./routes/index.ts
import { SwaggerRouter } from 'koa-swagger-decorator'
import { UserController } from './controller/user'

const router = new SwaggerRouter({
  spec: {
    info: {
      title: "Example API Server",
      version: "v1.0",
    },
  },
  swaggerHtmlEndpoint: '/swagger-html',
  swaggerJsonEndpoint: '/swagger-json',
});

// apply swagger docs routes
router.swagger();

// register user defined routes implementation
router
  .applyRoute(UserController)
  // .applyRoute(DemoController); // chained for more then one controller imports

export {router}
```

4. Init Koa Application
```typescript
// file -> ./main.ts
import {router} from './routes/index'
const app = new Koa();
app
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

export default app.listen(config.port, () => {
  console.log(`App is listening on ${config.port}.`);
});

// running ts-node ./main.ts and that's all
```

### Define query/path params
```typescript
@routeConfig({
  method: "get",
  path: "/user/{uid}",
  summary: "get user by id",
  description: "detailed user",
  tags: ["USER"],
  operationId: "GetUserById",
  request: {
    params: z.object({
      uid: z.string().nonempty(), // path params, don't forget to add {uid} in [path] field.
    }),
    query: z.object({
      count: z.coerce.number().default(10), // using z.coerce to convert query string into number & validate
      limit: z.coerce.number().default(0),
    })
  },
})
```

### Define body/responses params

define params by adding @body/@responses decorators to your handler

```typescript
  @routeConfig({
    path: "/users/update",
    method: "put",
    tags: ["USER"],
    operationId: "UpdateUser",
  })
  @body([ZodSchema])
  @responses([ZodSchema])
```

### Using router.prefix

```typescript
const router = new SwaggerRouter({});

router.prefix("/api");
```

by calling router.prefix, your swagger docs routes & biz routes will automatically add prefix "**/api**".
Open http://localhost:3000/api/swagger-html to get swagger docs.

### Using Middlewares

using @middlewares decorator for your handler method

```typescript
  @middlewares([
    async (ctx, next) => {
      const x = ctx._swagger_decorator_meta as ItemMeta; // get swagger decorator meta info through ctx
      console.log("biz mid", x.routeConfig);
      await next();
    },
  ])
```

# TODO List

- [x] support request validation
- [ ] support response validation
- [x] support middleware decorator
- [x] support adding exist components to spec
- [ ] support generate openapi docs without starting app
- [ ] add unit test
- [ ] support form-data request
- [ ] support define non-200 responses
- [ ] support class decorators

