import { readFileSync } from "node:fs";
import { Client } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/run-migration.mjs <path-to-sql>");
  process.exit(1);
}

const sql = readFileSync(file, "utf8");
const client = new Client({ connectionString: process.env.DATABASE_URL });

await client.connect();
try {
  await client.query(sql);
  console.log(`Applied ${file}`);
} finally {
  await client.end();
}
