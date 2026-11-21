import { Router } from "express";
import { ResourcesController } from "./resources.controller.js";
import {
  Delete,
  Get,
  Patch,
  Post,
} from "../../shared/http/routing/registers.routing.js";

export const resourcesRouter = Router();

const controller = new ResourcesController();

Get(resourcesRouter, "/resources", controller, controller.listResources);

Post(resourcesRouter, "/resources", controller, controller.createResource);

Patch(
  resourcesRouter,
  "/resources/:id_resource",
  controller,
  controller.updateResource,
);

Delete(
  resourcesRouter,
  "/resources/:id_resource",
  controller,
  controller.deleteResource,
);
