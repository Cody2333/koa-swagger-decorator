import { request, summary, tags } from '../../../../lib';

const tag = tags(['PP']);

export default class Other3Router {
  @request('get', '/other/how')
  @summary('something in sub sub routes')
  @tag
  static async getAll(ctx) {
    const other = [{ zz: 'foo' }, { zz: 'bar' }];
    ctx.body = { other };
  }
}
