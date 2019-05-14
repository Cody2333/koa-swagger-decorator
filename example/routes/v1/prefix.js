import Doc, { description } from '../../../dist'; // 2 import style avaliable

const {
  request, summary, query, tags, responses, prefix
} = Doc;

const tag = tags(['prefix']);

@prefix('/v1')
export default class PrefixRouter {
  @request('GET', '/prefix')
  @summary('class decorator for url prefix')
  @description('class decorator for url prefix')
  @tag
  @query({
    page: {
      type: 'string',
      description: 'page number'
    }
  })
  @responses({
    200: { description: 'success' },
    500: { description: 'something wrong about server' }
  })
  static async classPrefix(ctx) {
    const { page } = ctx.request.query;
    ctx.body = { result: page };
  }
}
