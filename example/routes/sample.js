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
  deprecated
} = Doc;

function getFileUrl(filename) {
  return `${config.baseUrl}/temp/${filename}`;
}
const tag = tags(['Sample']);

const storage = multer.diskStorage({
  destination: _path.resolve('temp/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });
export default class SampleRouter {
  @request('post', '/sample')
  @summary('showing upload files example using koa-multer')
  @description('exampling [formdata] and [middlewares] decorators')
  @tag
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
    limit: {
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

  @request('get', '/enum')
  @summary('example of  enum')
  @description('example of  enum')
  @tag
  @middlewares([upload.single('file')])
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
    const { page } = ctx.request.query;
    ctx.body = { result: page };
  }
}
