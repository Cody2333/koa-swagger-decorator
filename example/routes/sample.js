import multer from 'koa-multer';
import _path from 'path';
import Doc, { description } from '../../lib'; // 2 import style avaliable
import config from '../config';

const {
  request, summary, query, tags, formData, middlewares, responses
} = Doc;


function getFileUrl(filename) {
  return `${config.baseUrl}/file/${filename}`;
}
const tag = tags(['Sample']);

const storage = multer.diskStorage({
  destination: _path.resolve('file/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });
export default class SampleRouter {
  @request('post', '/sample')
  @summary('showing upload files example using koa-multer')
  @description('exampling [formdata] and [middlewares] decorators')
  @tag
  @formData({
    file: { type: 'file', required: 'true', description: 'upload file, get url' }
  })
  @middlewares([upload.single('file')])
  @query({
    page: {
      type: 'number', default: 1, required: false, description: 'page number'
    },
    limit: {
      type: 'number', default: 10, required: false, description: 'return item number limit'
    }
  })
  @responses({
    200:
    { description: 'file upload success' },
    500:
    { description: 'something wrong about server' }
  })
  static async upload(ctx) {
    const { file } = ctx.req;
    file.url = getFileUrl(file.filename);
    ctx.body = { result: file };
  }
}
