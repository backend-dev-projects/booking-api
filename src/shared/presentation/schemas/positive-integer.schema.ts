import * as z from "zod";

export const positiveInt32Schema = z.number().int().min(1).max(2_147_483_647);
