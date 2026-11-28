import { Router } from "express";
import { ResourcesController } from "./resources.controller.js";
import { validateRequest } from "../../../shared/presentation/middleware/validate-request.middleware.js";
import { listResourcesRequestSchema } from "./schemas/list-resources.schema.js";
import { createResourcesRequestSchema } from "./schemas/create-resource.schema.js";
import { updateResourceRequestSchema } from "./schemas/update-resource.schema.js";
import { deleteResourceRequestSchema } from "./schemas/delete-resource.schema.js";
import { loadResource } from "./middlewares/load-resource.middleware.js";

export function registerPrivateResourcerRouter(
  controller: ResourcesController,
) {
  const router = Router();

  router.get(
    "/resources",
    validateRequest(listResourcesRequestSchema),
    controller.listResources,
  );

  router.post(
    "/resources",
    validateRequest(createResourcesRequestSchema),
    controller.createResource,
  );

  router.patch(
    "/resources/:resource_id",
    validateRequest(updateResourceRequestSchema),
    loadResource,
    controller.updateResource,
  );

  router.delete(
    "/resources/:resource_id",
    validateRequest(deleteResourceRequestSchema),
    loadResource,
    controller.deleteResource,
  );

  return router;
}
