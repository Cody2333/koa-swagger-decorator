'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reservedMethodNames = exports.loadSwaggerClasses = exports.loadClass = exports.getFilepaths = exports.isSwaggerRouter = exports.getPath = exports.convertPath = undefined;

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

var _globby = require('globby');

var _globby2 = _interopRequireDefault(_globby);

var _isTypeOf = require('is-type-of');

var _isTypeOf2 = _interopRequireDefault(_isTypeOf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * eg. /api/{id} -> /api/:id
 * @param {String} path
 */
const convertPath = path => {
  const re = new RegExp('{(.*?)}', 'g');
  return path.replace(re, ':$1');
};

const getPath = (prefix, path) => `${prefix}${path}`.replace('//', '/');

const reservedMethodNames = ['middlewares', 'name', 'constructor', 'length', 'prototype', 'parameters'];
/**
 * check if an object is an instance of SwaggerRouter
 * @param {Object} o
 */
const isSwaggerRouter = o => {
  if (!o || o instanceof _koaRouter2.default) {
    return false;
  }
  return true;
};

/**
 * read all js files in the dir
 * @param {String} dir
 * @param {Boolean} recursive
 * @returns {Array} an array containing file url
 */
const getFilepaths = (dir, recursive = true) => {
  const paths = recursive ? _globby2.default.sync(['**/*.js'], { cwd: dir }) : _globby2.default.sync(['*.js'], { cwd: dir });
  return paths.map(path => _path3.default.join(dir, path));
};

const loadModule = filepath => {
  const obj = require(filepath); // eslint-disable-line global-require
  if (!obj) return obj;
  // it's es module
  if (obj.__esModule) return 'default' in obj ? obj.default : obj;
  return obj;
};

const loadClass = filepath => {
  const cls = loadModule(filepath);
  if (_isTypeOf2.default.class(cls)) return cls;
  return false;
};

const loadSwaggerClasses = (dir = '', options = {}) => {
  dir = _path3.default.resolve(dir);
  const { recursive = true } = options;
  return getFilepaths(dir, recursive).map(filepath => loadClass(filepath)).filter(cls => cls);
};
exports.convertPath = convertPath;
exports.getPath = getPath;
exports.isSwaggerRouter = isSwaggerRouter;
exports.getFilepaths = getFilepaths;
exports.loadClass = loadClass;
exports.loadSwaggerClasses = loadSwaggerClasses;
exports.reservedMethodNames = reservedMethodNames;