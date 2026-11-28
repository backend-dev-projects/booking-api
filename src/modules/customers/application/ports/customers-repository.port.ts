import type { Customer } from "../../domain/customer.model.js";

export interface CustomerRepositoryPort {
  findAll(): Promise<Customer[]>;
  findById(id_customer: string): Promise<Customer | undefined>;
  insert(
    full_name: string,
    email: string,
    password_hash: string,
  ): Promise<void>;
  update(
    id_customer: string,
    full_name?: string,
    password_hash?: string,
  ): Promise<void>;
  delete(id_customer: string): Promise<void>;
}
