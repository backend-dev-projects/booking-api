import type { Database } from "./db-client.js";
import { PostgresDatabase } from "./postgres/postgres-database.js";
import { pool } from "./postgres/pool.js";

export const database: Database = new PostgresDatabase(pool);
