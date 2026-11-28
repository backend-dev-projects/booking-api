import type { Role } from "./enums/roles.enum.js";

declare module "express-session" {
  interface SessionData {
    user_id?: string;
    role?: Role;
  }
}
