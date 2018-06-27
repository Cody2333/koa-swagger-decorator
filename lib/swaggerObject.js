/**
 * used for building swagger docs object
 */
import { reservedMethodNames } from './utils';

class SwaggerObject {
  constructor() {
    this.data = {};
  }
  add(target, name, content) {
    const key = `${target.name}-${name}`;
    if (!this.data[key]) this.data[key] = {};
    Object.assign(this.data[key], content);
  }

  addMulti(target, content) {
    const methods = Object.getOwnPropertyNames(target).filter(method => !reservedMethodNames.includes(method));
    methods.forEach((name) => {
      this.add(target, name, content);
    });
  }
}

const swaggerObject = new SwaggerObject();

export default swaggerObject;
