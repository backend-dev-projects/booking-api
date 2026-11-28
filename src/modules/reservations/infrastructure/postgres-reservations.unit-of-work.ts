import type { Database } from "../../../db/db-client.js";
import { PostgresResourceRepository } from "../../resources/infrastructure/postgres-resources.repository.js";
import type {
  ReservationTransaction,
  ReservationUnitOfWork,
} from "../application/ports/reservations-unit-of-work.port.js";
import { PostgresReservationRepository } from "./postgres-reservations.repository.js";

export class PostgresReservationUnitOfWork implements ReservationUnitOfWork {
  constructor(private readonly db: Database) {}

  async withTransaction<T>(
    operation: (tx: ReservationTransaction) => Promise<T>,
  ): Promise<T> {
    return this.db.withTransaction(async (client) => {
      const tx: ReservationTransaction = {
        resources: new PostgresResourceRepository(client),
        reservations: new PostgresReservationRepository(client),
      };

      return operation(tx);
    });
  }
}
