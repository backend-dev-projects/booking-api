import * as z from "zod";
import { customerIdParamsSchema } from "./input-customer.schema.js";
import { requireUpdateFields } from "../../../shared/validations/schemas/require-update-fields.schema.js";

const customerUpdateBodySchema = z
  .object({
    full_name: z.string().trim().min(1).optional(),
    password: z.string().min(15).max(128).optional(),
  })
  .check(requireUpdateFields);

export const updateCustomerRequestSchema = z.object({
  params: customerIdParamsSchema,
  body: customerUpdateBodySchema,
});

export type CustomerUpdateBody = z.infer<typeof customerUpdateBodySchema>;
