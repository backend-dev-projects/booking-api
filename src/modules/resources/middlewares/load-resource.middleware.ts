import type { RequestHandler } from "express";
import { ResourceRepository } from "../resources.repository.js";
import { HttpError } from "../../../shared/http/errors/http-error.js";

const resourceRepository = new ResourceRepository();

export const loadResource: RequestHandler = async (req, res) => {
  const resourceId = req.params.id?.toString() ?? "";

  const resource = await resourceRepository.findById(resourceId);

  if (!resource) {
    throw new HttpError(404, "Resource not found.", ["params", "id"]);
  }

  res.locals.resource = resource;
};
