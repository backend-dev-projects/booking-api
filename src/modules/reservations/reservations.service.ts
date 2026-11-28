import { database } from "../../db/index.js";
import type { Database } from "../../db/db-client.js";
import { HttpError } from "../../shared/presentation/errors/application-error.js";
import { BookingMode } from "../resources/domain/enums/booking-mode.enum.js";
import { findPeakOccupancy } from "./availability/find-peak-occupancy.js";
import { ReservationsRepository } from "./reservations.repository.js";
import { ResourcesRepository } from "../resources/infrastructure/postgres-resources.repository.js";
import type { Resource } from "../resources/domain/resource.model.js";
import type { Reservation } from "./reservations.types.js";

export class ReservationService {
  constructor(
    private readonly db: Database = database,
    private readonly reservationRepository: ReservationsRepository = new ReservationsRepository(),
  ) {}

  async create(reservation: Reservation) {
    await this.db.withTransaction(async (tx) => {
      const resourceRepository = new ResourcesRepository(tx);
      const reservationRepository = new ReservationsRepository(tx);

      const resource = await resourceRepository.findForUpdate(
        reservation.resource_id,
      );

      this.validateResource(resource);

      this.validateRequestedCapacity(resource, reservation.reserved_capacity);

      await this.validateAvailability(
        reservation.resource_id,
        reservation.start_time,
        reservation.end_time,
        reservation.reserved_capacity,
        resource,
      );

      reservation.reserved_capacity = this.getReservedCapacity(
        resource!,
        reservation.reserved_capacity,
      );

      await reservationRepository.insert(reservation);
    });
  }

  async update() {}

  private async validateAvailability(
    resource_id: number,
    requested_start: Date,
    requested_end: Date,
    requested_capacity: number,
    resource: Resource | undefined,
  ) {
    const starts = await this.reservationRepository.findByStartTime(
      resource_id,
      requested_start,
      requested_end,
    );

    const ends = await this.reservationRepository.findByEndTime(
      resource_id,
      requested_start,
      requested_end,
    );

    const occupied_capacity = findPeakOccupancy(
      starts.map((reservation) => ({
        reserved_capacity: reservation.reserved_capacity,
        time: reservation.start_time,
      })),
      ends.map((reservation) => ({
        reserved_capacity: reservation.reserved_capacity,
        time: reservation.end_time,
      })),
    );

    if (resource!.booking_mode === BookingMode.EXCLUSIVE) {
      if (occupied_capacity > 0) {
        throw new HttpError(
          409,
          "Resource is already booked for part of the requested time.",
          ["body", "requested_start", "requested_end"],
        );
      }
    }

    if (resource!.booking_mode === BookingMode.SHARED) {
      if (requested_capacity > resource!.capacity - occupied_capacity) {
        throw new HttpError(409, "Insufficient capacity.", [
          "body",
          "requested_capacity",
        ]);
      }
    }
  }

  private validateRequestedCapacity(
    resource: Resource | undefined,
    requested_capacity: number | null,
  ) {
    if (requested_capacity && requested_capacity > resource!.capacity) {
      throw new HttpError(
        422,
        "Requested capacity exceeds resource capacity.",
        ["body", "requested_capacity"],
      );
    }

    if (resource!.booking_mode === BookingMode.EXCLUSIVE) {
      if (requested_capacity !== null) {
        throw new HttpError(
          422,
          "Capacity must not be specified for exclusive resources.",
          ["body", "requested_capacity"],
        );
      }
    } else if (resource!.booking_mode === BookingMode.SHARED) {
      if (requested_capacity === null) {
        throw new HttpError(422, "Capacity is required for shared resources.", [
          "body",
          "requested_capacity",
        ]);
      }
    } else {
      throw new Error("Unsupported booking mode.");
    }
  }

  private validateResource(resource: Resource | undefined) {
    if (!resource) {
      throw new HttpError(404, "Resource not found.", [
        "params",
        "resource_id",
      ]);
    }
  }

  private getReservedCapacity(
    resource: Resource,
    requested_capacity: number,
  ): number {
    if (resource.booking_mode === BookingMode.EXCLUSIVE) {
      return resource.capacity;
    }

    if (resource.booking_mode === BookingMode.SHARED) {
      return requested_capacity;
    }

    throw new Error("Unsupported booking mode.");
  }
}
