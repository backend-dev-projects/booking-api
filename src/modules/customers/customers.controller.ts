import type { Request, Response } from "express";
import * as argon2 from "argon2";
import {
  deleteCustomer,
  findAllCustomers,
  findCustomer,
  insertCustomer,
  updateCustomer,
} from "./customers.repository.js";
import { lookupConstraintError } from "../../db/errors.js";
import { UseMiddleware } from "../../shared/http/routing/registers.routing.js";
import { validateRequest } from "../../shared/http/middleware/validate-request.middleware.js";
import { createResourcesRequestSchema } from "./schemas/create-customer.schema.js";
import { customerWriteErrors } from "./errors/customer-write.error.js";
import { updateCustomerRequestSchema } from "./schemas/update-customer.schema.js";
import { deleteCustomerRequestSchema } from "./schemas/delete-customer.schema.js";
import { customerDeleteErrors } from "./errors/customer-delete.error.js";

export class CustomersController {
  async listCustomers(_req: Request, res: Response): Promise<void> {
    const customers = await findAllCustomers();

    res.json(customers);
  }

  @UseMiddleware(validateRequest(createResourcesRequestSchema))
  async createCustomer(_req: Request, res: Response): Promise<void> {
    try {
      const { full_name, email, password } = res.locals.input.body;
      const password_hash = await argon2.hash(password);

      await insertCustomer({ full_name, email, password_hash });
      res.status(201).end();
    } catch (error: unknown) {
      const response = lookupConstraintError(error, customerWriteErrors);

      if (!response) {
        throw error;
      }

      res.status(response.status).json({ issues: [response.issue] });
    }
  }

  @UseMiddleware(validateRequest(updateCustomerRequestSchema))
  async updateCustomer(_req: Request, res: Response): Promise<void> {
    const { id_customer: id_customer } = res.locals.input.params;
    const { full_name, password } = res.locals.input.body;
    const password_hash =
      password === undefined ? undefined : await argon2.hash(password);

    const response = await findCustomer(id_customer);

    if (!response) {
      res
        .status(404)
        .json({ issues: { message: "There is no matching customer" } });
      return;
    }

    await updateCustomer(id_customer, { full_name, password_hash });
    res.status(204).end();
  }

  @UseMiddleware(validateRequest(deleteCustomerRequestSchema))
  async deleteCustomer(_req: Request, res: Response): Promise<void> {
    const { id_customer: id_customer } = res.locals.input.params;

    const response = await findCustomer(id_customer);

    if (!response) {
      res
        .status(404)
        .json({ issues: { message: "There is no matching customer" } });
      return;
    }

    try {
      await deleteCustomer(id_customer);
      res.status(204).end();
    } catch (error: unknown) {
      const response = lookupConstraintError(error, customerDeleteErrors);

      if (!response) {
        throw error;
      }

      res.status(response.status).json({ issues: [response.issue] });
    }
  }
}
