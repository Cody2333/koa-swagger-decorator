import { SwaggerRouter } from "../../lib/swagger-router";
import { DemoController } from "../controller/demo";
import { UserController } from "../controller/user";

const router = new SwaggerRouter({
  spec: {
    info: {
      title: "Example API Server",
      version: "v1.0",
    },
  },
});

// apply swagger docs routes
router.swagger();

// apply user defined routes
router.applyRoute(UserController).applyRoute(DemoController);

export { router };
