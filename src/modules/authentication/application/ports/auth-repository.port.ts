import type { UserCredentials } from "../../domain/user-credentials.model.js";

export interface AuthRepositoryPort {
  findUserForLogin(email: string): Promise<UserCredentials | undefined>;
}
