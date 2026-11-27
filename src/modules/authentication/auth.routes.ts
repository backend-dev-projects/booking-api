import { Router } from "express";
import { Get, Post } from "../../shared/http/routing/registers.routing.js";
import { AuthController } from "./auth.controller.js";

export const publicAuthRouter = Router();
export const authRouter = Router();

const controller = new AuthController();

Post(publicAuthRouter, "/auth/login", controller, controller.login);
Get(authRouter, "/auth/me", controller, controller.getCurrentSession);
Post(authRouter, "/auth/logout", controller, controller.logout);
