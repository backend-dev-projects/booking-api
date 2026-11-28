import type { DbClient } from "../../../db/db-client.js";
import { database } from "../../../db/index.js";
import { lookupConstraintError } from "../../../db/postgres/errors.js";
import { ApplicationError } from "../../../shared/presentation/errors/application-error.js";
import type { CustomerRepositoryPort } from "../application/ports/customer-repository.port.js";
import type { Customer } from "../domain/customer.model.js";
import { customerDeleteErrors } from "./postgres-errors/customer-delete.error.js";
import { customerWriteErrors } from "./postgres-errors/customer-write.error.js";

export class PostgresCustomerRepository implements CustomerRepositoryPort {
  constructor(private readonly db: DbClient = database) {}

  async findAll(): Promise<Customer[]> {
    const result = await this.db.query<Customer>(
      `
    SELECT id, full_name, email
	    FROM users
     ORDER BY id
  `,
    );

    return result.rows;
  }

  async findById(id_customer: string): Promise<Customer | undefined> {
    const result = await this.db.query<Customer>(
      `
      SELECT id, full_name, email
	      FROM users
       WHERE id=$1
    `,
      [id_customer],
    );

    return result.rows[0];
  }

  async insert(
    full_name: string,
    email: string,
    password_hash: string,
  ): Promise<void> {
    try {
      await this.db.query(
        `
      INSERT INTO users(full_name, email, password_hash)
             VALUES ($1, $2, $3);
    `,
        [full_name, email, password_hash],
      );
    } catch (error) {
      const response = lookupConstraintError(error, customerWriteErrors);

      if (!response) {
        throw error;
      }

      throw new ApplicationError(
        response.status,
        response.issues[0]!.message,
        response.issues[0]!.path,
      );
    }
  }

  async update(
    id_customer: string,
    full_name: string | undefined,
    password_hash: string | undefined,
  ): Promise<void> {
    try {
      await this.db.query(
        `
      UPDATE users
	       SET full_name     = COALESCE($1, full_name),
             password_hash = COALESCE($2, password_hash)
	     WHERE id=$3
  `,
        [full_name, password_hash, id_customer],
      );
    } catch (error) {
      const response = lookupConstraintError(error, customerWriteErrors);

      if (!response) {
        throw error;
      }

      throw new ApplicationError(
        response.status,
        response.issues[0]!.message,
        response.issues[0]!.path,
      );
    }
  }

  async delete(id_customer: string): Promise<void> {
    try {
      await this.db.query(
        `
        DELETE FROM users WHERE id=$1
        `,
        [id_customer],
      );
    } catch (error: unknown) {
      const response = lookupConstraintError(error, customerDeleteErrors);

      if (!response) {
        throw error;
      }

      throw new ApplicationError(
        response.status,
        response.issues[0]!.message,
        response.issues[0]!.path,
      );
    }
  }
}
