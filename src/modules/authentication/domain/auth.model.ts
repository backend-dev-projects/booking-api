import type { Role } from "./enums/roles.enum.js";
import * as argon2 from "argon2";

export class UserCredentials {
  constructor(
    public readonly id: string,
    public readonly password_hash: string,
    public readonly role: Role,
  ) {}

  async verifyPassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password_hash, password);
  }
}
