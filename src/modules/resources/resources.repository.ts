import { pool } from "../../db/pool.js";
import type { ResourceFilters } from "./resource-filters.schema.js";

export interface Resource {
  id: string;
  resource_type_id: string;
  name: string;
  description: string | null;
  floor: number | null;
  capacity: number;
}

export async function findAllResources(
  filter: ResourceFilters,
): Promise<Resource[]> {
  const result = await pool.query<Resource>(
    `
    SELECT r.id, r.resource_type_id, r.name, r.description, r.floor, r.capacity
    FROM public.resources AS r
    JOIN public.resource_types AS rt ON rt.id = r.resource_type_id
    WHERE ($1::integer IS NULL OR rt.name = $1)
      AND ($2::integer IS NULL OR r.capacity >= $2)
    ORDER BY r.id
  `,
    [filter.resource_type ?? null, filter.capacity ?? null],
  );

  return result.rows;
}
