import * as z from "zod";

export const resourceIdParamsSchema = z.object({
  resource_id: z.coerce.number().int().positive(),
});
