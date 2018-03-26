'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readSync = exports.isSwaggerRouter = exports.getPath = exports.convertPath = undefined;

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _fs2 = require('fs');

var _fs3 = _interopRequireDefault(_fs2);

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

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
 * read all files in the dir
 * @param {String} dir
 * @param {Array} result
 * @param {Boolean} recursive
 * @returns {Array} an array containing file url
 */
const readSync = (dir, result = [], recursive = false) => {
  const files = _fs3.default.readdirSync(dir);
  files.forEach(filename => {
    const filedir = _path3.default.join(dir, filename);
    const stat = _fs3.default.statSync(filedir);
    if (stat.isFile()) result.push(filedir);
    if (recursive && stat.isDirectory()) readSync(filedir, result, true);
  });
  return result;
};

exports.convertPath = convertPath;
exports.getPath = getPath;
exports.isSwaggerRouter = isSwaggerRouter;
exports.readSync = readSync;