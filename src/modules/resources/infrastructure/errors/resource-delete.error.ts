import type { ConstraintErrorKey } from "../../../../db/postgres/errors.js";
import type { PostgreError } from "../../../../shared/presentation/errors/postgres-error.js";

export const resourceDeleteErrors = new Map<ConstraintErrorKey, PostgreError>([
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
