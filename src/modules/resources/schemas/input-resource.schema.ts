import * as z from "zod";

export const resourceIdParamsSchema = z.object({
  id_resource: z.coerce.number().int().positive(),
});
