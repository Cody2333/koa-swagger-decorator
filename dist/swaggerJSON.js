'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.swaggerJSON = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _swaggerTemplate = require('./swaggerTemplate');

var _swaggerTemplate2 = _interopRequireDefault(_swaggerTemplate);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * build swagger json from apiObjects
 */
const swaggerJSON = (options = {}, apiObjects) => {
  const {
    title,
    description,
    version,
    prefix = '',
    swaggerOptions = {}
  } = options;
  const swaggerJSON = (0, _swaggerTemplate2.default)(title, description, version, swaggerOptions);

  _lodash2.default.chain(apiObjects).forEach(value => {
    if (!Object.keys(value).includes('request')) {
      throw new Error('missing [request] field');
    }

    const { method } = value.request;
    let { path } = value.request;
    path = (0, _utils.getPath)(prefix, path); // 根据前缀补全path
    const summary = value.summary ? value.summary : '';
    const description = value.description ? value.description : summary;
    const responses = value.responses ? value.responses : {
      200: {
        description: 'success'
      }
    };
    const {
      query = [],
      path: pathParams = [],
      body = [],
      tags,
      formData = [],
      security
    } = value;

    const parameters = [...pathParams, ...query, ...formData, ...body];

    // init path object first
    if (!swaggerJSON.paths[path]) {
      swaggerJSON.paths[path] = {};
    }

    // add content type [multipart/form-data] to support file upload
    const consumes = formData.length > 0 ? ['multipart/form-data'] : undefined;

    swaggerJSON.paths[path][method] = {
      consumes,
      summary,
      description,
      parameters,
      responses,
      tags,
      security
    };
  }).value();
  return swaggerJSON;
};

exports.default = swaggerJSON;
exports.swaggerJSON = swaggerJSON;