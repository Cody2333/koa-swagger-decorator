import Koa from "koa";
import bodyParser from "@koa/bodyparser";
import cors from "@koa/cors";
import "./controller/user";
import config from "./controller/config";
import errorHandle from "./middleware/errorHandle";
import { router } from "./routes/index";
import "./schemas/user";
const app = new Koa();
app
  .use(cors())
  .use(bodyParser())
  .use(errorHandle())
  .use(router.routes())
  .use(router.allowedMethods());

export default app.listen(config.port, () => {
  console.log(`App is listening on ${config.port}.`);
});
