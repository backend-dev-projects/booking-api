import type { Request, Response } from "express";
import { promisify } from "node:util";
import { UseMiddleware } from "../../shared/http/routing/registers.routing.js";
import { validateRequest } from "../../shared/presentation/middleware/validate-request.middleware.js";
import { requireAuth } from "./middlewares/require-auth.middleware.js";
import {
  sessionCookieName,
  sessionCookieOptions,
} from "./middlewares/session.middleware.js";
import { loginRequestSchema, type LoginBody } from "./schemas/login.schema.js";
import { AuthService } from "./auth.service.js";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  @UseMiddleware(validateRequest(loginRequestSchema))
  async login(req: Request, res: Response): Promise<void> {
    const { email, password }: LoginBody = res.locals.input.body;

    const user = await this.authService.login(email, password);

    await promisify(req.session.regenerate).call(req.session);

    req.session.user_id = user.id;
    req.session.role = user.role;

    await promisify(req.session.save).call(req.session);

    res.status(204).end();
  }

  @UseMiddleware(requireAuth)
  getCurrentSession(req: Request, res: Response): void {
    res.json({ id: req.session.user_id });
  }

  async logout(req: Request, res: Response): Promise<void> {
    await promisify(req.session.destroy).call(req.session);
    res.clearCookie(sessionCookieName, sessionCookieOptions);
    res.status(204).end();
  }
}
