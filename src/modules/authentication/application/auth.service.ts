import type { AuthRepositoryPort } from "./ports/auth-repository.port.js";
import type { PasswordVerifierPort } from "./ports/password-verifier.port.js";
import { ApplicationError } from "../../../shared/application/errors/application-error.js";
import type { AuthenticatedUser } from "../domain/authenticated-user.model.js";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepositoryPort,
    private readonly passwordVerifier: PasswordVerifierPort,
  ) {}

  async login(email: string, password: string): Promise<AuthenticatedUser> {
    const user = await this.authRepository.findUserForLogin(email);

    if (!user)
      throw new ApplicationError(401, "Invalid email or password.", ["email"]);

    const passwordMatches = await this.passwordVerifier.verify(
      user.password_hash,
      password,
    );

    if (!passwordMatches)
      throw new ApplicationError(401, "Invalid email or password.", ["email"]);

    return {
      id: user.id,
      role: user.role,
    };
  }
}
