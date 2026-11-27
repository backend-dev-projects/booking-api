import type { DbClient } from "../../db/db-client.js";
import { database } from "../../db/index.js";
import type { Role } from "./enums/roles.enum.js";

interface UserCredentials {
  id: string;
  password_hash: string;
  role: Role;
}

export class AuthRepository {
  constructor(private readonly db: DbClient = database) {}

  async findUserForLogin(email: string): Promise<UserCredentials | undefined> {
    const result = await this.db.query<UserCredentials>(
      `
      SELECT id, password_hash, role
        FROM users
       WHERE email = $1
    `,
      [email],
    );

    return result.rows[0];
  }
}
