import type { DbClient } from "../../db/db-client.js";
import { database } from "../../db/index.js";

interface Customer {
  id: string;
  full_name: string;
  email: string;
}

interface InsertCustomerInput {
  full_name: string;
  email: string;
  password_hash: string;
}

interface UpdateCustomerInput {
  full_name: string | undefined;
  password_hash: string | undefined;
}

export class CustomerRepository {
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

  async find(id_customer: string): Promise<Customer | undefined> {
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

  async insert(customer: InsertCustomerInput) {
    const result = await this.db.query(
      `
      INSERT INTO users(full_name, email, password_hash)
             VALUES ($1, $2, $3);
    `,
      [customer.full_name, customer.email, customer.password_hash],
    );

    return result.rows;
  }

  async update(id_customer: string, customer: UpdateCustomerInput) {
    const result = await this.db.query(
      `
      UPDATE users
	       SET full_name     = COALESCE($1, full_name),
             password_hash = COALESCE($2, password_hash)
	     WHERE id=$3
  `,
      [customer.full_name, customer.password_hash, id_customer],
    );

    return result.rows;
  }

  async delete(id_customer: string) {
    const result = await this.db.query(
      `
      DELETE FROM users WHERE id=$1
    `,
      [id_customer],
    );

    return result.rows;
  }
}
