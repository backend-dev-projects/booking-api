import type { DbClient } from "../../../db/db-client.js";
import { database } from "../../../db/index.js";
import type { Reservation } from "../domain/reservations.model.js";
import type { ReservationRepositoryPort } from "../application/ports/reservations-repository.port.js";

export class PostgresReservationRepository implements ReservationRepositoryPort {
  constructor(private readonly db: DbClient = database) {}

  async findByStartTime(
    resource_id: number,
    requested_start: Date,
    requested_end: Date,
  ): Promise<Reservation[]> {
    const result = await this.db.query<Reservation>(
      `
      SELECT user_id, resource_id, start_time, end_time, reserved_capacity
           FROM reservations
        WHERE   resource_id = $1 
            AND (status = 'CONFIRMED' OR status = 'PENDING')
            AND start_time < $3
            AND end_time > $2
        ORDER   BY start_time;
    `,
      [resource_id, requested_start, requested_end],
    );

    return result.rows;
  }

  async findByEndTime(
    resource_id: number,
    requested_start: Date,
    requested_end: Date,
  ): Promise<Reservation[]> {
    const result = await this.db.query<Reservation>(
      `
      SELECT user_id, resource_id, 
             start_time, end_time, reserved_capacity
           FROM public.reservations
        WHERE   resource_id = $1
            AND (status = 'CONFIRMED' OR status = 'PENDING')
            AND start_time < $3
            AND end_time > $2
        ORDER   BY end_time;
    `,
      [resource_id, requested_start, requested_end],
    );

    return result.rows;
  }

  async insert(reservation: Reservation) {
    await this.db.query(
      `
    INSERT INTO reservations(
	          user_id, resource_id, reserved_capacity, 
            start_time, end_time, status)
	    VALUES ($1, $2, $3, $4, $5, $6);
    `,
      [
        reservation.user_id,
        reservation.resource_id,
        reservation.reserved_capacity,
        reservation.start_time,
        reservation.end_time,
        "PENDING",
      ],
    );
  }
}
