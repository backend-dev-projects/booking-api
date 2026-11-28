import type { UserCredentials } from "../../domain/auth.model.js";

export interface AuthRepositoryPort {
  findUserForLogin(email: string): Promise<UserCredentials | undefined>;
}
