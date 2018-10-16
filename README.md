# koa-swagger-decorator

> using decorator to auto generate swagger json docs

[![build status][travis-image]][travis-url]
[![npm](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/koa-swagger-decorator)

## Installation

```bash
npm install koa-swagger-decorator
```

## Introduction

### Koa Swagger Decorator

using decorator to auto generate swagger json docs add support validation for swagger definitions

based on [Swagger OpenAPI Specification 2.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)

support both javascript (babel required) and typescript

## Example

```bash
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
- babel support for decorator (or using typescript)

```bash
// add [transform-decorators-legacy] to .babelrc if using js

npm install --save-dev babel-plugin-transform-decorators-legacy

{
  "presets": [
    ["env", {"targets": {"node": "current"}}]
  ],
  "plugins": ["transform-decorators-legacy"]
}
```

### Detail

for more detail please take a look at the [example koa server](https://github.com/Cody2333/koa-swagger-decorator/tree/master/example)

#### first wrapper the koa-router object

```javascript
// router.js
import Router from 'koa-router'

import Test from './test'

import { SwaggerRouter } from 'koa-swagger-decorator'

const router = new SwaggerRouter() // extends from koa-router

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
        name: 'api_key',
      },
    },
  },
  // [optional] additional configuration for config how to show swagger view
  swaggerConfiguration: {
    display: {
      defaultModelsExpandDepth: 4, // The default expansion depth for models (set to -1 completely hide the models).
      defaultModelExpandDepth: 3, // The default expansion depth for the model on the model-example section.
      docExpansion: 'list', // Controls the default expansion setting for the operations and tags. 
      defaultModelRendering: 'model' // Controls how the model is shown when the API is first rendered. 
    }
  }
})
// map all static methods at Test class for router
// router.map(Test);

// mapDir will scan the input dir, and automatically call router.map to all Router Class
router.mapDir(_path.resolve(__dirname), {
  // default: true. To recursively scan the dir to make router. If false, will not scan subroutes dir
  // recursive: true,
  // default: true, if true, you can call ctx.validatedBody[Query|Params] to get validated data.
  // doValidation: true,
})
```

#### using decorator to make api definition

```javascript
// test.js

import User from 'models/user'
import { request, summary, query, path, body, tags } from 'koa-swagger-decorator'

const testTag = tags(['test'])

const userSchema = {
  name: { type: 'string', required: true },
  gender: { type: 'string', required: false, example: 'male' },
  groups: {
    type: 'array',
    required: true,
    items: { type: 'string', example: 'group1' }, // item's type will also be validated
  },
}

export default class Test {
  @request('get', '/users')
  @summary('get user list')
  @testTag
  @query({
    type: { type: 'number', required: true, default: 1, description: 'type' },
  })
  static async getUsers(ctx) {
    const users = await User.findAll()
    ctx.body = { users }
  }

  @request('get', '/users/{id}')
  @summary('get user info by id')
  @testTag
  @path({
    id: { type: 'number', required: true, default: 1, description: 'id' },
  })
  static async getUser(ctx) {
    const { id } = ctx.validatedParams
    const user = await User.findById(id)
    ctx.body = { user }
  }

  @request('post', '/users')
  @testTag
  @body(userSchema)
  static async postUser(ctx) {
    // const body = ctx.request.body;
    const body = ctx.validatedBody
    ctx.body = { result: body }
  }

  static async temp(ctx) {
    ctx.body = { result: 'success' }
  }
}
```

#### avaliable annotations

- tags
- query
- path
- body
- formData
- middlewares
- summary
- description
- responses
- deprecated

#### class annotations

- tagsAll
- responsesAll
- middlewaresAll
- deprecatedAll
- queryAll

``` javascript
request // @request('POST', '/users')

tags // @tags(['example'])
query // @query({limit: {type: 'number', required: true, default: 10, description: 'desc'}})

path // @path({limit: {type: 'number', required: true, default: 10, description: 'desc'}})

body // @body({groups: {type: 'array', required: true, items: { type: 'string', example: 'group1' }}})

formData // @formData({file: {type: 'file', required: true, description: 'file content'}})

middlewares
// support koa middlewares.
// eg. @middlewares([func1,func2])

summary // @summary('api summary')

description // @description('api description')

responses
// @responses({ 200: { description: 'success'}, 400: { description: 'error'}})
// responses is optional

deprecated // @deprecated

@tagsAll(['A', 'B'])
@deprecatedAll
@middlewaresAll([log1, log2]) // add middlewares [log1, log2] to all routers in this class
@queryAll({ limit: { type: 'number', default: 444, required: true } }) // can be merged with @query
export default class SampleRouter {
  ...
}
```

#### validation

support validation type: `string, number, boolean, object, array.`

`properties` in `{type: 'object'}` and `items` in `{type: 'array'}` can alse be validated.

other types eg. `integer` will not be validated, and will return the raw value.

by default, validation is activated and you can call ctx.validatedQuery[Body|Params] to access the validated value.

to turn off validation:

```javascript
router.mapDir(_path.resolve(__dirname), {
  // default: true, if true, you can call ctx.validatedBody[Query|Params] to get validated data.
  doValidation: false,
})
```

##### runing the project and it will generate docs through swagger ui

![image.png](http://upload-images.jianshu.io/upload_images/2563527-4b6ed895183a0055.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## License

© MIT

[npm-url]: https://npmjs.org/package/koa-swagger-decorator
[travis-image]: https://travis-ci.org/Cody2333/koa-swagger-decorator.svg?branch=develop
[travis-url]: https://travis-ci.org/Cody2333/koa-swagger-decorator
