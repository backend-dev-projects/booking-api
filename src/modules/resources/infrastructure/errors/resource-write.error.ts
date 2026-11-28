import type { ConstraintErrorKey } from "../../../../db/postgres/errors.js";
import type { PostgreError } from "../../../../shared/presentation/errors/postgres-error.js";

export const resourceWriteErrors = new Map<ConstraintErrorKey, PostgreError>([
  [
    "23505:uq_resources_name",
    {
      status: 409,
      issues: [
        {
          path: ["body", "name"],
          message: "A resource with this name already exists.",
        },
      ],
    },
  ],
  [
    "23503:resources_resource_type_id_fkey",
    {
      status: 422,
      issues: [
        {
          path: ["body", "resource_type_id"],
          message: "Resource type id is not found.",
        },
      ],
    },
  ],
]);
