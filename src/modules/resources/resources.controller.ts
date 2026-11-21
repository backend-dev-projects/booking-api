import type { Request, Response } from "express";
import {
  deleteResource,
  findAllResources,
  findResource,
  insertResource,
  updateResource,
} from "./resources.repository.js";
import { listResourcesRequestSchema } from "./schemas/list-resources.schema.js";
import { validateRequest } from "../../shared/http/middleware/validate-request.middleware.js";
import { UseMiddleware } from "../../shared/http/routing/registers.routing.js";
import { createResourcesRequestSchema } from "./schemas/create-resource.schema.js";
import { lookupConstraintError } from "../../db/errors.js";
import { resourceWriteErrors } from "./errors/resource-write.error.js";
import { updateResourceRequestSchema } from "./schemas/update-resource.schema.js";
import { resourceDeleteErrors } from "./errors/resource-delete.error.js";
import { deleteResourceRequestSchema } from "./schemas/delete-resource.schema.js";

export class ResourcesController {
  @UseMiddleware(validateRequest(listResourcesRequestSchema))
  async listResources(_req: Request, res: Response): Promise<void> {
    const resources = await findAllResources(res.locals.input.query);

    res.json(resources);
  }

  @UseMiddleware(validateRequest(createResourcesRequestSchema))
  async createResource(_req: Request, res: Response): Promise<void> {
    try {
      await insertResource(res.locals.input.body);
      res.status(201).end();
    } catch (error: unknown) {
      const response = lookupConstraintError(error, resourceWriteErrors);

      if (!response) {
        throw error;
      }

      res.status(response.status).json({ issues: [response.issue] });
    }
  }

  @UseMiddleware(validateRequest(updateResourceRequestSchema))
  async updateResource(_req: Request, res: Response): Promise<void> {
    const { id_resource: id_resource } = res.locals.input.params;

    const response = await findResource(id_resource);

    if (!response)
      res
        .status(404)
        .json({ issues: { message: "There is no matching resource" } });

    try {
      await updateResource(id_resource, res.locals.input.body);
      res.status(204).end();
    } catch (error: unknown) {
      const response = lookupConstraintError(error, resourceWriteErrors);

      if (!response) {
        throw error;
      }

      res.status(response.status).json({ issues: [response.issue] });
    }
  }

  @UseMiddleware(validateRequest(deleteResourceRequestSchema))
  async deleteResource(_req: Request, res: Response): Promise<void> {
    const { id_resource: id_resource } = res.locals.input.params;

    const response = await findResource(id_resource);

    if (!response)
      res
        .status(404)
        .json({ issues: { message: "There is no matching resource" } });

    try {
      await deleteResource(id_resource);
      res.status(204).end();
    } catch (error: unknown) {
      const response = lookupConstraintError(error, resourceDeleteErrors);

      if (!response) {
        throw error;
      }

      res.status(response.status).json({ issues: [response.issue] });
    }
  }
}
