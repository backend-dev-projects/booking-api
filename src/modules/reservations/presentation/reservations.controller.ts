import type { Request, Response } from "express";
import type { ReservationService } from "../application/reservations.service.js";

export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  async createReservation(req: Request, res: Response): Promise<void> {
    const { resource_id, requested_capacity, requested_start, requested_end } =
      res.locals.input.body;
    const user_id = req.session.user_id ?? "";

    await this.reservationService.create(
      user_id,
      resource_id,
      requested_capacity,
      requested_start,
      requested_end,
    );

    res.status(201).end();
  }
}
