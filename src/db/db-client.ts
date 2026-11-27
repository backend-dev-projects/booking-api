export interface DbResult<T> {
  rows: T[];
  rowCount: number;
}

export interface DbClient {
  query<T>(sql: string, params?: readonly unknown[]): Promise<DbResult<T>>;
}

export interface Database extends DbClient {
  withTransaction<T>(operation: (client: DbClient) => Promise<T>): Promise<T>;
}
