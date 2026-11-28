import type { Request, Response } from "express";
import * as argon2 from "argon2";
import { CustomerService } from "../application/customers.service.js";

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  async listCustomers(_req: Request, res: Response): Promise<void> {
    const customers = await this.customerService.findAll();

    res.json(customers);
  }

  async createCustomer(_req: Request, res: Response): Promise<void> {
    const { full_name, email, password } = res.locals.input.body;
    const password_hash = await argon2.hash(password);

    await this.customerService.insert(full_name, email, password_hash);

    res.status(201).end();
  }

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

  async deleteCustomer(_req: Request, res: Response): Promise<void> {
    const { id_customer: id_customer } = res.locals.input.params;

    await this.customerService.find(id_customer);

    await this.customerService.delete(id_customer);

    res.status(204).end();
  }
}
