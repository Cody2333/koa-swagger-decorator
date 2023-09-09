export default () => async (ctx, next) => {
  try {
    await next();
  } catch (error: any) {
    console.log(error.message, error.stack);
    ctx.status = error.status || 400;
    ctx.body = { msg: error.toString() };
  }
};
