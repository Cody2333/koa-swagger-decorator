'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

let SwaggerObject = class SwaggerObject {
  constructor() {
    this.data = {};
  }
  add(target, name, content) {
    const key = `${target.name}-${name}`;
    if (!this.data[key]) this.data[key] = {};
    Object.assign(this.data[key], content);
  }

  addMulti(target, content) {
    const methods = Object.getOwnPropertyNames(target).filter(method => !_utils.reservedMethodNames.includes(method));
    methods.forEach(name => {
      this.add(target, name, content);
    });
  }
}; /**
    * used for building swagger docs object
    */

const swaggerObject = new SwaggerObject();

exports.default = swaggerObject;