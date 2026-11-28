import * as z from "zod";
import { customerIdParamsSchema } from "./input-customer.schema.js";

export const deleteCustomerRequestSchema = z.object({
  params: customerIdParamsSchema,
});
