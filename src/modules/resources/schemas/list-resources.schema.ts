import * as z from "zod";
import { positiveInt32Schema } from "../../../shared/presentation/schemas/positive-integer.schema.js";

const resourceFiltersSchema = z.object({
  resource_type_id: z.coerce.number().pipe(positiveInt32Schema).optional(),
  capacity: z.coerce.number().pipe(positiveInt32Schema).optional(),
});

export const listResourcesRequestSchema = z.object({
  query: resourceFiltersSchema,
});

export type ResourceFilters = z.infer<typeof resourceFiltersSchema>;
