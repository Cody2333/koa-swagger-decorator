import _path from 'path';
import globby from 'globby';
import is from 'is-type-of';

// eg. /api/{id} -> /api/:id
const convertPath = (path: string) => {
  const re = new RegExp('{(.*?)}', 'g');
  return path.replace(re, ':$1');
};

const getPath = (prefix: string, path: string) =>
  `${prefix}${path}`.replace('//', '/');

const reservedMethodNames = [
  'middlewares',
  'name',
  'constructor',
  'length',
  'prototype',
  'parameters'
];

enum allowedMethods {
  GET= 'get',
  POST= 'post',
  PUT= 'put',
  PATCH= 'patch',
  DELETE= 'delete'
}

const getFilepaths = (dir: string, recursive: boolean = true) => {
  const paths = recursive
    ? globby.sync(['**/*.js', '**/*.ts'], { cwd: dir })
    : globby.sync(['*.js', '*.ts'], { cwd: dir });
  return paths.map(path => _path.join(dir, path));
};

const loadModule = (filepath: string) => {
  const obj = require(filepath);
  if (!obj) return obj;
  // it's es module
  if (obj.__esModule) return 'default' in obj ? obj.default : obj;
  return obj;
};

const loadClass = (filepath: string) => {
  const cls = loadModule(filepath);
  if (is.class(cls)) return cls;
  return false;
};

const loadSwaggerClasses = (dir: string = '', options: {recursive?: boolean} = {}) => {
  dir = _path.resolve(dir);
  const { recursive = true } = options;
  return getFilepaths(dir, recursive)
    .map(filepath => loadClass(filepath))
    .filter(cls => cls);
};
export {
  convertPath,
  getPath,
  getFilepaths,
  loadClass,
  loadSwaggerClasses,
  reservedMethodNames,
  allowedMethods,
};
