import type { ConstraintErrorKey } from "../../../db/postgres/errors.js";
import type { ErrorResponse } from "../../../shared/http/errors/error-response.js";

export const customerDeleteErrors = new Map<ConstraintErrorKey, ErrorResponse>([
  [
    "23503:reservations_user_id_fkey",
    {
      status: 409,
      issues: [
        {
          path: ["params", "id_customer"],
          message: "This user is still referenced by existing reservations.",
        },
      ],
    },
  ],
]);
