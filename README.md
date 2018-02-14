# koa-swagger-decorator [npm-url]
> using decorator to auto generate swagger json docs

## Installation


```bash
npm install koa-swagger-decorator
```

## Introduction

### Koa Swagger Decorator

using decorator to auto generate swagger json docs

based on [Swagger OpenAPI Specification 2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)

## Example

```
// using commonds below to start and test the example server

git clone https://github.com/Cody2333/koa-swagger-decorator.git

cd koa-swagger-decorator

npm install

npm run start

finally open:
http://localhost:3000/api/swagger-html

```

### Requirements

- Koa2
- koa-router
- babel support for decorator

```
// add [transform-decorators-legacy] to .babelrc

npm install --save-dev babel-plugin-transform-decorators-legacy

{
  "presets": [
    ["env", {"targets": {"node": "current"}}]
  ],
  "plugins": ["transform-decorators-legacy"]
}
```
### Introduction

for more detail please take a look at the [example koa server](https://github.com/Cody2333/koa-swagger-decorator/tree/master/example)

#### first wrapper the koa-router object

```
// router.js
import Router from 'koa-router';

import Test from './test';

import { wrapper } from 'koa-swagger-decorator';

const router = new Router();

wrapper(router);

// swagger docs avaliable at http://localhost:3000/api/swagger-html
router.swagger({

  title: 'Example Server',
  description: 'API DOC',
  version: '1.0.0',

  // [optional] default is root path.
  // if you are using koa-swagger-decorator within nested router, using this param to let swagger know your current router point
  prefix: '/api',

  // [optional] default is /swagger-html
  swaggerHtmlEndpoint: '/swagger-html',

  // [optional] default is /swagger-json
  swaggerJsonEndpoint: '/swagger-json',

  // [optional] additional options for building swagger doc
  // eg. add api_key as shown below
  swaggerOptions: {
    securityDefinitions: {
      api_key: {
        type: 'apiKey',
        in: 'header',
        name: 'api_key'
      }
    },
  }
});
// map all static methods at Test class for router
router.map(Test);

```

#### using decorator to make api definition

```
// test.js

import User from 'models/user';
import { request, summary, query, path, body, tags } from 'koa-swagger-decorator';

const testTag = tags(['test']);

const userSchema = {
  name: { type: 'string', required: true },
  gender: { type: 'string', required: false, example: 'male' },
  groups: {
    type: 'array',
    required: true,
    items: { type: 'string', example: 'group1' }
  }
};

export default class Test {
  @request('get', '/users')
  @summary('get user list')
  @testTag
  @query({
    type: { type: 'number', required: true, default: 1, description: 'type' }
  })
  static async getUsers(ctx) {
    const users = await User.findAll();
    ctx.body = { users };
  }

  @request('get', '/users/{id}')
  @summary('get user info by id')
  @testTag
  @path({
    id: { type: 'number', required: true, default: 1, description: 'id' }
  })
  static async getUser(ctx) {
    const { id } = ctx.params;
    const user = await User.findById(id);
    ctx.body = { user };
  }

  @request('post', '/users')
  @testTag
  @body(userSchema)
  static async postUser(ctx) {
    const body = ctx.request.body;
    ctx.body = { result: body };
  }

  static async temp(ctx) {
    ctx.body = { result: 'success' };
  }
}

```

#### avaliable annotations:

- tags         
- query
- path
- body
- formData
- middlewares
- summary
- description
- responses

```

request      // @request('POST', '/users')

tags         // @tags(['example'])

query        // @query({limit: {type: 'number', required: true, default: 10, description: 'desc'}})

path         // @path({limit: {type: 'number', required: true, default: 10, description: 'desc'}})

body         // @body({groups: {type: 'array', required: true, items: { type: 'string', example: 'group1' }}})

formData     // @formData({file: {type: 'file', required: true, description: 'file content'}})

middlewares  
// support koa middlewares. 
// eg. @middlewares([func1,func2])

summary      // @summary('api summary')

description  // @description('api description')

responses 
// @responses({ 200: { description: 'success'}, 400: { description: 'error'}})
// responses is optional
```



##### runing the project and it will generate docs through swagger ui

![image.png](http://upload-images.jianshu.io/upload_images/2563527-4b6ed895183a0055.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## License

 © MIT


[npm-url]: https://npmjs.org/package/koa-swagger-decorator
