import { lookupConstraintError } from "../../db/postgres/errors.js";
import { ResourcesRepository } from "./resources.repository.js";
import type { Resource } from "./resources.types.js";
import { resourceWriteErrors } from "./errors/resource-write.error.js";
import { resourceDeleteErrors } from "./errors/resource-delete.error.js";
import { HttpError } from "../../shared/http/errors/http-error.js";
import type { ResourceCreateBody } from "./schemas/create-resource.schema.js";
import type { ResourceUpdateBody } from "./schemas/update-resource.schema.js";

export class ResourcesService {
  constructor(
    private readonly resourcesRepository = new ResourcesRepository(),
  ) {}

  async findAll(
    resource_type_id?: number,
    capacity?: number,
  ): Promise<Resource[]> {
    return await this.resourcesRepository.filter({
      resource_type_id,
      capacity,
    });
  }

  async insert(resource: ResourceCreateBody) {
    try {
      await this.resourcesRepository.insert(resource);
    } catch (error: unknown) {
      const response = lookupConstraintError(error, resourceWriteErrors);

      if (!response) {
        throw error;
      }

      throw new HttpError(
        response.status,
        response.issues[0]!.message,
        response.issues[0]!.path,
      );
    }
  }

  async update(resource_id: number, resource: ResourceUpdateBody) {
    try {
      await this.resourcesRepository.update(resource_id, resource);
    } catch (error: unknown) {
      const response = lookupConstraintError(error, resourceWriteErrors);

      if (!response) {
        throw error;
      }

      throw new HttpError(
        response.status,
        response.issues[0]!.message,
        response.issues[0]!.path,
      );
    }
  }

  async delete(resource_id: number) {
    try {
      await this.resourcesRepository.delete(resource_id);
    } catch (error: unknown) {
      const response = lookupConstraintError(error, resourceDeleteErrors);

      if (!response) {
        throw error;
      }

      throw new HttpError(
        response.status,
        response.issues[0]!.message,
        response.issues[0]!.path,
      );
    }
  }
}
