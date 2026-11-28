import { ApplicationError } from "../../../shared/presentation/errors/application-error.js";
import { BookingMode } from "../../resources/domain/enums/booking-mode.enum.js";

export class Reservation {
  constructor(
    public user_id: string,
    public resource_id: number,
    public start_time: Date,
    public end_time: Date,
    public requested_capacity: number,
    public booking_mode: BookingMode,
    public resource_capacity: number,
  ) {}

  get reserved_capacity() {
    if (this.booking_mode === BookingMode.EXCLUSIVE) {
      return this.resource_capacity;
    }

    return this.requested_capacity;
  }

  validateReservationCapacity(
    occupied_capacity: number,
    resource_capacity: number,
  ): { exceeds: boolean; application_error?: ApplicationError } {
    switch (this.booking_mode) {
      case BookingMode.EXCLUSIVE:
        if (occupied_capacity !== 0) {
          return {
            exceeds: true,
            application_error: new ApplicationError(
              409,
              "Resource is already booked for part of the requested time.",
              ["body", "requested_start", "requested_end"],
            ),
          };
        }
        break;
      case BookingMode.SHARED:
        if (this.requested_capacity > resource_capacity - occupied_capacity) {
          return {
            exceeds: true,
            application_error: new ApplicationError(
              409,
              "Insufficient capacity.",
              ["body", "requested_capacity"],
            ),
          };
        }
        break;

      default:
        throw new ApplicationError(400, "Unsupported booking mode.", [
          "body",
          "booking_mode",
        ]);
    }
    return {
      exceeds: false,
    };
  }
}
