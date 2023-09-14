import { SwaggerRouter } from "../../lib";
import { DemoController } from "../controller/demo";
import { UserController } from "../controller/user";
import { registerExtraComponents } from "../schemas/extra";

const router = new SwaggerRouter({
  spec: {
    info: {
      title: "Example API Server",
      version: "v1.0",
    },
  },
});

router.prefix("/api");

registerExtraComponents(router.registry);

// apply swagger docs routes
router.swagger();

// apply user defined routes
router.applyRoute(UserController).applyRoute(DemoController);

export { router };
