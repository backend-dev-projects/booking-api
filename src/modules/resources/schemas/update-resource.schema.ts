import * as z from "zod";
import { resourceIdParamsSchema } from "./input-resource.schema.js";
import { positiveInt32Schema } from "../../../shared/presentation/schemas/positive-integer.schema.js";
import { requireUpdateFields } from "../../../shared/presentation/schemas/require-update-fields.schema.js";

const resourceUpdateBodySchema = z
  .object({
    resource_type_id: positiveInt32Schema.optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    floor: positiveInt32Schema.optional(),
    capacity: positiveInt32Schema.optional(),
  })
  .check(requireUpdateFields);

export const updateResourceRequestSchema = z.object({
  params: resourceIdParamsSchema,
  body: resourceUpdateBodySchema,
});

export type ResourceUpdateBody = z.infer<typeof resourceUpdateBodySchema>;
