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
 * allowed http methods
 */
const reqMethods = ['get', 'post', 'put', 'patch', 'delete'];

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

    const summary = value.summary ? value.summary : '';
    const description = value.description ? value.description : summary;
    const responses = value.responses ? value.responses : { 200: { description: 'success' } };
    var _value$query = value.query;
    const query = _value$query === undefined ? [] : _value$query;
    var _value$path = value.path;
    const pathParams = _value$path === undefined ? [] : _value$path;
    var _value$body = value.body;
    const body = _value$body === undefined ? [] : _value$body,
          tags = value.tags;
    var _value$formData = value.formData;
    const formData = _value$formData === undefined ? [] : _value$formData,
          security = value.security;


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
const wrapper = router => {
  router.swagger = options => {
    var _options$swaggerJsonE = options.swaggerJsonEndpoint;
    const swaggerJsonEndpoint = _options$swaggerJsonE === undefined ? '/swagger-json' : _options$swaggerJsonE;
    var _options$swaggerHtmlE = options.swaggerHtmlEndpoint;
    const swaggerHtmlEndpoint = _options$swaggerHtmlE === undefined ? '/swagger-html' : _options$swaggerHtmlE;

    // 设置swagger路由

    router.get(swaggerJsonEndpoint, (() => {
      var _ref3 = _asyncToGenerator(function* (ctx) {
        ctx.body = buildSwaggerJson(options);
      });

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    })());
    router.get(swaggerHtmlEndpoint, (() => {
      var _ref4 = _asyncToGenerator(function* (ctx) {
        ctx.body = (0, _swaggerHTML.swaggerHTML)(swaggerJsonEndpoint);
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
      var _StaticClass$item2 = StaticClass[item];
      const path = _StaticClass$item2.path,
            method = _StaticClass$item2.method;
      var _StaticClass$item$mid = StaticClass[item].middlewares;
      let middlewares = _StaticClass$item$mid === undefined ? [] : _StaticClass$item$mid;

      if (typeof middlewares === 'function') middlewares = [middlewares];
      if (!Array.isArray(middlewares)) throw new Error('middlewares params must be an array or function');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = middlewares[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          const item = _step.value;

          if (typeof item !== 'function') throw new Error('item in middlewares must be a function');
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!reqMethods.includes(method)) throw new Error(`illegal API: ${method} ${path} at [${item}]`);
      const chain = [`${convertPath(path)}`, validateMiddleware(StaticClass[item].parameters), ...middlewares, StaticClass[item]];
      router[method](...chain);
    });
  };
};

exports.wrapper = wrapper;