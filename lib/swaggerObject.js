
/**
 * used for building swagger docs object
 */
class SwaggerObject {
  constructor() {
    this.data = {};
  }
  add(target, name, content) {
    const key = `${target.name}-${name}`;
    if (!this.data[key]) this.data[key] = {};
    Object.assign(this.data[key], content);
  }
}

const swaggerObject = new SwaggerObject();

export default swaggerObject;
