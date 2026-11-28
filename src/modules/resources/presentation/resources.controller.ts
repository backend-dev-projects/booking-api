import type { Request, Response } from "express";
import type { ResourcesService } from "../application/resources.service.js";

export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  async listResources(_req: Request, res: Response): Promise<void> {
    const { resource_type_id, capacity } = res.locals.input.query;

    const resources = await this.resourcesService.findAll(
      resource_type_id,
      capacity,
    );

    res.json(resources);
  }

  async createResource(_req: Request, res: Response): Promise<void> {
    const { resource_type_id, name, description, floor, capacity } =
      res.locals.input.body;

    this.resourcesService.insert(
      resource_type_id,
      name,
      description,
      floor,
      capacity,
    );

    res.status(201).end();
  }

  async updateResource(_req: Request, res: Response): Promise<void> {
    const {
      resource_id,
      resource_type_id,
      name,
      description,
      floor,
      capacity,
    } = res.locals.input.body;

    await this.resourcesService.update(
      resource_id,
      resource_type_id,
      name,
      description,
      floor,
      capacity,
    );

    res.status(204).end();
  }

  async deleteResource(_req: Request, res: Response): Promise<void> {
    const { resource_id } = res.locals.input.params;

    await this.resourcesService.delete(resource_id);

    res.status(204).end();
  }
}
