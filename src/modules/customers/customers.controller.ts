import type { Request, Response } from "express";
import * as argon2 from "argon2";
import { CustomersService } from "./customers.service.js";
import { UseMiddleware } from "../../shared/http/routing/registers.routing.js";
import { validateRequest } from "../../shared/http/middleware/validate-request.middleware.js";
import { createResourcesRequestSchema } from "./schemas/create-customer.schema.js";
import { updateCustomerRequestSchema } from "./schemas/update-customer.schema.js";
import { deleteCustomerRequestSchema } from "./schemas/delete-customer.schema.js";
import { requireAuthChanges } from "./middleware/auth-changes.middleware.js";

export class CustomersController {
  constructor(private readonly customerService = new CustomersService()) {}

  async listCustomers(_req: Request, res: Response): Promise<void> {
    const customers = await this.customerService.findAll();

    res.json(customers);
  }

  @UseMiddleware(validateRequest(createResourcesRequestSchema))
  async createCustomer(_req: Request, res: Response): Promise<void> {
    const { full_name, email, password } = res.locals.input.body;
    const password_hash = await argon2.hash(password);

    await this.customerService.insert(full_name, email, password_hash);

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

    await this.customerService.find(id_customer);

    await this.customerService.update(id_customer, full_name, password_hash);

    res.status(204).end();
  }

  @UseMiddleware(
    validateRequest(deleteCustomerRequestSchema),
    requireAuthChanges,
  )
  async deleteCustomer(_req: Request, res: Response): Promise<void> {
    const { id_customer: id_customer } = res.locals.input.params;

    await this.customerService.find(id_customer);

    await this.customerService.delete(id_customer);

    res.status(204).end();
  }
}
