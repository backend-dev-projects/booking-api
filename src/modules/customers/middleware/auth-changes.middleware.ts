import type { RequestHandler } from "express";
import { Role } from "../../authentication/enums/roles.enum.js";

export const requireAuthChanges: RequestHandler = (_req, res, next) => {
  const { id_customer: id_customer } = res.locals.input.params;

  const canUpdate =
    _req.session.role === Role.ADMIN || _req.session.userId === id_customer;

  if (!canUpdate) {
    res
      .status(403)
      .json({
        issues: {
          message: "You don't have permission to execute this change.",
        },
      });
    return;
  }

  next();
};
