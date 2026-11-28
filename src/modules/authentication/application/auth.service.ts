import type { AuthRepositoryPort } from "./ports/auth-repository.port.js";
import type { UserCredentials } from "../domain/auth.model.js";
import { ApplicationError } from "../../../shared/presentation/errors/application-error.js";

export class AuthService {
  constructor(private readonly authRepository: AuthRepositoryPort) {}

  async login(email: string, password: string): Promise<UserCredentials> {
    const user = await this.authRepository.findUserForLogin(email);

    if (!user)
      throw new ApplicationError(401, "Invalid email.", ["body", "email"]);

    const passwordMatches = await user.verifyPassword(password);

    if (!passwordMatches)
      throw new ApplicationError(401, "Invalid password.", [
        "body",
        "password",
      ]);

    return user;
  }
}
