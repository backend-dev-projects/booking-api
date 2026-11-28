import * as z from "zod";

export const customerIdParamsSchema = z.object({
  id_customer: z.string().regex(/^[1-9]\d{0,18}$/, {
    error: "Customer ID must be a positive integer of at most 19 digits.",
  }),
});
