import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validateRequest } from "../../../shared/presentation/middleware/validate-request.middleware.js";
import { loginRequestSchema } from "./schemas/login.schema.js";
import { requireAuth } from "./middlewares/require-auth.middleware.js";

export function registerPublicAuthRouter(controller: AuthController) {
  const router = Router();

  router.post(
    "/auth/login",
    validateRequest(loginRequestSchema),
    controller.login,
  );

  return router;
}

export function registerPrivateAuthRouter(controller: AuthController) {
  const router = Router();

  router.get("/auth/me", requireAuth, controller.getCurrentSession);

  router.post("/auth/logout", requireAuth, controller.logout);

  return router;
}
