import { DatabaseError } from "pg";

export type ConstraintErrorKey = `${string}:${string}`;

export function lookupConstraintError<T>(
  error: unknown,
  mapping: ReadonlyMap<ConstraintErrorKey, T>,
): T | undefined {
  if (!(error instanceof DatabaseError) || !error.code || !error.constraint) {
    return undefined;
  }

  return mapping.get(`${error.code}:${error.constraint}`);
}
