import Router from 'koa-router';
import _fs from 'fs';
import _path from 'path';
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
 * read all files in the dir
 * @param {String} dir
 * @param {Array} result
 * @param {Boolean} recursive
 * @returns {Array} an array containing file url
 */
const readSync = (dir, result = [], recursive = false) => {
  const files = _fs.readdirSync(dir);
  files.forEach((filename) => {
    const filedir = _path.join(dir, filename);
    const stat = _fs.statSync(filedir);
    if (stat.isFile()) result.push(filedir);
    if (recursive && stat.isDirectory()) readSync(filedir, result, true);
  });
  return result;
};

export { convertPath, getPath, isSwaggerRouter, readSync };
