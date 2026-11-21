import type { ConstraintErrorKey } from "../../../db/errors.js";
import type { ConstraintError } from "../../../shared/http/errors/error.type.js";

export const customerDeleteErrors = new Map<
  ConstraintErrorKey,
  ConstraintError
>([
  [
    "23503:reservations_user_id_fkey",
    {
      status: 409,
      issue: {
        path: ["params", "id_customer"],
        code: "user_has_reservations",
        message: "This user is still referenced by existing reservations.",
      },
    },
  ],
]);
