import * as z from "zod";

const loginBodySchema = z.object({
  email: z.string().trim().pipe(z.email()),
  password: z.string().min(1, { error: "Password must not be empty." }),
});

export const loginRequestSchema = z.object({
  body: loginBodySchema,
});

export type LoginBody = z.infer<typeof loginBodySchema>;
