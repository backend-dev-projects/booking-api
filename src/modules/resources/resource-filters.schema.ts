import * as z from "zod";

const queryDate = z.iso
  .datetime({ offset: true })
  .transform((value) => new Date(value))
  .pipe(z.date());

const resourceFiltersSchema = z
  .object({
    resource_type: z.string().trim().min(1),
    capacity: z
      .string()
      .regex(/^\d+$/, { error: "capacity must be a positive integer" })
      .refine(
        (value) => {
          const capacity = Number(value);
          return capacity > 0 && capacity <= 2_147_483_647;
        },
        { error: "capacity must be between 1 and 2147483647" },
      )
      .optional(),
    start_time: queryDate,
    end_time: queryDate,
  })
  .refine(({ start_time, end_time }) => end_time > start_time, {
    path: ["end_time"],
    error: "end_time must be after start_time",
  });

export const listResourcesRequestSchema = z.object({
  query: resourceFiltersSchema,
});

export type ResourceFilters = z.infer<typeof resourceFiltersSchema>;
