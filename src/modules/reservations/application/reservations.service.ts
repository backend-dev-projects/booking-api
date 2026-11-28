import { ApplicationError } from "../../../shared/presentation/errors/application-error.js";
import type { Resource } from "../../resources/domain/resource.model.js";
import { findPeakOccupancy } from "../domain/find-peak-occupancy.js";
import { Reservation } from "../domain/reservations.model.js";
import type { ReservationRepositoryPort } from "./ports/reservations-repository.port.js";
import type { ReservationUnitOfWork } from "./ports/reservations-unit-of-work.port.js";

export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepositoryPort,
    private readonly reservationUnitOfWork: ReservationUnitOfWork,
  ) {}

  async create(
    user_id: string,
    resource_id: number,
    requested_capacity: number,
    requested_start: Date,
    requested_end: Date,
  ) {
    await this.reservationUnitOfWork.withTransaction(async (tx) => {
      const resourceRepository = tx.resources;
      const reservationRepository = tx.reservations;

      const resource = await resourceRepository.findForUpdate(resource_id);

      this.validateResource(resource);

      const reservation = new Reservation(
        user_id,
        resource_id,
        requested_start,
        requested_end,
        requested_capacity,
        resource!.booking_mode,
        resource!.capacity,
      );

      await this.validateAvailability(reservation, resource!);

      await reservationRepository.insert(reservation);
    });
  }

  async update() {}

  private validateResource(resource: Resource | undefined) {
    if (!resource) {
      throw new ApplicationError(404, "Resource not found.", [
        "params",
        "resource_id",
      ]);
    }
  }

  private async validateAvailability(
    reservation: Reservation,
    resource: Resource,
  ) {
    const starts = await this.reservationRepository.findByStartTime(
      reservation.resource_id,
      reservation.start_time,
      reservation.end_time,
    );

    const ends = await this.reservationRepository.findByEndTime(
      reservation.resource_id,
      reservation.start_time,
      reservation.end_time,
    );

    const occupied_capacity = findPeakOccupancy(
      starts.map((reservation) => ({
        reserved_capacity: reservation.requested_capacity,
        time: reservation.start_time,
      })),
      ends.map((reservation) => ({
        reserved_capacity: reservation.requested_capacity,
        time: reservation.end_time,
      })),
    );

    const canReserve = reservation.validateReservationCapacity(
      occupied_capacity,
      resource.capacity,
    );

    if (canReserve.exceeds) {
      throw canReserve.application_error!;
    }
  }
}
