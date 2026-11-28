import * as z from "zod";
import { positiveInt32Schema } from "../../../shared/presentation/schemas/positive-integer.schema.js";

const resourceCreateBodySchema = z.object({
  resource_type_id: positiveInt32Schema,
  name: z.string(),
  description: z.string().optional(),
  floor: positiveInt32Schema,
  capacity: positiveInt32Schema,
});

export const createResourcesRequestSchema = z.object({
  body: resourceCreateBodySchema,
});

export type ResourceCreateBody = z.infer<typeof resourceCreateBodySchema>;
