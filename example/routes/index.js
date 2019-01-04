import Router from 'koa-router';

import ApiRouter from './api';
import Api2Router from './sub_routes/api2';

const router = new Router();

router.use('/api', ApiRouter.routes());
router.use('/api2', Api2Router.routes());

export default router;
