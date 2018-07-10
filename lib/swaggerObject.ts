/**
 * used for building swagger docs object
 */
import is from 'is-type-of';
import _ from 'ramda';
import { reservedMethodNames } from './utils';

class SwaggerObject {

  data: any;

  constructor() {
    this.data = {};
  }
  add(target, name, content) {
    if (!is.object(content)) {
      throw new Error('illegal params [content] for SwaggerObject.add');
    }
    const key = `${target.name}-${name}`;
    if (!this.data[key]) this.data[key] = {};

    // merge class decorator and method decorator if it is an array
    // eg. query parameters, tag paramemters
    Object.keys(content).forEach((k) => {
      if (is.array(this.data[key][k])) {
        this.data[key][k] = [...this.data[key][k], ...content[k]];
        if (this.data[key][k].length > 0) {
          if (is.object(this.data[key][k][0])) {
            // 避免重名的query导致的异常
            this.data[key][k] = _.uniqBy((o: {name: string}) => o.name, this.data[key][k]);
          } else {
            this.data[key][k] = _.uniq(this.data[key][k]);
          }
        }
      } else {
        Object.assign(this.data[key], { [k]: content[k] });
      }
    });
  }

  // only add to methods with a @request decorator
  addMulti(target, content, filters = ['ALL']) {
    const methods = Object.getOwnPropertyNames(target).filter(method => !reservedMethodNames.includes(method));
    methods.forEach((name) => {
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
