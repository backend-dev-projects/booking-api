import type { ConstraintErrorKey } from "../../../db/errors.js";
import type { ConstraintError } from "../../../shared/http/errors/error.type.js";

export const resourceDeleteErrors = new Map<
  ConstraintErrorKey,
  ConstraintError
>([
  [
    "23503:reservations_resource_id_fkey",
    {
      status: 409,
      issue: {
        path: ["params", "id_resource"],
        code: "resource_has_reservations",
        message: "This resource is still referenced by existing reservations.",
      },
    },
  ],
]);
