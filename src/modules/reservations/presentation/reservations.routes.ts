import { Router } from "express";
import { validateRequest } from "../../../shared/presentation/middleware/validate-request.middleware.js";
import { reservationCreateRequestSchema } from "./schemas/create-reservation.schema.js";
import type { ReservationController } from "./reservations.controller.js";

export function registerPrivateReservationRouter(
  controller: ReservationController,
) {
  const router = Router();

  router.post(
    "/reservations",
    validateRequest(reservationCreateRequestSchema),
    controller.createReservation,
  );

  return router;
}
