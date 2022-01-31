/**
 * used for building swagger docs object
 */
import is from 'is-type-of';

import { reservedMethodNames } from './utils';
import { Data } from './types';
import { uniq, uniqBy } from 'ramda';

class SwaggerObject {
  data: Data;

  constructor() {
    this.data = {};
  }
  add(target: any, name: string, content: any) {
    if (!is.object(content)) {
      throw new Error('illegal params [content] for SwaggerObject.add');
    }

    // when using non-static method decorators
    // target will be class.prototype rather than class
    // hack and make target always be class itself
    if (!target.prototype && target.constructor) {
      target = target.constructor;
    }

    const key = `${target.name}-${name}`;
    if (!this.data[key]) this.data[key] = {};

    // merge class decorator and method decorator if it is an array
    // eg. query parameters, tag paramemters
    Object.keys(content).forEach((k) => {
      if (is.array(this.data[key][k])) {
        this.data[key][k] = [...this.data[key][k], ...content[k]];
        if (this.data[key][k].length === 0) return;
        this.data[key][k] = is.object(this.data[key][k][0]) ?
        uniqBy((o: {name: string}) => o.name, this.data[key][k])
        : uniq(this.data[key][k]);
      } else if (is.object(this.data[key][k])) {
        Object.assign(this.data[key][k], content[k]);
      } else {
        Object.assign(this.data[key], { [k]: content[k] });
      }
    });
  }

  // only add to methods with a @request decorator
  addMulti(target: any, content: any, filters = ['ALL']) {
    const staticMethods = Object.getOwnPropertyNames(target)
      .filter(method => !reservedMethodNames.includes(method));
    const methods = Object.getOwnPropertyNames(target.prototype)
      .filter(method => !reservedMethodNames.includes(method));

    [ ...staticMethods, ...methods ].forEach((name) => {
      const key = `${target.name}-${name}`;
      if (!this.data[key] || !this.data[key].request) return;
      filters = filters.map(i => i.toLowerCase());
      if (
        filters.includes('all') ||
        filters.includes(this.data[key].request.method)
      ) {
        this.add(target, name, content);
      }
    });
  }
}

const swaggerObject = new SwaggerObject();

export default swaggerObject;
