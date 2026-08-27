import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const DEMO_PASSWORD = "Demo1234!";
const DEMO_COMPANY_NAME = "Demo Logistics Co";

const DEMO_USERS = [
  { role: "super_admin", email: "superadmin@demo.logisticsgulf.com", name: "Demo Super Admin" },
  { role: "company_admin", email: "companyadmin@demo.logisticsgulf.com", name: "Demo Company Admin" },
  { role: "country_admin", email: "countryadmin@demo.logisticsgulf.com", name: "Demo Country Admin" },
  { role: "operations_manager", email: "opsmanager@demo.logisticsgulf.com", name: "Demo Operations Manager" },
  { role: "dispatcher", email: "dispatcher@demo.logisticsgulf.com", name: "Demo Dispatcher" },
  { role: "fleet_manager", email: "fleetmanager@demo.logisticsgulf.com", name: "Demo Fleet Manager" },
  { role: "warehouse_manager", email: "warehousemanager@demo.logisticsgulf.com", name: "Demo Warehouse Manager" },
  { role: "finance", email: "finance@demo.logisticsgulf.com", name: "Demo Finance" },
  { role: "driver", email: "driver@demo.logisticsgulf.com", name: "Demo Driver" },
  { role: "customer", email: "customer@demo.logisticsgulf.com", name: "Demo Customer" },
];

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const { rows: countryRows } = await client.query("select id from countries where code = 'AE'");
const countryId = countryRows[0].id;

let { rows: companyRows } = await client.query(
  "select id from companies where name = $1",
  [DEMO_COMPANY_NAME],
);
let companyId = companyRows[0]?.id;
if (!companyId) {
  const inserted = await client.query(
    `insert into companies (name, country_id, currency, timezone, status, email)
     values ($1, $2, 'AED', 'Asia/Dubai', 'active', 'demo@logisticsgulf.com')
     returning id`,
    [DEMO_COMPANY_NAME, countryId],
  );
  companyId = inserted.rows[0].id;
  console.log(`Created demo company ${companyId}`);
} else {
  console.log(`Using existing demo company ${companyId}`);
}

for (const demo of DEMO_USERS) {
  const { rows: existing } = await client.query("select id from auth.users where email = $1", [demo.email]);
  let userId = existing[0]?.id;

  if (!userId) {
    userId = randomUUID();
    await client.query(
      `insert into auth.users (
         id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
         raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
         confirmation_token, recovery_token, email_change_token_new, email_change,
         is_sso_user, is_anonymous
       ) values (
         $1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', $2,
         crypt($3, gen_salt('bf')), now(),
         '{"provider":"email","providers":["email"]}'::jsonb, $4::jsonb, now(), now(),
         '', '', '', '', false, false
       )`,
      [userId, demo.email, DEMO_PASSWORD, JSON.stringify({ full_name: demo.name })],
    );
    console.log(`Created auth user ${demo.email} (${userId})`);
  } else {
    console.log(`Auth user ${demo.email} already exists (${userId})`);
  }

  const { rows: identityRows } = await client.query(
    "select id from auth.identities where user_id = $1::uuid and provider = 'email'",
    [userId],
  );
  if (!identityRows[0]) {
    await client.query(
      `insert into auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
       values (gen_random_uuid(), $1::text, $2::uuid, $3::jsonb, 'email', now(), now(), now())`,
      [userId, userId, JSON.stringify({ sub: userId, email: demo.email })],
    );
    console.log(`  -> identity created`);
  }

  const { rows: roleRows } = await client.query("select id from roles where key = $1", [demo.role]);
  const roleId = roleRows[0].id;

  const { rows: membershipRows } = await client.query(
    "select id from user_companies where user_id = $1 and company_id = $2",
    [userId, companyId],
  );
  if (!membershipRows[0]) {
    await client.query(
      `insert into user_companies (user_id, company_id, country_id, role_id, is_active)
       values ($1, $2, $3, $4, true)`,
      [userId, companyId, countryId, roleId],
    );
    console.log(`  -> membership: ${demo.role}`);
  } else {
    console.log(`  -> membership already exists`);
  }
}

await client.end();
console.log("Done.");
