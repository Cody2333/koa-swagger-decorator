import { SwaggerRouter } from "../../lib/swagger-router";
import { UserController } from "../controller/user";

const router = new SwaggerRouter();

router.init({
  info: {
    title: "cody",
    version: "v1",
  },
});

router.applyRoute(UserController);

export { router };
