import * as z from "zod";

export const customerIdParamsSchema = z.object({
  id_customer: z.coerce.number().int().positive(),
});
