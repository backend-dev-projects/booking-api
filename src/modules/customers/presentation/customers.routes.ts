import { Router } from "express";
import type { CustomerController } from "./customers.controller.js";
import { updateCustomerRequestSchema } from "./schemas/update-customer.schema.js";
import { validateRequest } from "../../../shared/presentation/middleware/validate-request.middleware.js";
import { createResourcesRequestSchema } from "./schemas/create-customer.schema.js";
import { deleteCustomerRequestSchema } from "./schemas/delete-customer.schema.js";
import { requireAuthChanges } from "./middleware/auth-changes.middleware.js";

export function registerPublicCustomerRouter(controller: CustomerController) {
  const router = Router();

  router.post(
    "/customers",
    validateRequest(createResourcesRequestSchema),
    controller.createCustomer,
  );

  return router;
}

export function registerPrivateCustomerRouter(controller: CustomerController) {
  const router = Router();

  router.get("/customers", controller.listCustomers);

  router.patch(
    "/customers/:customer_id",
    validateRequest(updateCustomerRequestSchema),
    requireAuthChanges,
    controller.updateCustomer,
  );

  router.delete(
    "/customers/:customer_id",
    validateRequest(deleteCustomerRequestSchema),
    requireAuthChanges,
    controller.deleteCustomer,
  );

  return router;
}
