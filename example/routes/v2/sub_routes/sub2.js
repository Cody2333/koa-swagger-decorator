import { request, summary, tags, query, body } from '../../../../dist';

const tag = tags(['Other']);

export default class Other2Router {
  @request('get', '/other/what')
  @summary('something else in sub routes ')
  @tag
  @query({
    no: { description: 'ff' }
  })
  static async getAll(ctx) {
    const { no } = ctx.validatedQuery;
    const other = [{ yy: 'foo' }, { yy: 'bar' }];
    ctx.body = { other, no };
  }

  @request('POST', '/other/what')
  @summary('test when type is not defined')
  @tag
  @body({
    num: { type: 'number', example: 4 },
    ss: { example: '' },
    xx: { type: 'object' }
  })
  static async post(ctx) {
    const { num, ss, xx } = ctx.validatedBody;
    ctx.body = { num, ss, xx };
  }
}
