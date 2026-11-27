import type { Request, Response } from "express";
import * as argon2 from "argon2";
import { CustomerRepository } from "./customers.repository.js";
import { lookupConstraintError } from "../../db/postgres/errors.js";
import { UseMiddleware } from "../../shared/http/routing/registers.routing.js";
import { validateRequest } from "../../shared/http/middleware/validate-request.middleware.js";
import { createResourcesRequestSchema } from "./schemas/create-customer.schema.js";
import { customerWriteErrors } from "./errors/customer-write.error.js";
import { updateCustomerRequestSchema } from "./schemas/update-customer.schema.js";
import { deleteCustomerRequestSchema } from "./schemas/delete-customer.schema.js";
import { customerDeleteErrors } from "./errors/customer-delete.error.js";
import { requireAuthChanges } from "./middleware/auth-changes.middleware.js";
import { HttpError } from "../../shared/http/errors/http-error.js";

export class CustomersController {
  private readonly customerRepository = new CustomerRepository();

  async listCustomers(_req: Request, res: Response): Promise<void> {
    const customers = await this.customerRepository.findAll();

    res.json(customers);
  }

  @UseMiddleware(validateRequest(createResourcesRequestSchema))
  async createCustomer(_req: Request, res: Response): Promise<void> {
    try {
      const { full_name, email, password } = res.locals.input.body;
      const password_hash = await argon2.hash(password);

      await this.customerRepository.insert({ full_name, email, password_hash });
    } catch (error: unknown) {
      const response = lookupConstraintError(error, customerWriteErrors);

      if (!response) {
        throw error;
      }

      throw new HttpError(
        response.status,
        response.issues[0]!.message,
        response.issues[0]!.path,
      );
    }

    res.status(201).end();
  }

  @UseMiddleware(
    validateRequest(updateCustomerRequestSchema),
    requireAuthChanges,
  )
  async updateCustomer(_req: Request, res: Response): Promise<void> {
    _req.session;
    const { id_customer: id_customer } = res.locals.input.params;
    const { full_name, password } = res.locals.input.body;
    const password_hash =
      password === undefined ? undefined : await argon2.hash(password);

    const response = await this.customerRepository.find(id_customer);

    if (!response) {
      throw new HttpError(404, "There is no matching customer.", [
        "params",
        "id_customer",
      ]);
    }

    await this.customerRepository.update(id_customer, {
      full_name,
      password_hash,
    });

    res.status(204).end();
  }

  @UseMiddleware(
    validateRequest(deleteCustomerRequestSchema),
    requireAuthChanges,
  )
  async deleteCustomer(_req: Request, res: Response): Promise<void> {
    const { id_customer: id_customer } = res.locals.input.params;

    const response = await this.customerRepository.find(id_customer);

    if (!response) {
      throw new HttpError(404, "There is no matching customer.", [
        "params",
        "id_customer",
      ]);
    }

    try {
      await this.customerRepository.delete(id_customer);
    } catch (error: unknown) {
      const response = lookupConstraintError(error, customerDeleteErrors);

      if (!response) {
        throw error;
      }

      throw new HttpError(
        response.status,
        response.issues[0]!.message,
        response.issues[0]!.path,
      );
    }

    res.status(204).end();
  }
}
