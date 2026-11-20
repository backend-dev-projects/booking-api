import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export function validateRequest<T>(schema: ZodType<T>): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse({
      query: req.query,
      params: req.params,
      body: req.body,
    });

    if (!result.success) {
      res.status(400).json({ issues: result.error.issues });
      return;
    }

    res.locals.input = result.data;
    next();
  };
}
