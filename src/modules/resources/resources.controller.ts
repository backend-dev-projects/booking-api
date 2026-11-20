import type { Request, Response } from "express";
import { findAllResources } from "./resources.repository.js";
import { listResourcesRequestSchema } from "./resource-filters.schema.js";
import { validateRequest } from "../../shared/http/middleware/validate-request.middleware.js";
import { UseMiddleware } from "../../shared/http/routing/get.register.js";

export class ResourcesController {
  @UseMiddleware(validateRequest(listResourcesRequestSchema))
  async listResources(_req: Request, res: Response): Promise<void> {
    const resources = await findAllResources(res.locals.input.query);

    res.json(resources);
  }
}
