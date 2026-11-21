import type { ConstraintErrorKey } from "../../../db/errors.js";
import type { ConstraintError } from "../../../shared/http/errors/error.type.js";

export const resourceWriteErrors = new Map<ConstraintErrorKey, ConstraintError>(
  [
    [
      "23505:uq_resources_name",
      {
        status: 409,
        issue: {
          path: ["body", "name"],
          code: "resource_name_taken",
          message: "A resource with this name already exists.",
        },
      },
    ],
    [
      "23503:resources_resource_type_id_fkey",
      {
        status: 422,
        issue: {
          path: ["body", "resource_type_id"],
          code: "resource_type_id_not_found",
          message: "Resource type id is not found.",
        },
      },
    ],
  ],
);
