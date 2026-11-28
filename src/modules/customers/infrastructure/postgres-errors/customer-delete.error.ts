import type { ConstraintErrorKey } from "../../../../db/postgres/errors.js";
import type { PostgreError } from "../../../../shared/presentation/errors/postgres-error.js";

export const customerDeleteErrors = new Map<ConstraintErrorKey, PostgreError>([
  [
    "23503:reservations_user_id_fkey",
    {
      status: 409,
      issues: [
        {
          path: ["params", "customer_id"],
          message: "This user is still referenced by existing reservations.",
        },
      ],
    },
  ],
]);
