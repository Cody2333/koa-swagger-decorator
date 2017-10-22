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

#### first wrapper the koa-router object

```
// router.js
import Router from 'koa-router';

import Test from './test';

import { wrapper } from 'koa-swagger-decorator';

const router = new Router();

wrapper(router);

// open /swagger-html to show the swagger ui page
// open /swagger-json to show the swagger json data
router.swagger({ title: 'SWAGGER API DOC', description: 'API DOC', version: '1.0.0' });

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
  gender: { type: 'string', required: false, example: '男' },
  groups: {
    type: 'array',
    required: true,
    items: { type: 'string', example: '组1' }
  }
};

export default class Test {
  @request('get', '/users')
  @summary('获取用户列表')
  @testTag
  @query({
    type: { type: 'number', required: true, default: 1, description: '筛选的种类' }
  })
  static async getUsers(ctx) {
    const users = await User.findAll();
    ctx.body = { users };
  }

  @request('get', '/users/{id}')
  @summary('根据id获取用户信息')
  @testTag
  @path({
    id: { type: 'number', required: true, default: 1, description: '对应用户 id' }
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


```



##### runing the project and it will generate docs through swagger ui

![image.png](http://upload-images.jianshu.io/upload_images/2563527-4b6ed895183a0055.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## License

 © MIT


[npm-url]: https://npmjs.org/package/koa-swagger-decorator
