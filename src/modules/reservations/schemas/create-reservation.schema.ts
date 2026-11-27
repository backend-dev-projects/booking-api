import * as z from "zod";
import { positiveInt32Schema } from "../../../shared/validations/schemas/positive-integer.schema.js";
import { dateTimeSchema } from "../../../shared/validations/schemas/date-time.schema.js";
import {
  hasValidInterval,
  isWithinBookingHorizon,
  isWithinWorkingDays,
  isWithinWorkingHour,
  startsInFuture,
} from "../validation/reservation-date-rules.js";

const reservationCreateBodySchema = z
  .object({
    resource_id: positiveInt32Schema,
    requested_capacity: positiveInt32Schema.nullable(),
    requested_start: dateTimeSchema,
    requested_end: dateTimeSchema,
  })
  .refine(hasValidInterval, {
    path: ["requested_end"],
    message: "End time must be after start time.",
  })
  .refine(startsInFuture, {
    path: ["requested_start"],
    message: "Start time must be in the future.",
  })
  .refine(isWithinBookingHorizon, {
    path: ["requested_end"],
    message: "Reservation exceeds the booking horizon (1 year ahead).",
  })
  .refine(({ requested_start }) => isWithinWorkingHour(requested_start), {
    path: ["requested_start"],
    message: "Reservation start time must be between 08:00 and 22:00.",
  })
  .refine(({ requested_end }) => isWithinWorkingHour(requested_end), {
    path: ["requested_end"],
    message: "Reservation end time must be between 08:00 and 22:00.",
  })
  .refine(({ requested_start }) => isWithinWorkingDays(requested_start), {
    path: ["requested_start"],
    message: "Reservation start date must be a weekday (Monday to Friday).",
  })
  .refine(({ requested_end }) => isWithinWorkingDays(requested_end), {
    path: ["requested_end"],
    message: "Reservation end date must be a weekday (Monday to Friday).",
  });

export const reservationCreateRequestSchema = z.object({
  body: reservationCreateBodySchema,
});

export type ReservationCreateBody = z.infer<typeof reservationCreateBodySchema>;
