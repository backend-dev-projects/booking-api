import { pool } from "../../db/pool.js";

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

export async function findAllCustomers(): Promise<Customer[]> {
  const result = await pool.query<Customer>(
    `
    SELECT id, full_name, email
	    FROM users
     ORDER BY id
  `,
  );

  return result.rows;
}

export async function findCustomer(
  id_customer: number,
): Promise<Customer | undefined> {
  const result = await pool.query<Customer>(
    `
    SELECT id, full_name, email
	    FROM users
     WHERE id=$1
  `,
    [id_customer],
  );

  return result.rows[0];
}

export async function insertCustomer(customer: InsertCustomerInput) {
  const result = await pool.query(
    `
    INSERT INTO users(full_name, email, password_hash)
           VALUES ($1, $2, $3);
  `,
    [customer.full_name, customer.email, customer.password_hash],
  );

  return result.rows;
}

export async function updateCustomer(
  id_customer: number,
  customer: UpdateCustomerInput,
) {
  const result = await pool.query(
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

export async function deleteCustomer(id_customer: number) {
  const result = await pool.query(
    `
    DELETE FROM users WHERE id=$1
  `,
    [id_customer],
  );

  return result.rows;
}
