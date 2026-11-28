import type { RequestHandler } from "express";
import { ApplicationError } from "../../../../shared/presentation/errors/application-error.js";
import type { ResourceService } from "../../../resources/application/resources.service.js";
import { BookingMode } from "../../../resources/domain/enums/booking-mode.enum.js";

export function validateRequestedCapacity(
  resourceService: ResourceService,
): RequestHandler {
  return async (req, res, next) => {
    const { resource_id, requested_capacity } = res.locals.input.body;

    const resource = await resourceService.findById(Number(resource_id));

    switch (resource!.booking_mode) {
      case BookingMode.EXCLUSIVE:
        if (requested_capacity !== null) {
          throw new ApplicationError(
            422,
            "Capacity must not be specified for exclusive resources.",
            ["body", "requested_capacity"],
          );
        }
        break;
      case BookingMode.SHARED:
        if (requested_capacity === null) {
          throw new ApplicationError(
            422,
            "Capacity is required for shared resources.",
            ["body", "requested_capacity"],
          );
        }
        break;
      default:
        throw new Error("Unsupported booking mode.");
    }

    next();
  };
}
