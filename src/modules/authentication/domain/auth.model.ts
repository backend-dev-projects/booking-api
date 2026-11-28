import type { Role } from "./enums/roles.enum.js";

export interface UserCredentials {
  id: string;
  password_hash: string;
  role: Role;
}
