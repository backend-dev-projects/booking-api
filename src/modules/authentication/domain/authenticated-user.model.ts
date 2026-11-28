import type { Role } from "./enums/roles.enum.js";

export interface AuthenticatedUser {
  id: string;
  role: Role;
}
