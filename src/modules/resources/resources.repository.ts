import type { DbClient } from "../../db/db-client.js";
import { database } from "../../db/index.js";
import type { BookingMode } from "./enums/booking-mode.enum.js";
import type { ResourceCreateBody } from "./schemas/create-resource.schema.js";
import type { ResourceFilters } from "./schemas/list-resources.schema.js";
import type { ResourceUpdateBody } from "./schemas/update-resource.schema.js";

export interface Resource {
  id: string;
  resource_type_id: string;
  booking_mode: BookingMode;
  name: string;
  capacity: number;
  description: string | null;
  floor: number | null;
}

export class ResourcesRepository {
  constructor(private readonly db: DbClient = database) {}

  async filter(filter: ResourceFilters): Promise<Resource[]> {
    const result = await this.db.query<Resource>(
      `
    SELECT r.id, r.resource_type_id, r.name, 
           r.description, r.floor, r.capacity, 
           rt.booking_mode
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

  async findById(resource_id: string): Promise<Resource | undefined> {
    const result = await this.db.query<Resource>(
      `
    SELECT r.id, r.resource_type_id, r.name, 
           r.description, r.floor, r.capacity, 
           rt.booking_mode
          FROM resources AS r
      JOIN resource_types AS rt ON rt.id = r.resource_type_id
        WHERE r.id = $1
  `,
      [resource_id],
    );

    return result.rows[0];
  }

  async findForUpdate(resource_id: number): Promise<Resource | undefined> {
    const result = await this.db.query<Resource>(
      `
    SELECT r.id, r.resource_type_id, r.name, 
           r.description, r.floor, r.capacity, 
           rt.booking_mode
          FROM resources AS r
      JOIN resource_types AS rt ON rt.id = r.resource_type_id
        WHERE r.id = $1
        FOR UPDATE OF r
  `,
      [resource_id],
    );

    return result.rows[0];
  }

  async insert(resource: ResourceCreateBody) {
    await this.db.query(
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
  }

  async update(resource_id: number, resource: ResourceUpdateBody) {
    await this.db.query(
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
        resource_id,
      ],
    );
  }

  async delete(resource_id: number) {
    await this.db.query(
      `
    DELETE FROM resources WHERE id=$1
  `,
      [resource_id],
    );
  }
}
