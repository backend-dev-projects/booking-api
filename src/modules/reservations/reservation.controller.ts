import type { Request, Response } from "express";
import { UseMiddleware } from "../../shared/http/routing/registers.routing.js";
import { validateRequest } from "../../shared/http/middleware/validate-request.middleware.js";
import { reservationCreateRequestSchema } from "./schemas/create-reservation.schema.js";
import { ReservationService } from "./reservation.service.js";

export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService = new ReservationService(),
  ) {}

  @UseMiddleware(validateRequest(reservationCreateRequestSchema))
  async createReservation(req: Request, res: Response): Promise<void> {
    const { resource_id, requested_capacity, requested_start, requested_end } =
      res.locals.input.body;
    const user_id = req.session.userId ?? "";

    await this.reservationService.create({
      user_id,
      resource_id,
      requested_capacity,
      requested_start,
      requested_end,
    });

    res.status(201).end();
  }
}
