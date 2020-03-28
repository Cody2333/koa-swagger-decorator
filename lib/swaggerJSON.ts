import init from './swaggerTemplate';
import { getPath, sortObject } from './utils';
import { Dictionary } from 'ramda';
/**
 * build swagger json from apiObjects
 */
const swaggerJSON = (options: {[name: string]: any} = {}, apiObjects: any) => {
  const {
    title,
    description,
    version,
    prefix = '',
    swaggerOptions = {}
  } = options;
  const swaggerJSON: any = init(title, description, version, swaggerOptions);
  const paths: Dictionary<{[method: string]: any}> = {};
  Object.keys(apiObjects).forEach((key) => {
    const value = apiObjects[key];
    if (!Object.keys(value).includes('request')) {
      return;
    }

    const { method } = value.request;
    let { path } = value.request;
    path = getPath(prefix, value.prefix ? `${value.prefix}${path}` : path); // 根据前缀补全path
    const summary = value.summary || '';
    const description = value.description || summary;
    const responses = value.responses || {
      200: { description: 'success' }
    };
    const {
      query = [],
      header = [],
      path: pathParams = [],
      body = [],
      order,
      tags,
      formData = [],
      security,
      deprecated
    } = value;

    const parameters = [...pathParams, ...query, ...header, ...formData, ...body];

    // init path object first
    if (!paths[path]) {
      paths[path] = {};
    }

    // add content type [multipart/form-data] to support file upload
    const consumes = formData.length > 0 ? ['multipart/form-data'] : undefined;

    paths[path][method] = {
      consumes,
      summary,
      description,
      parameters,
      responses,
      tags,
      security,
      deprecated
    };
    if (!paths[path]._order) {
      paths[path]._order = order;
    }
  });
  swaggerJSON.paths = sortObject(paths, (path, length) => path._order || length, (path) => {
    const { _order, ...restOfPathData} = path;
    return restOfPathData;
  });
  return swaggerJSON;
};

export default swaggerJSON;
export { swaggerJSON };
