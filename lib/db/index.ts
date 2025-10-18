import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

if (!process.env.POSTGRES_URL) {
  console.error("FATAL: POSTGRES_URL environment variable is not set.");
  throw new Error("POSTGRES_URL environment variable is not set");
}

let client;
try {
  client = postgres(process.env.POSTGRES_URL, { prepare: false });
} catch (error) {
  console.error("FATAL: Failed to connect to the database.");
  console.error(error);
  throw new Error("Database connection failed.");
}
export const db = drizzle(client, { schema });
