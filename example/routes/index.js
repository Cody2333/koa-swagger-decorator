import Router from 'koa-router';

import ApiRouter from './api';

const router = new Router();

router.use('/api', ApiRouter.routes());
export default router;
