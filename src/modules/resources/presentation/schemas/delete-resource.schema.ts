import * as z from "zod";
import { resourceIdParamsSchema } from "./input-resource.schema.js";

export const deleteResourceRequestSchema = z.object({
  params: resourceIdParamsSchema,
});

export type ResourceDeleteBody = z.infer<typeof deleteResourceRequestSchema>;
