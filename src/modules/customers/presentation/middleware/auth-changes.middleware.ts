import type { RequestHandler } from "express";
import { Role } from "../../../authentication/enums/roles.enum.js";
import { canUpdateCustomer } from "../../application/policies/can-update-customer.js";

export const requireAuthChanges: RequestHandler = (_req, res, next) => {
  const { user_id, role } = _req.session;
  const { id_customer } = res.locals.input.params;

  const allowed = canUpdateCustomer(user_id!, role!, id_customer);

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
