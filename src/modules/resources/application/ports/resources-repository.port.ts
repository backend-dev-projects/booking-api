import type { Resource } from "../../domain/resource.model.js";

export interface ResourcesRepositoryPort {
  filter(resource_type_id?: number, capacity?: number): Promise<Resource[]>;
  findById(resource_id: number): Promise<Resource | undefined>;
  findForUpdate(resource_id: number): Promise<Resource | undefined>;
  insert(
    resource_type_id: number,
    name: string,
    description: string,
    floor: number,
    capacity: number,
  ): Promise<void>;
  update(
    resource_id: number,
    resource_type_id?: number,
    name?: string,
    description?: string,
    floor?: number,
    capacity?: number,
  ): Promise<void>;
  delete(resource_id: number): Promise<void>;
}
