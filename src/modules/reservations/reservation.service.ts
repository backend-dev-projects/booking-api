import { database } from "../../db/index.js";
import type { Database } from "../../db/db-client.js";
import {
  ResourceRepository,
  type Resource,
} from "../resources/resources.repository.js";
import { ReservationRepository } from "./reservation.repository.js";
import { HttpError } from "../../shared/http/errors/http-error.js";
import { BookingMode } from "../resources/enums/booking-mode.enum.js";
import { findPeakOccupancy } from "./availability/find-peak-occupancy.js";

export interface CreateReservationInput {
  user_id: string;
  resource_id: number;
  requested_capacity: number | null;
  requested_start: Date;
  requested_end: Date;
}

export class ReservationService {
  constructor(
    private readonly db: Database = database,
    private readonly reservationRepository: ReservationRepository = new ReservationRepository(),
  ) {}

  async create(input: CreateReservationInput) {
    const {
      user_id,
      resource_id,
      requested_capacity,
      requested_start,
      requested_end,
    } = input;

    await this.db.withTransaction(async (tx) => {
      const resourceRepository = new ResourceRepository(tx);
      const reservationRepository = new ReservationRepository(tx);

      const resource = await resourceRepository.findForUpdate(resource_id);

      this.validateResource(resource);

      this.validateRequestedCapacity(resource, requested_capacity);

      await this.validateAvailability(
        resource_id,
        requested_start,
        requested_end,
        requested_capacity!,
        resource,
      );

      await reservationRepository.insert({
        id: "",
        user_id,
        resource_id,
        reserved_capacity: this.getReservedCapacity(
          resource!,
          requested_capacity!,
        ),
        start_time: requested_start,
        end_time: requested_end,
      });
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
