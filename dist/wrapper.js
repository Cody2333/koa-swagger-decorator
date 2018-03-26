'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _swaggerHTML = require('./swaggerHTML');

var _swaggerJSON = require('./swaggerJSON');

var _index = require('./index');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * allowed http methods
 */
const reqMethods = ['get', 'post', 'put', 'patch', 'delete'];

/**
 * middlewara for validating [query, path, body] params
 * @param {Object} parameters
 */
const validator = parameters => async (ctx, next) => {
  if (!parameters) {
    await next();
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
  await next();
};

/**
 * add [ router.map ] and [ router.swagger ] for router object
 * @param {Object} router
 */

exports.default = router => {
  router.swagger = options => {
    const {
      swaggerJsonEndpoint = '/swagger-json',
      swaggerHtmlEndpoint = '/swagger-html',
      prefix = ''
    } = options;

    // setup swagger router
    router.get(swaggerJsonEndpoint, async ctx => {
      ctx.body = (0, _swaggerJSON.swaggerJSON)(options, _index.apiObjects);
    });
    router.get(swaggerHtmlEndpoint, async ctx => {
      ctx.body = (0, _swaggerHTML.swaggerHTML)((0, _utils.getPath)(prefix, swaggerJsonEndpoint));
    });
  };
  router.map = StaticClass => {
    if (!(0, _utils.isSwaggerRouter)(StaticClass)) return;
    const methods = Object.getOwnPropertyNames(StaticClass);

    // remove useless field in class object:  constructor, length, name, prototype
    _lodash2.default.pull(methods, 'name', 'constructor', 'length', 'prototype');
    // map all method in methods
    methods
    // filter methods withour @request decorator
    .filter(item => {
      const { path, method } = StaticClass[item];
      if (!path && !method) {
        return false;
      }
      return true;
    })
    // add router
    .forEach(item => {
      const { path, method } = StaticClass[item];
      let {
        middlewares = []
      } = StaticClass[item];
      if (typeof middlewares === 'function') {
        middlewares = [middlewares];
      }
      if (!Array.isArray(middlewares)) {
        throw new Error('middlewares params must be an array or function');
      }
      middlewares.forEach(item => {
        if (typeof item !== 'function') {
          throw new Error('item in middlewares must be a function');
        }
      });
      if (!reqMethods.includes(method)) {
        throw new Error(`illegal API: ${method} ${path} at [${item}]`);
      }
      const chain = [`${(0, _utils.convertPath)(path)}`, validator(StaticClass[item].parameters), ...middlewares, StaticClass[item]];
      router[method](...chain);
    });
  };

  router.mapDir = (dir, options = {}) => {
    const { recursive = false } = options;
    const filenames = (0, _utils.readSync)(dir, [], recursive);
    /* eslint-disable*/
    const classes = filenames.map(filename => require(filename));
    /* eslint-disable*/
    classes.map(c => c.default).forEach(c => {
      router.map(c);
    });
  };
};