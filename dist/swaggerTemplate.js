'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * swagger的初始化模板
 * @param {String} title
 * @param {String} description
 * @param {String} version
 */

const init = (title = 'API DOC', description = 'API DOC', version = '1.0.0') => ({
  info: { title, description, version },
  definitions: {},
  paths: {},
  responses: {},
  swagger: '2.0',
  tags: []
});

exports.init = init;