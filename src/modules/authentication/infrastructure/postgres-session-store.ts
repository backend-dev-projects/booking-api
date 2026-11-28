import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import type { Pool } from "pg";

const PgSessionStore = connectPgSimple(session);

export function createPostgresSessionStore(pool: Pool): session.Store {
  return new PgSessionStore({ pool });
}
