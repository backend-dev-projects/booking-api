import type { ConstraintErrorKey } from "../../../../db/postgres/errors.js";
import type { PostgreError } from "../../../../shared/presentation/errors/postgres-error.js";

export const customerWriteErrors = new Map<ConstraintErrorKey, PostgreError>([
  [
    "23505:users_email_key",
    {
      status: 409,
      issues: [
        {
          path: ["body", "email"],
          message: "A customer with this email already exists.",
        },
      ],
    },
  ],
]);
