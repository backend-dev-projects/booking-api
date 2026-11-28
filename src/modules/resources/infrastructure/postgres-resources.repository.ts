import type { DbClient } from "../../../db/db-client.js";
import { database } from "../../../db/index.js";
import type { Resource } from "../domain/resource.model.js";
import type { ResourceFilters } from "../presentation/schemas/list-resources.schema.js";
import { lookupConstraintError } from "../../../db/postgres/errors.js";
import { resourceWriteErrors } from "./errors/resource-write.error.js";
import { ApplicationError } from "../../../shared/presentation/errors/application-error.js";
import { resourceDeleteErrors } from "./errors/resource-delete.error.js";
import type { ResourcesRepositoryPort } from "../application/ports/resources-repository.port.js";

export class ResourcesRepository implements ResourcesRepositoryPort {
  constructor(private readonly db: DbClient = database) {}

  async filter(
    resource_type_id?: number,
    capacity?: number,
  ): Promise<Resource[]> {
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
      [resource_type_id ?? null, capacity ?? null],
    );

    return result.rows;
  }

  async findById(resource_id: number): Promise<Resource | undefined> {
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

  async insert(
    resource_type_id: number,
    name: string,
    description: string,
    floor: number,
    capacity: number,
  ) {
    try {
      await this.db.query(
        `
        INSERT INTO resources(resource_type_id, name, description, floor, capacity)
	         VALUES ($1, $2, $3, $4, $5);
        `,
        [resource_type_id, name, description, floor, capacity],
      );
    } catch (error: unknown) {
      const response = lookupConstraintError(error, resourceWriteErrors);

      if (!response) {
        throw error;
      }

      throw new ApplicationError(
        response.status,
        response.issues[0]!.message,
        response.issues[0]!.path,
      );
    }
  }

  async update(
    resource_id: number,
    resource_type_id?: number,
    name?: string,
    description?: string,
    floor?: number,
    capacity?: number,
  ) {
    try {
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
        [resource_type_id, name, description, floor, capacity, resource_id],
      );
    } catch (error: unknown) {
      const response = lookupConstraintError(error, resourceWriteErrors);

      if (!response) {
        throw error;
      }

      throw new ApplicationError(
        response.status,
        response.issues[0]!.message,
        response.issues[0]!.path,
      );
    }
  }

  async delete(resource_id: number) {
    try {
      await this.db.query(
        `
          DELETE FROM resources WHERE id=$1
        `,
        [resource_id],
      );
    } catch (error: unknown) {
      const response = lookupConstraintError(error, resourceDeleteErrors);

      if (!response) {
        throw error;
      }

      throw new ApplicationError(
        response.status,
        response.issues[0]!.message,
        response.issues[0]!.path,
      );
    }
  }
}
