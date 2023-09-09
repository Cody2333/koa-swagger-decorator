# koa-swagger-decorator

> defined your api with simple decorators and generate api docs automatically

这是 koa-swagger-decorator@2 新版本的文档。v2 与 v1 有很大的不同。如果你在找 v1 的文档，访问 [v1.x docs](www.baidu.com)

## 快速开始

koa-swagger-decorator 支持在任意类的方法中添加特定装饰器的形式来定义路由的基本信息，请求体和响应体。并且通过这些装饰器定义完成路由的注册和接口文档的生成。

koa-swagger-decorator 的处理流程包括 4 个阶段：
1. 路由信息收集
2. 路由信息解析
3. 路由注册
4. 注册 swagger 路由，通过 SwaggerUI 托管接口文档站
最终实现用户为任意普通函数添加装饰器定义后即可一站式完成类型完备的接口定义，路由注册，接口文档生成的能力

简单的说，它完成了两件事：
1. 项目启动时执行所有 koa-swagger-decorator 中定义的装饰器函数，收集项目的路由信息
2. 解析收集到的路由信息，将路由注册到 koa app 上
3. 解析收集到的路由信息，转换为 OpenAPI v3 格式的 JSON 结构

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v0.8.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
