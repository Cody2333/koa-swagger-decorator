export default () => async (ctx, next) => {
  try {
    await next();
  } catch (error: any) {
    ctx.status = error.status || 400;
    ctx.body = { msg: error.toString() };
  }
};
