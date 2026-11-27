import type { PoolClient } from "pg";
import type { DbClient, DbResult } from "../db-client.js";

export class PostgresClient implements DbClient {
  constructor(private readonly connection: PoolClient) {}

  async query<T>(
    sql: string,
    params: readonly unknown[] = [],
  ): Promise<DbResult<T>> {
    const result = await this.connection.query(sql, [...params]);

    return {
      rows: result.rows as T[],
      rowCount: result.rowCount ?? 0,
    };
  }
}
