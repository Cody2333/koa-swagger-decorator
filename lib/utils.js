import Router from 'koa-router';
import _path from 'path';
import globby from 'globby';
import is from 'is-type-of';
/**
 * eg. /api/{id} -> /api/:id
 * @param {String} path
 */
const convertPath = (path) => {
  const re = new RegExp('{(.*?)}', 'g');
  return path.replace(re, ':$1');
};

const getPath = (prefix, path) => `${prefix}${path}`.replace('//', '/');


/**
 * check if an object is an instance of SwaggerRouter
 * @param {Object} o
 */
const isSwaggerRouter = (o) => {
  if (!o || o instanceof Router) {
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
  const paths = recursive ? globby.sync(['**/*.js'], { cwd: dir }) : globby.sync(['*.js'], { cwd: dir });
  return paths.map(path => _path.join(dir, path));
};

const loadModule = (filepath) => {
  const obj = require(filepath);// eslint-disable-line global-require
  if (!obj) return obj;
  // it's es module
  if (obj.__esModule) return 'default' in obj ? obj.default : obj;
  return obj;
};

const loadClass = (filepath) => {
  const cls = loadModule(filepath);
  if (is.class(cls)) return cls;
  return false;
};

const loadSwaggerClasses = (dir = '', options = {}) => {
  dir = _path.resolve(dir);
  const { recursive = true } = options;
  return getFilepaths(dir, recursive)
    .map(filepath => loadClass(filepath))
    .filter(cls => cls);
};
export { convertPath, getPath, isSwaggerRouter, getFilepaths, loadClass, loadSwaggerClasses };
