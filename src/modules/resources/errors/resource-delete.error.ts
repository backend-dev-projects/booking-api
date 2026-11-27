import type { ConstraintErrorKey } from "../../../db/postgres/errors.js";
import type { ErrorResponse } from "../../../shared/http/errors/error-response.js";

export const resourceDeleteErrors = new Map<ConstraintErrorKey, ErrorResponse>([
  [
    "23503:reservations_resource_id_fkey",
    {
      status: 409,
      issues: [
        {
          path: ["params", "id_resource"],
          message:
            "This resource is still referenced by existing reservations.",
        },
      ],
    },
  ],
]);
