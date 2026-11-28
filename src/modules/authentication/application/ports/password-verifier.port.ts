export interface PasswordVerifierPort {
  verify(hash: string, password: string): Promise<boolean>;
}
