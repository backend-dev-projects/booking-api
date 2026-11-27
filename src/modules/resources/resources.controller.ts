import type { Request, Response } from "express";
import { listResourcesRequestSchema } from "./schemas/list-resources.schema.js";
import { validateRequest } from "../../shared/http/middleware/validate-request.middleware.js";
import { UseMiddleware } from "../../shared/http/routing/registers.routing.js";
import { createResourcesRequestSchema } from "./schemas/create-resource.schema.js";
import { lookupConstraintError } from "../../db/postgres/errors.js";
import { resourceWriteErrors } from "./errors/resource-write.error.js";
import { updateResourceRequestSchema } from "./schemas/update-resource.schema.js";
import { resourceDeleteErrors } from "./errors/resource-delete.error.js";
import { deleteResourceRequestSchema } from "./schemas/delete-resource.schema.js";
import { loadResource } from "./middlewares/load-resource.middleware.js";
import { ResourceRepository } from "./resources.repository.js";
import { HttpError } from "../../shared/http/errors/http-error.js";

export class ResourcesController {
  private readonly resourceRepository = new ResourceRepository();

  @UseMiddleware(validateRequest(listResourcesRequestSchema))
  async listResources(_req: Request, res: Response): Promise<void> {
    const resources = await this.resourceRepository.findAll(
      res.locals.input.query,
    );

    res.json(resources);
  }

  @UseMiddleware(validateRequest(createResourcesRequestSchema))
  async createResource(_req: Request, res: Response): Promise<void> {
    try {
      await this.resourceRepository.insert(res.locals.input.body);
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

    res.status(201).end();
  }

  @UseMiddleware(validateRequest(updateResourceRequestSchema), loadResource)
  async updateResource(_req: Request, res: Response): Promise<void> {
    const { resource_id: resource_id } = res.locals.input.params;

    try {
      await this.resourceRepository.update(resource_id, res.locals.input.body);
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

    res.status(204).end();
  }

  @UseMiddleware(validateRequest(deleteResourceRequestSchema), loadResource)
  async deleteResource(_req: Request, res: Response): Promise<void> {
    const { resource_id } = res.locals.input.params;

    try {
      await this.resourceRepository.delete(resource_id);
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

    res.status(204).end();
  }
}
