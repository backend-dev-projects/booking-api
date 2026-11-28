import type { RequestHandler } from "express";
import { Customer } from "../../domain/customer.model.js";

export const requireAuthChanges: RequestHandler = (_req, res, next) => {
  const { user_id, role } = _req.session;
  const { id_customer } = res.locals.input.params;

  const customer = new Customer(id_customer, "", role!, "");

  const allowed = customer.canUpdateUser(user_id!);

  if (!allowed) {
    res.status(403).json({
      issues: {
        message: "You don't have permission to execute this change.",
      },
    });
    return;
  }

  next();
};
