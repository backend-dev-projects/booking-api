import { AuthRepository, type UserCredentials } from "./auth.repository.js";
import * as argon2 from "argon2";
import { randomBytes } from "node:crypto";
import { HttpError } from "../../shared/http/errors/http-error.js";

const fallbackHash = await argon2.hash(randomBytes(32).toString("hex"));

export class AuthService {
  constructor(private readonly authRepository = new AuthRepository()) {}

  async login(email: string, password: string): Promise<UserCredentials> {
    const user = await this.authRepository.findUserForLogin(email);
    const passwordMatches = await argon2.verify(
      user?.password_hash ?? fallbackHash,
      password,
    );

    if (!user || !passwordMatches)
      throw new HttpError(401, "Invalid email or password.", ["body", "email"]);

    return user;
  }
}
