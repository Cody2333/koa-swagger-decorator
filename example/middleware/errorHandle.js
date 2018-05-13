export default () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log(error.stack);
    ctx.status = error.status || 400;
    ctx.body = { msg: error.toString() };
  }
};
