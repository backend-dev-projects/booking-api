import type { Resource } from "../domain/resource.model.js";
import type { ResourcesRepositoryPort } from "./ports/resources-repository.port.js";

export class ResourcesService {
  constructor(private readonly resourcesRepository: ResourcesRepositoryPort) {}

  async findAll(
    resource_type_id?: number,
    capacity?: number,
  ): Promise<Resource[]> {
    return await this.resourcesRepository.filter(resource_type_id, capacity);
  }

  async findById(resource_id: number): Promise<Resource | undefined> {
    return await this.resourcesRepository.findById(resource_id);
  }

  async insert(
    resource_type_id: number,
    name: string,
    description: string,
    floor: number,
    capacity: number,
  ) {
    await this.resourcesRepository.insert(
      resource_type_id,
      name,
      description,
      floor,
      capacity,
    );
  }

  async update(
    resource_id: number,
    resource_type_id?: number,
    name?: string,
    description?: string,
    floor?: number,
    capacity?: number,
  ) {
    await this.resourcesRepository.update(
      resource_id,
      resource_type_id,
      name,
      description,
      floor,
      capacity,
    );
  }

  async delete(resource_id: number) {
    await this.resourcesRepository.delete(resource_id);
  }
}
