import multer from 'koa-multer';
import _path from 'path';
import Doc, { description } from '../../lib'; // 2 import style avaliable
import config from '../config';

const {
  request,
  summary,
  query,
  tags,
  formData,
  middlewares,
  responses,
  deprecated,
  tagsAll,
  middlewaresAll,
  queryAll,
  deprecatedAll,
  prefix,
} = Doc;

function getFileUrl(filename) {
  return `${config.baseUrl}/temp/${filename}`;
}
const tag = tags(['B']);

const storage = multer.diskStorage({
  destination: _path.resolve('temp/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

const log1 = async (ctx, next) => {
  console.log('log1 middleware called');
  await next();
};

const log2 = async (ctx, next) => {
  console.log('log2 middleware called');
  await next();
};

const log3 = async (ctx, next) => {
  console.log('log3 middleware called');
  await next();
};

@tagsAll(['A'])
@deprecatedAll
@middlewaresAll([log1, log2]) // add middlewares [log1, log2] to all routers in this class
/**
 * queryAll(query, filters) -> default to filters is ['ALL'], you can limit your query to specific methods.
 * if filters = ['GET'], then only request using GET will have query param:[limit]
 */
@queryAll({ limit: { type: 'number', default: 444, required: true } }, ['GET'])
@prefix('/v1')
export default class SampleRouter {
  @request('post', '/sample')
  @summary('showing upload files example using koa-multer')
  @description('exampling [formdata] and [middlewares] decorators')
  @formData({
    file: {
      type: 'file',
      required: 'true',
      description: 'upload file, get url'
    }
  })
  @middlewares([upload.single('file')])
  @query({
    page: {
      type: 'number',
      default: 1,
      required: false,
      description: 'page number'
    },
    myLimit: {
      type: 'number',
      default: 10,
      required: false,
      description: 'return item number limit'
    }
  })
  @responses({
    200: { description: 'file upload success' },
    500: { description: 'something wrong about server' }
  })
  @deprecated
  static async upload(ctx) {
    const { file } = ctx.req;
    file.url = getFileUrl(file.filename);
    ctx.body = { result: file };
  }

  @request('GET', '/enum')
  @summary('example of  enum')
  @description('example of  enum')
  @tag
  @middlewares([log3])
  @query({
    page: {
      type: 'string',
      enum: ['1', '2', '3'],
      description: 'page number'
    }
  })
  @responses({
    200: { description: 'success' },
    500: { description: 'something wrong about server' }
  })
  static async enum(ctx) {
    const { page, limit } = ctx.request.query;
    ctx.body = { result: page, limit };
  }

  static async useless(ctx) {
    console.log(ctx);
  }
}
