import session, { type Store } from "express-session";

export const sessionCookieName = "booking.sid";

export const sessionCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
} as const;

export function createSessionMiddleware(store: Store) {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is required");
  }

  return session({
    name: sessionCookieName,
    store,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      ...sessionCookieOptions,
      maxAge: 60 * 60 * 1000,
    },
  });
}
