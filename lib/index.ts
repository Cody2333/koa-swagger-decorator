import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { registry } from "./registry";

extendZodWithOpenApi(z);

export { z, registry };
