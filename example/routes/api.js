import Router from 'koa-router';

import SampleRouter from './sample';
import UserRouter from './user';

import { wrapper } from '../../lib';

const router = new Router();

wrapper(router);

// swagger docs avaliable at http://localhost:3000/api/swagger-html
router.swagger({
  prefix: '/api',
  swaggerHtmlEndpoint: '/swagger-html',
  swaggerJsonEndpoint: '/swagger-json',
  title: 'Example Server',
  description: 'API DOC',
  version: '1.0.0',
});

router.map(SampleRouter);
router.map(UserRouter);

export default router;
