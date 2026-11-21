import * as z from "zod";

export const dateTimeSchema = z.iso
  .datetime({ offset: true })
  .transform((value) => new Date(value))
  .pipe(z.date());
