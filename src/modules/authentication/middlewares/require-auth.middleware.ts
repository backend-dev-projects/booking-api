import type { RequestHandler } from "express";

export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.session.userId === undefined) {
    res.status(401).json({ issues: { message: "Sign in to continue." } });
    return;
  }

  next();
};
