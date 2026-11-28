import * as argon2 from "argon2";
import { randomBytes } from "node:crypto";
import type { AuthRepositoryPort } from "./ports/auth-repository.port.js";
import type { UserCredentials } from "../domain/auth.model.js";
import { ApplicationError } from "../../../shared/presentation/errors/application-error.js";

const fallbackHash = await argon2.hash(randomBytes(32).toString("hex"));

export class AuthService {
  constructor(private readonly authRepository: AuthRepositoryPort) {}

  async login(email: string, password: string): Promise<UserCredentials> {
    const user = await this.authRepository.findUserForLogin(email);
    const passwordMatches = await argon2.verify(
      user?.password_hash ?? fallbackHash,
      password,
    );

    if (!user || !passwordMatches)
      throw new ApplicationError(401, "Invalid email or password.", [
        "body",
        "email",
      ]);

    return user;
  }
}
