import { SwaggerRouter } from '../../lib';

import ApiRouter from './v1';
import Api2Router from './v2';

const router = new SwaggerRouter();

router.use('/api/v1', ApiRouter.routes());

router.use(Api2Router.routes());

// swagger docs avaliable at http://localhost:3000/swagger-html
router.swagger({
  title: 'API V2 Server',
  description: 'API DOC',
  version: '1.0.0'
});
router.mapDir(__dirname);

export default router;
