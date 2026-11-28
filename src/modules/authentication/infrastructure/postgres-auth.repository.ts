import type { DbClient } from "../../../db/db-client.js";
import { database } from "../../../db/index.js";
import type { UserCredentials } from "../domain/auth.model.js";
import type { AuthRepositoryPort } from "../application/ports/auth-repository.port.js";

export class PostgresAuthRepository implements AuthRepositoryPort {
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
