import { Method } from "./utils/constant";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { registry } from "./registry";
import { ItemMeta } from "./swagger-router";

extendZodWithOpenApi(z);

export { z, registry };

export * from "./decorator";
export type { Method, ItemMeta };
