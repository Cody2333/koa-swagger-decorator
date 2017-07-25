import _ from 'lodash';
import validate from './validate';

import { swaggerHTML } from './swaggerHTML';
import { init } from './swaggerTemplate';
import { apiObjects } from './index';

/**
 * 允许的http请求方法
 */
const reqMethods = ['get', 'post', 'put', 'delete'];

/**
 * swagger 和 koa 中 定义url中变量的方式不同，将 {id} 转换为 :id 的形式
 * @param {String} path
 */
const convertPath = (path) => {
  const re = new RegExp('{(.*?)}', 'g');
  return path.replace(re, ':$1');
};

const validateMiddleware = (parameters) => async (ctx, next) => {
  if (parameters.query) {
    ctx.request.query = ctx.query = validate(ctx.request.query, parameters.query);
  }
  if (parameters.path) {
    ctx.request.params = ctx.params = validate(ctx.params, parameters.path);
  }
  if (parameters.body) {
    ctx.request.body = validate(ctx.request.body, parameters.body);
  }
  await next();
};

/**
 * 构建swagger的json
 */
const buildSwaggerJson = (options) => {
  const { title, description, version } = options || {};
  const swaggerJSON = init(title, description, version);
  _.chain(apiObjects).map((value) => {
    if (!Object.keys(value).includes('request')) throw new Error('缺少 request 字段');

    const { path, method } = value.request;
    const summary = value.summary ? value.summary : '';
    const description = value.description ? value.description : summary;
    const responses = { 200: { description: '成功' } };

    const { query = [], path: pathParams = [], body = [], tags } = value;
    const parameters = [...pathParams, ...query, ...body];

    // 如果不存在该path对象，首先初始化
    if (!swaggerJSON.paths[path]) swaggerJSON.paths[path] = {};

    swaggerJSON.paths[path][method] = { summary, description, parameters, responses, tags };

    return null;
  }).value();
  return swaggerJSON;
};

/**
 * 封装router对象，添加map方法用途遍历静态类中的方法
 * @param {Object} router
 */
const wrapper = (router) => {
  router.swagger = (options) => {
    // 设置swagger路由
    router.get('/swagger-json', async (ctx) => {
      ctx.body = buildSwaggerJson(options);
    });
    router.get('/swagger-html', async (ctx) => {
      ctx.body = swaggerHTML('/swagger-json');
    });
  };
  router.map = (StaticClass) => {
    const methods = Object.getOwnPropertyNames(StaticClass);
    // 移除无用的属性 constructor, length, name

    methods.shift();
    methods.shift();
    methods.splice(-1);
    // 遍历该类中的所有方法
    methods
    // 过滤没有@request注解的方法
    .filter(item => {
      const { path, method } = StaticClass[item];
      if (!path && !method) return false;
      return true;
    })
    // 遍历添加路由
    .forEach(item => {
      const { path } = StaticClass[item];
      const method = _(StaticClass[item].method).toLower();
      if (!reqMethods.includes(method)) throw new Error(`illegal API: ${method} ${path} at [${item}]`);
      router[method](
        `${convertPath(path)}`,
        validateMiddleware(StaticClass[item].parameters),
        StaticClass[item]
      );
    });
  };
};

export { wrapper };
