"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * used for building swagger docs object
 */
let SwaggerObject = class SwaggerObject {
  constructor() {
    this.data = {};
  }
  add(target, name, content) {
    const key = `${target.name}-${name}`;
    if (!this.data[key]) this.data[key] = {};
    Object.assign(this.data[key], content);
  }
};


const swaggerObject = new SwaggerObject();

exports.default = swaggerObject;