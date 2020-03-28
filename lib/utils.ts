import _path from 'path';
import globby from 'globby';
import is from 'is-type-of';
import { Dictionary } from 'ramda';

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
  'parameters',
  'prefix',
];

enum allowedMethods {
  GET= 'get',
  POST= 'post',
  PUT= 'put',
  PATCH= 'patch',
  DELETE= 'delete'
}

const getFilepaths = (dir: string, recursive: boolean = true, ignore: string[] = []) => {
  const ignoreDirs = ignore.map((path => `!${path}`));
  const paths = recursive
    ? globby.sync(['**/*.js', '**/*.ts', ...ignoreDirs], { cwd: dir })
    : globby.sync(['*.js', '*.ts', ...ignoreDirs], { cwd: dir });
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

const loadSwaggerClasses = (dir: string = '', options: {recursive?: boolean; ignore?: string[]} = {}) => {
  dir = _path.resolve(dir);
  const { recursive = true } = options;
  return getFilepaths(dir, recursive, options.ignore)
    .map(filepath => loadClass(filepath))
    .filter(cls => cls);
};

const swaggerKeys = (className: String, methods: [String]) => methods.map(m => `${className}- ${m}`);

/**
 * Sorts an object (dictionary) by value returned by the valSelector function.
 * Note that order is only guaranteed for string keys.
 */
const sortObject = <TValue>(
  obj: Dictionary<TValue>,
  comparisonSelector: (val: TValue, length: number) => number | string,
  callbackFn?: (val: TValue) => TValue,
) => {
  const unsortedKeys = Object.keys(obj);
  const sortedKeys = unsortedKeys.sort((a, b) => (
    comparisonSelector(obj[a], unsortedKeys.length) > comparisonSelector(obj[b], unsortedKeys.length) ? 1 :
      comparisonSelector(obj[a], unsortedKeys.length) < comparisonSelector(obj[b], unsortedKeys.length) ? -1 : 0)
  );

  return sortedKeys.reduce((sorted: Dictionary<TValue>, k) => {
    let value = obj[k];
    if (callbackFn && is.function(callbackFn)) {
      value = callbackFn(value);
    }
    sorted[k] = value;
    return sorted;
  }, {});
};

export {
  convertPath,
  getPath,
  getFilepaths,
  loadClass,
  loadSwaggerClasses,
  reservedMethodNames,
  allowedMethods,
  swaggerKeys,
  sortObject,
};
