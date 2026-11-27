import type { Pool } from "pg";
import { PostgresClient } from "./postgre-client.js";
import type { Database, DbClient, DbResult } from "../db-client.js";

export class PostgresDatabase implements Database {
  constructor(private readonly pool: Pool) {}

  async query<T>(
    sql: string,
    params: readonly unknown[] = [],
  ): Promise<DbResult<T>> {
    const result = await this.pool.query(sql, [...params]);

    return {
      rows: result.rows as T[],
      rowCount: result.rowCount ?? 0,
    };
  }

  async withTransaction<T>(
    operation: (client: DbClient) => Promise<T>,
  ): Promise<T> {
    const connection = await this.pool.connect();

    try {
      await connection.query("BEGIN");

      const client = new PostgresClient(connection);

      const result = await operation(client);

      await connection.query("COMMIT");

      return result;
    } catch (error) {
      await connection.query("ROLLBACK");

      throw error; // Propagates the original error
    } finally {
      connection.release();
    }
  }
}
