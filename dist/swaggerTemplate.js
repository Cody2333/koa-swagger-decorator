'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * swagger的初始化模板, definitions 和 securityDefinitions参数一般默认即可，需要修改请参考open api 文档
 * @param {String} title
 * @param {String} description
 * @param {String} version
 * @param {Object} definitions
 * @param {Object} securityDefinitions
 */

const init = (title = 'API DOC', description = 'API DOC', version = '1.0.0', definitions = {}, securityDefinitions = {
  ApiKeyAuth: {
    type: 'apiKey',
    in: 'header',
    name: 'Authorization'
  }
}) => ({
  info: { title, description, version },
  definitions,
  securityDefinitions,
  paths: {},
  responses: {},
  swagger: '2.0',
  tags: []
});

exports.init = init;