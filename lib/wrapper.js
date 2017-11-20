import _ from 'lodash';
import validate from './validate';
import { swaggerHTML } from './swaggerHTML';
import { init } from './swaggerTemplate';
import { apiObjects } from './index';

/**
 * allowed http methods
 */
const reqMethods = ['get', 'post', 'put', 'patch', 'delete'];

/**
 * swagger 和 koa 中 定义url中变量的方式不同，将 {id} 转换为 :id 的形式
 * @param {String} path
 */
const convertPath = (path) => {
  const re = new RegExp('{(.*?)}', 'g');
  return path.replace(re, ':$1');
};

const validateMiddleware = (parameters) => async (ctx, next) => {
  if (!parameters) {
    await next();
    return;
  }

  if (parameters.query) {
    ctx.validatedQuery = validate(ctx.request.query, parameters.query);
  }
  if (parameters.path) {
    ctx.validatedParams = validate(ctx.params, parameters.path);
  }
  if (parameters.body) {
    ctx.validatedBody = validate(ctx.request.body, parameters.body);
  }
  await next();
};

const getPath = (prefix, path) => `${prefix}${path}`;
/**
 * 构建swagger的json
 */
const buildSwaggerJson = (options, apiObjects) => {
  const { title, description, version, prefix = '', definitions = {} } = options || {};
  const swaggerJSON = init(title, description, version, definitions);
  _.chain(apiObjects).map((value) => {
    if (!Object.keys(value).includes('request')) throw new Error('缺少 request 字段');

    const { method } = value.request;
    let { path } = value.request;
    path = getPath(prefix, path); // 根据前缀补全path
    const summary = value.summary ? value.summary : '';
    const description = value.description ? value.description : summary;
    const responses = value.responses ? value.responses : { 200: { description: 'success' } };
    const {
      query = [],
      path: pathParams = [],
      body = [], tags,
      formData = [],
      security,
    } = value;

    const parameters = [...pathParams, ...query, ...formData, ...body];

    // 如果不存在该path对象，首先初始化
    if (!swaggerJSON.paths[path]) swaggerJSON.paths[path] = {};

    // add content type [multipart/form-data] to support file upload
    const consumes = formData.length > 0 ? ['multipart/form-data'] : undefined;

    swaggerJSON.paths[path][method] = { consumes, summary, description, parameters, responses, tags, security };

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
    const { swaggerJsonEndpoint = '/swagger-json', swaggerHtmlEndpoint = '/swagger-html', prefix = '' } = options;

    // 设置swagger路由
    router.get(swaggerJsonEndpoint, async (ctx) => {
      ctx.body = buildSwaggerJson(options, apiObjects);
    });
    router.get(swaggerHtmlEndpoint, async (ctx) => {
      ctx.body = swaggerHTML(`${prefix}${swaggerJsonEndpoint}`);
    });
  };
  router.map = (StaticClass) => {
    const methods = Object.getOwnPropertyNames(StaticClass);

    // 移除无用的属性 constructor, length, name
    _.pull(methods, 'name', 'constructor', 'length', 'prototype');

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
      const { path, method } = StaticClass[item];
      let { middlewares = [] } = StaticClass[item];
      if (typeof middlewares === 'function') middlewares = [middlewares];
      if (!Array.isArray(middlewares)) throw new Error('middlewares params must be an array or function');
      for (const item of middlewares) {
        if (typeof item !== 'function') throw new Error('item in middlewares must be a function');
      }
      if (!reqMethods.includes(method)) throw new Error(`illegal API: ${method} ${path} at [${item}]`);
      const chain = [`${convertPath(path)}`,
      validateMiddleware(StaticClass[item].parameters),
      ...middlewares,
      StaticClass[item]];
      router[method](...chain);
    });
  };
};

export { wrapper };
