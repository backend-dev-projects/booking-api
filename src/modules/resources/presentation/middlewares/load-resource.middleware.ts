import type { RequestHandler } from "express";
import { ApplicationError } from "../../../../shared/presentation/errors/application-error.js";
import type { ResourceService } from "../../application/resources.service.js";

export function loadResource(resourceService: ResourceService): RequestHandler {
  return async (req, res, next) => {
    const resource_id = req.params.id?.toString() ?? "";

    const resource = await resourceService.findById(Number(resource_id));

    if (!resource) {
      throw new ApplicationError(404, "Resource not found.", ["params", "id"]);
    }

    res.locals.resource = resource;

    next();
  };
}
