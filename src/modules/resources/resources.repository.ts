import { pool } from "../../db/pool.js";
import type { ResourceCreateBody } from "./schemas/create-resource.schema.js";
import type { ResourceFilters } from "./schemas/list-resources.schema.js";
import type { ResourceUpdateBody } from "./schemas/update-resource.schema.js";

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
          FROM resources AS r
      JOIN resource_types AS rt ON rt.id = r.resource_type_id
          WHERE (rt.id = $1 OR $1 IS NULL)
           AND  (r.capacity >= $2 OR $2 IS NULL)
          ORDER BY r.id
  `,
    [filter.resource_type_id ?? null, filter.capacity ?? null],
  );

  return result.rows;
}

export async function findResource(
  id_resource: number,
): Promise<Resource | undefined> {
  const result = await pool.query<Resource>(
    `
    SELECT id, resource_type_id, name, description, floor, capacity
          FROM resources
        WHERE id = $1
  `,
    [id_resource],
  );

  return result.rows[0];
}

export async function insertResource(resource: ResourceCreateBody) {
  const result = await pool.query(
    `
    INSERT INTO resources(resource_type_id, name, description, floor, capacity)
	         VALUES ($1, $2, $3, $4, $5);
  `,
    [
      resource.resource_type_id,
      resource.name,
      resource.description,
      resource.floor,
      resource.capacity,
    ],
  );

  return result.rows;
}

export async function updateResource(
  id_resource: number,
  resource: ResourceUpdateBody,
) {
  const result = await pool.query(
    `
    UPDATE resources
	       SET resource_type_id = COALESCE($1, resource_type_id),
             name             = COALESCE($2, name),
             description      = COALESCE($3, description),
             floor            = COALESCE($4, floor),
             capacity         = COALESCE($5, capacity)
	     WHERE id=$6
  `,
    [
      resource.resource_type_id,
      resource.name,
      resource.description,
      resource.floor,
      resource.capacity,
      id_resource,
    ],
  );

  return result.rows;
}

export async function deleteResource(id_resource: number) {
  const result = await pool.query(
    `
    DELETE FROM resources WHERE id=$1
  `,
    [id_resource],
  );

  return result.rows;
}
