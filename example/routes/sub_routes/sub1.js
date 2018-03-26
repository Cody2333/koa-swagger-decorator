import { request, summary, tags } from '../../../lib';

const tag = tags(['Other']);


export default class OtherRouter {
  @request('get', '/other')
  @summary('something in sub routes')
  @tag
  static async getAll(ctx) {
    const other = [{ xx: 'foo' }, { xx: 'bar' }];
    ctx.body = { other };
  }
}

