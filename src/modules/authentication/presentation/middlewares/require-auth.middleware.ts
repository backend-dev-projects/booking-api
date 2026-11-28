import type { RequestHandler } from "express";
import { ApplicationError } from "../../../../shared/application/errors/application-error.js";

export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.session.user_id === undefined) {
    throw new ApplicationError(401, "Sign in to continue.");
    return;
  }

  next();
};
