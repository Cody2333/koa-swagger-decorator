import { request, summary, tags } from '../../../lib';

const tag = tags(['Other']);


export default class Other2Router {
  @request('get', '/other/what')
  @summary('something else in sub routes ')
  @tag
  static async getAll(ctx) {
    const other = [{ yy: 'foo' }, { yy: 'bar' }];
    ctx.body = { other };
  }
}

