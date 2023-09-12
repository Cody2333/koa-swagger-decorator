# koa-swagger-decorator

> defined your api with simple decorators and generate api docs automatically

## Important

this docs is written for V2. refer to [V1 Docs](https://github.com/Cody2333/koa-swagger-decorator/tree/develop)

V2 version has undergone complete refactoring, introducing break change and new APIs to provide more type-safe functionality.

## Installation

`npm i koa-swagger-decorator@2`

## Introduction

Creating type-safe API using decorator and zod schema with auto-generated OpenAPI docs based on [OpenAPI V3](https://swagger.io/specification/)

## Quick Start

### Example

you can refer to example dir for details.

```typescript
git clone https://github.com/Cody2333/koa-swagger-decorator.git
cd koa-swagger-decorator
npm i
npm run dev

// open http://localhost:3000/swagger-html to execute api
// open example dir for detail codes.
```

### Integrate with Koa

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

following below steps to integrate your koa application with koa-swagger-decorator

```
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
    summary: "创建用户",
    tags: ["USER"],
    operationId: "CreateUser",
  })
  @body(CreateUserReq)
  @responses(CreateUserRes)
  async CreateUser(ctx: Context, args: ParsedArgs<ICreateUserReq>) {
    // args is injected with values = CreateUserReq.parse(ctx.request.body)
    console.log(args, args.uid, args.name);
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
  doValidation: true,
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


# TODO List

- support request validation
- support response validation
- support middleware decorator
- support adding exist components to spec
- support generate openapi docs without starting app
- add unit test
- support form-data request
- support define non-200 responses
