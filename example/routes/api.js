import _path from 'path';
import { SwaggerRouter } from '../../lib';

const router = new SwaggerRouter();


// swagger docs avaliable at http://localhost:3000/api/swagger-html
router.swagger({

  title: 'Example Server',
  description: 'API DOC',
  version: '1.0.0',

  // [optional] default is root path.
  prefix: '/api',

  // [optional] default is /swagger-html
  swaggerHtmlEndpoint: '/swagger-html',

  // [optional] default is /swagger-json
  swaggerJsonEndpoint: '/swagger-json',

  // [optional] additional options for building swagger doc
  // eg. add api_key as shown below
  swaggerOptions: {
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization'
      }
    },
  }
});


// mapDir will scan the input dir, and automatically call router.map to all Router Class
router.mapDir(_path.resolve(__dirname), { recursive: true });

export default router;
