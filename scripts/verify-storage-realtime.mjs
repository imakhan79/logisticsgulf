import { Client } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const buckets = await client.query("select id, public from storage.buckets order by id");
console.log("buckets:", buckets.rows.map((r) => `${r.id}(${r.public ? "public" : "private"})`).join(", "));

const realtime = await client.query(
  "select tablename from pg_publication_tables where pubname = 'supabase_realtime' order by tablename",
);
console.log("realtime tables:", realtime.rows.map((r) => r.tablename).join(", "));

await client.end();
