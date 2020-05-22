import init from './swaggerTemplate';
import { getPath } from './utils';
import {fixBodySchema} from "./utils";

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
      path: pathParams = [],
      body = [],
      tags,
      formData = [],
      security,
      deprecated
    } = value;

    let fixedBody = []
    if(body&&body.length){
      fixedBody = fixBodySchema(JSON.parse(JSON.stringify(body)))||body
    }

    const parameters = [...pathParams, ...query, ...formData, ...fixedBody];

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
      security,
      deprecated
    };
  });
  return swaggerJSON;
};

export default swaggerJSON;
export { swaggerJSON };
