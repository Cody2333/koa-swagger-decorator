'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwaggerRouter = exports.wrapper = undefined;

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _isTypeOf = require('is-type-of');

var _isTypeOf2 = _interopRequireDefault(_isTypeOf);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _swaggerHTML = require('./swaggerHTML');

var _swaggerJSON = require('./swaggerJSON');

var _swaggerObject = require('./swaggerObject');

var _swaggerObject2 = _interopRequireDefault(_swaggerObject);

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

const handleSwagger = (router, options) => {
  const {
    swaggerJsonEndpoint = '/swagger-json',
    swaggerHtmlEndpoint = '/swagger-html',
    prefix = ''
  } = options;

  // setup swagger router
  router.get(swaggerJsonEndpoint, async ctx => {
    ctx.body = (0, _swaggerJSON.swaggerJSON)(options, _swaggerObject2.default.data);
  });
  router.get(swaggerHtmlEndpoint, async ctx => {
    ctx.body = (0, _swaggerHTML.swaggerHTML)((0, _utils.getPath)(prefix, swaggerJsonEndpoint));
  });
};

const handleMap = (router, SwaggerClass, { doValidation = true }) => {
  if (!(0, _utils.isSwaggerRouter)(SwaggerClass)) return;
  const middlewaresAll = SwaggerClass.middlewares || [];
  // remove useless field in class object:  constructor, length, name, prototype
  const methods = Object.getOwnPropertyNames(SwaggerClass).filter(method => !_utils.reservedMethodNames.includes(method));
  // map all method in methods
  methods
  // filter methods withour @request decorator
  .filter(item => {
    const { path, method } = SwaggerClass[item];
    if (!path && !method) {
      return false;
    }
    return true;
  })
  // add router
  .forEach(item => {
    const { path, method } = SwaggerClass[item];
    let { middlewares = [] } = SwaggerClass[item];
    if (_isTypeOf2.default.function(middlewares)) {
      middlewares = [middlewares];
    }
    if (!_isTypeOf2.default.array(middlewares)) {
      throw new Error('middlewares params must be an array or function');
    }
    middlewares.forEach(item => {
      if (!_isTypeOf2.default.function(item)) {
        throw new Error('item in middlewares must be a function');
      }
    });
    if (!reqMethods.includes(method)) {
      throw new Error(`illegal API: ${method} ${path} at [${item}]`);
    }
    const chain = [`${(0, _utils.convertPath)(path)}`, doValidation ? validator(SwaggerClass[item].parameters) : async (ctx, next) => {
      await next();
    }, ...middlewaresAll, ...middlewares, SwaggerClass[item]];
    router[method](...chain);
  });
};

const handleMapDir = (router, dir, options) => {
  (0, _utils.loadSwaggerClasses)(dir, options).forEach(c => {
    router.map(c, options);
  });
};

const wrapper = router => {
  router.swagger = (options = {}) => {
    handleSwagger(router, options);
  };
  router.map = (SwaggerClass, options = {}) => {
    handleMap(router, SwaggerClass, options);
  };

  router.mapDir = (dir, options = {}) => {
    handleMapDir(router, dir, options);
  };
};

let SwaggerRouter = class SwaggerRouter extends _koaRouter2.default {
  swagger(options) {
    handleSwagger(this, options);
  }

  map(SwaggerClass, options) {
    handleMap(this, SwaggerClass, options);
  }

  mapDir(dir, options = {}) {
    handleMapDir(this, dir, options);
  }
};
exports.wrapper = wrapper;
exports.SwaggerRouter = SwaggerRouter;