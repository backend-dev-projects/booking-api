import * as z from "zod";

const customerCreateBodySchema = z.object({
  full_name: z.string().trim().min(1),
  email: z.string().trim().pipe(z.email()),
  password: z.string().min(15).max(128),
});

export const createResourcesRequestSchema = z.object({
  body: customerCreateBodySchema,
});

export type CustomerCreateBody = z.infer<typeof customerCreateBodySchema>;
