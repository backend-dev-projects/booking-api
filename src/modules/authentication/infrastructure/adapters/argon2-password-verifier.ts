import * as argon2 from "argon2";
import type { PasswordVerifierPort } from "../../application/ports/password-verifier.port.js";

export class Argon2PasswordVerifier implements PasswordVerifierPort {
  async verify(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
