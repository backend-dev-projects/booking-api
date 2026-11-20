import { Router } from "express";
import { ResourcesController } from "./resources.controller.js";
import { registerGet } from "../../shared/http/routing/get.register.js";

export const resourcesRouter = Router();

const controller = new ResourcesController();

registerGet(
  resourcesRouter,
  "/resources",
  controller,
  controller.listResources,
);
