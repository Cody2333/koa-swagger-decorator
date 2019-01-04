import { SwaggerRouter } from '../../../dist';

const router = new SwaggerRouter();

// swagger docs avaliable at http://localhost:3000/api2/swagger-html
router.swagger({
  title: 'API2 Server',
  description: 'API DOC',
  version: '1.0.0',
  prefix: '/api2'
});
router.mapDir(__dirname);

export default router;
