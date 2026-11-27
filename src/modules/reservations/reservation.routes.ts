import { Router } from "express";
import { ReservationController } from "./reservation.controller.js";
import {
  Delete,
  Get,
  Patch,
  Post,
} from "../../shared/http/routing/registers.routing.js";

export const reservationsRouter = Router();

const controller = new ReservationController();

Post(
  reservationsRouter,
  "/reservations",
  controller,
  controller.createReservation,
);
