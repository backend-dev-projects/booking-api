import * as z from "zod";

export const requireUpdateFields = z.refine<object>(
  (body) => Object.values(body).some((value) => value !== undefined),
  { error: "Provide at least one field to update." },
);
