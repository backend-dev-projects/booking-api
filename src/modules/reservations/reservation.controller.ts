import type { Request, Response } from "express";
import { UseMiddleware } from "../../shared/http/routing/registers.routing.js";
import { validateRequest } from "../../shared/http/middleware/validate-request.middleware.js";
import { reservationCreateRequestSchema } from "./schemas/create-reservation.schema.js";
import { ReservationRepository } from "./reservation.repository.js";
import {
  ResourceRepository,
  type Resource,
} from "../resources/resources.repository.js";
import { findPeakOccupancy } from "./availability/find-peak-occupancy.js";
import { BookingMode } from "../resources/enums/booking-mode.enum.js";
import type { Database } from "../../db/db-client.js";
import { database } from "../../db/index.js";
import { HttpError } from "../../shared/http/errors/http-error.js";

export class ReservationController {
  constructor(
    private readonly db: Database = database,
    private readonly reservationRepository: ReservationRepository = new ReservationRepository(),
    private readonly resourceRepository: ResourceRepository = new ResourceRepository(),
  ) {}

  @UseMiddleware(validateRequest(reservationCreateRequestSchema))
  async createReservation(req: Request, res: Response): Promise<void> {
    const { resource_id, requested_capacity, requested_start, requested_end } =
      res.locals.input.body;

    let reserved_capacity: number;

    const user_id = req.session.userId ?? "";

    await this.db.withTransaction(async (tx) => {
      const resourceRepository = new ResourceRepository(tx);
      const reservationRepository = new ReservationRepository(tx);

      const resource = await resourceRepository.findForUpdate(resource_id);

      this.validateReservation(resource, requested_capacity);

      const reservations_start_time =
        await reservationRepository.findByStartTime(
          resource_id,
          requested_start,
          requested_end,
        );

      const reservations_end_time = await reservationRepository.findByEndTime(
        resource_id,
        requested_start,
        requested_end,
      );

      const occupied_capacity = findPeakOccupancy(
        reservations_start_time.map((reservation) => ({
          reserved_capacity: reservation.reserved_capacity,
          time: reservation.start_time,
        })),
        reservations_end_time.map((reservation) => ({
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

        reserved_capacity = resource!.capacity;
      }

      if (resource!.booking_mode === BookingMode.SHARED) {
        if (requested_capacity > resource!.capacity - occupied_capacity) {
          throw new HttpError(409, "Insufficient capacity.", [
            "body",
            "requested_capacity",
          ]);
        }

        reserved_capacity = requested_capacity;
      }

      await reservationRepository.insert({
        id: "",
        user_id,
        resource_id,
        reserved_capacity,
        start_time: requested_start,
        end_time: requested_end,
      });
    });

    res.status(201).end();
  }

  private validateReservation(
    resource: Resource | undefined,
    requested_capacity: number,
  ) {
    if (!resource) {
      throw new HttpError(404, "Resource not found.", [
        "params",
        "resource_id",
      ]);
    }

    if (requested_capacity > resource.capacity) {
      throw new HttpError(
        422,
        "Requested capacity exceeds resource capacity.",
        ["body", "requested_capacity"],
      );
    }

    if (resource.booking_mode === BookingMode.EXCLUSIVE) {
      if (requested_capacity !== null) {
        throw new HttpError(
          422,
          "Capacity must not be specified for exclusive resources.",
          ["body", "requested_capacity"],
        );
      }
    } else if (resource.booking_mode === BookingMode.SHARED) {
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
}
