import type { Customer } from "../../domain/customer.model.js";

export interface CustomerRepositoryPort {
  findAll(): Promise<Customer[]>;
  findById(customer_id: string): Promise<Customer | undefined>;
  insert(
    full_name: string,
    email: string,
    password_hash: string,
  ): Promise<void>;
  update(
    customer_id: string,
    full_name?: string,
    password_hash?: string,
  ): Promise<void>;
  delete(customer_id: string): Promise<void>;
}
