import { CustomerRepository, type Customer } from "./customers.repository.js";
import { lookupConstraintError } from "../../db/postgres/errors.js";
import { customerWriteErrors } from "./errors/customer-write.error.js";
import { customerDeleteErrors } from "./errors/customer-delete.error.js";
import { HttpError } from "../../shared/http/errors/http-error.js";

export class CustomersService {
  constructor(private readonly customerRepository = new CustomerRepository()) {}

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.findAll();
  }

  async find(id_customer: string): Promise<Customer> {
    const response = await this.customerRepository.find(id_customer);

    if (!response) {
      throw new HttpError(404, "There is no matching customer.", [
        "params",
        "id_customer",
      ]);
    }

    return response;
  }

  async insert(full_name: string, email: string, password_hash: string) {
    try {
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
  }

  async update(
    id_customer: string,
    full_name?: string,
    password_hash?: string,
  ) {
    try {
      await this.customerRepository.update(id_customer, {
        full_name,
        password_hash,
      });
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
  }

  async delete(id_customer: string) {
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
  }
}
