import { request, summary, tags, query, body, prefix } from '../../../dist';

const tag = tags(['Egg']);

@prefix('/egg')
export default class EggRouter {
  @request('get', '/method1')
  @summary('egg-like controller method1')
  @tag
  @query({
    no: { type: 'string', description: 'nonono' }
  })
  async method1(ctx) {
    const { no } = ctx.validatedQuery;
    ctx.body = { no };
  }

  @request('post', '/method2')
  @summary('egg-like controller method2')
  @tag
  @body({
    yes: {
      type: 'string',
      require: true,
      description: 'yesyesyes',
      nullable: true
    }
  })
  async method2(ctx) {
    const { yes } = ctx.validatedBody;
    ctx.body = { yes };
  }
}
