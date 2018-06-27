'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isTypeOf = require('is-type-of');

var _isTypeOf2 = _interopRequireDefault(_isTypeOf);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let SwaggerObject = class SwaggerObject {
  constructor() {
    this.data = {};
  }
  add(target, name, content) {
    if (!_isTypeOf2.default.object(content)) {
      throw new Error('illegal params [content] for SwaggerObject.add');
    }
    const key = `${target.name}-${name}`;
    if (!this.data[key]) this.data[key] = {};

    // merge class decorator and method decorator if it is an array
    // eg. query parameters, tag paramemters
    Object.keys(content).forEach(k => {
      if (_isTypeOf2.default.array(this.data[key][k])) {
        this.data[key][k] = [...this.data[key][k], ...content[k]];
        if (this.data[key][k].length > 0) {
          if (_isTypeOf2.default.object(this.data[key][k][0])) {
            // 避免重名的query导致的异常
            this.data[key][k] = _lodash2.default.uniqBy(this.data[key][k], 'name');
          } else {
            this.data[key][k] = _lodash2.default.uniq(this.data[key][k]);
          }
        }
      } else {
        Object.assign(this.data[key], { [k]: content[k] });
      }
    });
  }

  // only add to methods with a @request decorator
  addMulti(target, content, filters = ['ALL']) {
    const methods = Object.getOwnPropertyNames(target).filter(method => !_utils.reservedMethodNames.includes(method));
    methods.forEach(name => {
      const key = `${target.name}-${name}`;
      if (!this.data[key] || !this.data[key].request) return;
      filters = filters.map(i => i.toLowerCase());
      if (filters.includes('all') || filters.includes(this.data[key].request.method)) {
        this.add(target, name, content);
      }
    });
  }
}; /**
    * used for building swagger docs object
    */

const swaggerObject = new SwaggerObject();

exports.default = swaggerObject;