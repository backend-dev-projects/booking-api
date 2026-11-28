import type { ResourceRepositoryPort } from "../../../resources/application/ports/resources-repository.port.js";
import type { ReservationRepositoryPort } from "./reservations-repository.port.js";

export interface ReservationTransaction {
  resources: ResourceRepositoryPort;
  reservations: ReservationRepositoryPort;
}

export interface ReservationUnitOfWork {
  withTransaction<T>(
    operation: (tx: ReservationTransaction) => Promise<T>,
  ): Promise<T>;
}
