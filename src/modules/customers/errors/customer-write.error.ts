import type { ConstraintErrorKey } from "../../../db/errors.js";
import type { ConstraintError } from "../../../shared/http/errors/error.type.js";

export const customerWriteErrors = new Map<ConstraintErrorKey, ConstraintError>(
  [
    [
      "23505:users_email_key",
      {
        status: 409,
        issue: {
          path: ["body", "email"],
          code: "email_taken",
          message: "A customer with this email already exists.",
        },
      },
    ],
  ],
);
