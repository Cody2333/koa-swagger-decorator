import { SwaggerRouter } from '../../../dist';

const koaRouterOpts = { prefix: '/api/v2' };
const swaggerRouterOpts = {
  title: 'API V2 Server',
  description: 'API DOC',
  version: '1.0.0'
};
const router = new SwaggerRouter(koaRouterOpts, swaggerRouterOpts);

// swagger docs avaliable at http://localhost:3000/api/v2/swagger-html
router.swagger();

router.mapDir(__dirname);

export default router;
