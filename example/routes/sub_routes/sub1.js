import { request, summary, tags, body } from '../../../lib';

const tag = tags(['Other']);

const exampleItem = {
  type: 'object',
  required: true,
  properties: {
    url: { type: 'string', example: 'http://www.baidu.com', required: true },
    name: { type: 'string', example: 'Bob' }
  }
};

module.exports = class OtherRouter {
  @request('get', '/other')
  @summary('something in sub routes')
  @tag
  static async getAll(ctx) {
    const other = [{ xx: 'foo' }, { xx: 'bar' }];
    ctx.body = { other };
  }

  @request('POST', '/other')
  @summary('validator test')
  @tag
  @body({
    str: { type: 'string' },
    boo: { type: 'boolean' },
    foo: {
      type: 'array', required: true, items: 'string', example: ['填写内容']
    },
    bar: {
      type: 'array',
      required: true,
      items: exampleItem,
    },
    exampleItem,
    obb: {
      type: 'object',
      properties: {
        aaaa: { type: 'string', example: 'http://www.baidu.com', required: true },
        bbbb: { type: 'string', example: 'Bob' }
      }
    }
  })
  static async testPost(ctx) {
    ctx.body = ctx.validatedBody;
  }
};

