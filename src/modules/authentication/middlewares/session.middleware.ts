import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import type { Role } from "../enums/roles.enum.js";
import { pool } from "../../../db/postgres/pool.js";

declare module "express-session" {
  interface SessionData {
    user_id?: string;
    role?: Role;
  }
}

export const sessionCookieName = "booking.sid";
export const sessionCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
} as const;

const PgSessionStore = connectPgSimple(session);

export function createSessionMiddleware() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is required");

  return session({
    name: sessionCookieName,
    store: new PgSessionStore({ pool }),
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      ...sessionCookieOptions,
      maxAge: 60 * 60 * 1000,
    },
  });
}
