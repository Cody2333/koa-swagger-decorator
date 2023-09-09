import { ZodError } from "zod";

export default () => async (ctx, next) => {
  try {
    await next();
  } catch (error: any) {
    console.log(typeof error);
    if (error instanceof ZodError) {
      ctx.status = 400;
      ctx.body = {
        msg: error?.message,
        stack: error?.stack,
        ...error,
      };
      return;
    }
    console.log(error.message, error.stack);
    ctx.status = error.status || 400;
    ctx.body = { msg: error?.message, stack: error?.stack };
  }
};
