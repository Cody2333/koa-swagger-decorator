'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapper = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _swaggerHTML = require('./swaggerHTML');

var _swaggerTemplate = require('./swaggerTemplate');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * 允许的http请求方法
 */
const reqMethods = ['get', 'post', 'put', 'delete'];

/**
 * swagger 和 koa 中 定义url中变量的方式不同，将 {id} 转换为 :id 的形式
 * @param {String} path
 */
const convertPath = path => {
  const re = new RegExp('{(.*?)}', 'g');
  return path.replace(re, ':$1');
};

const validateMiddleware = parameters => (() => {
  var _ref = _asyncToGenerator(function* (ctx, next) {
    if (!parameters) {
      yield next();
      return;
    }

    if (parameters.query) {
      ctx.validatedQuery = (0, _validate2.default)(ctx.request.query, parameters.query);
    }
    if (parameters.path) {
      ctx.validatedParams = (0, _validate2.default)(ctx.params, parameters.path);
    }
    if (parameters.body) {
      ctx.validatedBody = (0, _validate2.default)(ctx.request.body, parameters.body);
    }
    yield next();
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

/**
 * 构建swagger的json
 */
const buildSwaggerJson = options => {
  var _ref2 = options || {};

  const title = _ref2.title,
        description = _ref2.description,
        version = _ref2.version;

  const swaggerJSON = (0, _swaggerTemplate.init)(title, description, version);
  _lodash2.default.chain(_index.apiObjects).map(value => {
    if (!Object.keys(value).includes('request')) throw new Error('缺少 request 字段');

    var _value$request = value.request;
    const path = _value$request.path,
          method = _value$request.method;

    const security = value.security;
    const summary = value.summary ? value.summary : '';
    const description = value.description ? value.description : summary;
    const responses = { 200: { description: '成功' } };

    var _value$query = value.query;
    const query = _value$query === undefined ? [] : _value$query;
    var _value$path = value.path;
    const pathParams = _value$path === undefined ? [] : _value$path;
    var _value$body = value.body;
    const body = _value$body === undefined ? [] : _value$body,
          tags = value.tags;

    const parameters = [...pathParams, ...query, ...body];

    // 如果不存在该path对象，首先初始化
    if (!swaggerJSON.paths[path]) swaggerJSON.paths[path] = {};

    swaggerJSON.paths[path][method] = { summary, description, parameters, responses, tags, security };

    return null;
  }).value();
  return swaggerJSON;
};

/**
 * 封装router对象，添加map方法用途遍历静态类中的方法
 * @param {Object} router
 */
const wrapper = router => {
  router.swagger = options => {
    // 设置swagger路由
    router.get('/swagger-json', (() => {
      var _ref3 = _asyncToGenerator(function* (ctx) {
        ctx.body = buildSwaggerJson(options);
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })());
    router.get('/swagger-html', (() => {
      var _ref4 = _asyncToGenerator(function* (ctx) {
        ctx.body = (0, _swaggerHTML.swaggerHTML)('/swagger-json');
      });

      return function (_x4) {
        return _ref4.apply(this, arguments);
      };
    })());
  };
  router.map = StaticClass => {
    const methods = Object.getOwnPropertyNames(StaticClass);

    // 移除无用的属性 constructor, length, name
    _lodash2.default.pull(methods, 'name', 'constructor', 'length', 'prototype');

    // 遍历该类中的所有方法
    methods
    // 过滤没有@request注解的方法
    .filter(item => {
      var _StaticClass$item = StaticClass[item];
      const path = _StaticClass$item.path,
            method = _StaticClass$item.method;

      if (!path && !method) return false;
      return true;
    })
    // 遍历添加路由
    .forEach(item => {
      const path = StaticClass[item].path;

      const method = (0, _lodash2.default)(StaticClass[item].method).toLower();
      if (!reqMethods.includes(method)) throw new Error(`illegal API: ${method} ${path} at [${item}]`);
      router[method](`${convertPath(path)}`, validateMiddleware(StaticClass[item].parameters), StaticClass[item]);
    });
  };
};

exports.wrapper = wrapper;