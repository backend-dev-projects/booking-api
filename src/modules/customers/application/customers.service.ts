import { ApplicationError } from "../../../shared/presentation/errors/application-error.js";
import type { Customer } from "../domain/customer.model.js";
import type { CustomerRepositoryPort } from "./ports/customers-repository.port.js";

export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.findAll();
  }

  async find(id_customer: string): Promise<Customer> {
    const response = await this.customerRepository.findById(id_customer);

    if (!response) {
      throw new ApplicationError(404, "There is no matching customer.", [
        "params",
        "id_customer",
      ]);
    }

    return response;
  }

  async insert(full_name: string, email: string, password_hash: string) {
    await this.customerRepository.insert(full_name, email, password_hash);
  }

  async update(
    id_customer: string,
    full_name?: string,
    password_hash?: string,
  ) {
    await this.find(id_customer);
    await this.customerRepository.update(id_customer, full_name, password_hash);
  }

  async delete(id_customer: string) {
    await this.find(id_customer);
    await this.customerRepository.delete(id_customer);
  }
}
