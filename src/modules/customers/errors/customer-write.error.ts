import type { ConstraintErrorKey } from "../../../db/postgres/errors.js";
import type { ErrorResponse } from "../../../shared/http/errors/error-response.js";

export const customerWriteErrors = new Map<ConstraintErrorKey, ErrorResponse>([
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
