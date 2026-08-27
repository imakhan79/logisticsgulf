import { Client } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const { rows } = await client.query(
  "select table_name from information_schema.tables where table_schema = 'public' order by table_name",
);
console.log(rows.map((r) => r.table_name).join("\n"));
await client.end();
