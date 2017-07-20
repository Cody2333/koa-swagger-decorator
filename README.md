# koa-swagger-decorator [npm-url]
> using decorator to auto generate swagger json docs

## Installation


```bash
npm install koa-swagger-decorator
```

## Introduction

### Koa Swagger Decorator

[working in progress]
using decorator to auto generate swagger json docs

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

first wrapper the koa-router object

```
// router.js
import Router from 'koa-router';

import Test from './test';

import { wrapper } from 'koa-swagger-decorator';

const router = new Router();

// get swagger json doc at endpoint: /swagger-json and /swgger-html
wrapper(router);

// map all static methods at Test class for router
router.map(Test);

```

using decorator to make api definition

```
// test.js

import User from 'models/user';
import { request, summary, query, path, body, tags } from 'koa-swagger-decorator';

const testTag = tags(['test']);

const userSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    gender: { type: 'string' }
  }
};

export default class Test {
  @request('get', '/users')
  @summary('get user list')
  @testTag
  @query([{
    name: 'type',
    required: false,
    type: 'string',
    description: 'type for filter',
  }])
  static async getUsers(ctx) {
    const users = await User.findAll();
    ctx.body = { users };
  }

  @request('get', '/users/{id}')
  @summary('get user by id')
  @path([{
    name: 'id',
    required: true,
    type: 'string',
  }])
  static async getUser(ctx) {
    const { id } = ctx.params;
    const user = await User.findById(id);
    ctx.body = { user };
  }

  @request('post', '/users')
  @testTag
  @body([{
    name: 'data',
    description: 'example',
    schema: userSchema,
  }])
  static async postUser(ctx) {
    const body = ctx.request.body;
    ctx.body = { result: body };
  }

  // normal methods without @request decorator
  static async temp(ctx) {
    ctx.body = { result: 'success' };
  }
}
```

runing the project and it will generate docs through swagger ui

![image.png](http://upload-images.jianshu.io/upload_images/2563527-4b6ed895183a0055.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## License

 © MIT


[npm-url]: https://npmjs.org/package/koa-swagger-decorator
