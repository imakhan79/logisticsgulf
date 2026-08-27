import { Client } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

for (const table of ["users", "identities"]) {
  const { rows } = await client.query(
    `select column_name, data_type, is_nullable, column_default
     from information_schema.columns
     where table_schema = 'auth' and table_name = $1
     order by ordinal_position`,
    [table],
  );
  console.log(`\n-- auth.${table} --`);
  for (const r of rows) {
    console.log(`${r.column_name} | ${r.data_type} | nullable=${r.is_nullable} | default=${r.column_default}`);
  }
}

await client.end();
