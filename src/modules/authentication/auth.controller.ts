import type { Request, Response } from "express";
import { promisify } from "node:util";
import * as argon2 from "argon2";
import { UseMiddleware } from "../../shared/http/routing/registers.routing.js";
import { validateRequest } from "../../shared/http/middleware/validate-request.middleware.js";
import { requireAuth } from "./middlewares/require-auth.middleware.js";
import { AuthRepository } from "./auth.repository.js";
import {
  sessionCookieName,
  sessionCookieOptions,
} from "./middlewares/session.middleware.js";
import { loginRequestSchema, type LoginBody } from "./schemas/login.schema.js";
import { randomBytes } from "node:crypto";
import { HttpError } from "../../shared/http/errors/http-error.js";

const fallbackHash = await argon2.hash(randomBytes(32).toString("hex"));

export class AuthController {
  private readonly authRepository = new AuthRepository();

  @UseMiddleware(validateRequest(loginRequestSchema))
  async login(req: Request, res: Response): Promise<void> {
    const { email, password }: LoginBody = res.locals.input.body;
    const user = await this.authRepository.findUserForLogin(email);
    const passwordMatches = await argon2.verify(
      user?.password_hash ?? fallbackHash,
      password,
    );

    if (!user || !passwordMatches)
      throw new HttpError(401, "Invalid email or password.", ["body", "email"]);

    await promisify(req.session.regenerate).call(req.session);
    req.session.userId = user.id;
    req.session.role = user.role;
    await promisify(req.session.save).call(req.session);

    res.status(204).end();
  }

  @UseMiddleware(requireAuth)
  getCurrentSession(req: Request, res: Response): void {
    res.json({ id: req.session.userId });
  }

  async logout(req: Request, res: Response): Promise<void> {
    await promisify(req.session.destroy).call(req.session);
    res.clearCookie(sessionCookieName, sessionCookieOptions);
    res.status(204).end();
  }
}
