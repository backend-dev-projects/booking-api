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
import { HttpError } from "../../shared/http/errors/http-error.js";
import { ResourcesService } from "./resources.service.js";

export class ResourcesController {
  constructor(private readonly resourcesService = new ResourcesService()) {}

  @UseMiddleware(validateRequest(listResourcesRequestSchema))
  async listResources(_req: Request, res: Response): Promise<void> {
    const { resource_type_id, capacity } = res.locals.input.query;

    const resources = await this.resourcesService.findAll(
      resource_type_id,
      capacity,
    );

    res.json(resources);
  }

  @UseMiddleware(validateRequest(createResourcesRequestSchema))
  async createResource(_req: Request, res: Response): Promise<void> {
    this.resourcesService.insert(res.locals.input.body);

    res.status(201).end();
  }

  @UseMiddleware(validateRequest(updateResourceRequestSchema), loadResource)
  async updateResource(_req: Request, res: Response): Promise<void> {
    const { resource_id: resource_id } = res.locals.input.params;

    await this.resourcesService.update(resource_id, res.locals.input.body);

    res.status(204).end();
  }

  @UseMiddleware(validateRequest(deleteResourceRequestSchema), loadResource)
  async deleteResource(_req: Request, res: Response): Promise<void> {
    const { resource_id } = res.locals.input.params;

    await this.resourcesService.delete(resource_id);

    res.status(204).end();
  }
}
