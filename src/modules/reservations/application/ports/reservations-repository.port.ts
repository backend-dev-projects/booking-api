import type { Reservation } from "../../domain/reservations.model.js";

export interface ReservationRepositoryPort {
  findByStartTime(
    resource_id: number,
    requested_start: Date,
    requested_end: Date,
  ): Promise<Reservation[]>;

  findByEndTime(
    resource_id: number,
    requested_start: Date,
    requested_end: Date,
  ): Promise<Reservation[]>;

  insert(reservation: Reservation): Promise<void>;
}
