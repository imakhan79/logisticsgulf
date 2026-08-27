import { Client } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const MODULES = [
  "orders", "shipments", "routes", "vehicles", "drivers", "warehouses",
  "inventory", "deliveries", "customers", "invoices", "payments",
  "expenses", "customs", "ports", "users", "reports",
];
const STANDARD_ACTIONS = ["view", "create", "edit", "delete", "export"];
const SPECIAL_PERMISSIONS = [
  ["shipments.dispatch", "Assign vehicle/driver and dispatch a shipment"],
  ["shipments.cancel", "Cancel a shipment"],
  ["invoices.approve", "Approve an invoice"],
  ["customs.clear", "Mark a customs declaration cleared"],
];

function manage(mod) {
  return STANDARD_ACTIONS.map((a) => `${mod}.${a}`);
}
function view(mod) {
  return [`${mod}.view`];
}
function viewExport(mod) {
  return [`${mod}.view`, `${mod}.export`];
}
function some(mod, actions) {
  return actions.map((a) => `${mod}.${a}`);
}

// Roles already seeded in 0002 keep their existing key (super_admin,
// company_admin, country_admin, operations_manager, dispatcher,
// fleet_manager, warehouse_manager, finance, driver, customer).
// Everything else here is new.
const ROLES = [
  { key: "super_admin", name: "Super Admin", description: "Global platform administrator with full access." },
  { key: "platform_support_admin", name: "Platform Support Admin", description: "Platform-level customer support: view companies/users, troubleshoot, reset access." },
  { key: "company_owner", name: "Company Owner", description: "Business-level oversight of the entire company's operation." },
  { key: "company_admin", name: "Company Admin", description: "Manages one logistics company: users, roles, settings, branches." },
  { key: "country_admin", name: "Country Admin", description: "Manages all operations within one country." },
  { key: "branch_manager", name: "Branch Manager", description: "Manages one branch's customers, orders, shipments, fleet, and expenses." },
  { key: "operations_manager", name: "Operations Manager", description: "Controls daily logistics operations across orders, shipments, and routes." },
  { key: "dispatcher", name: "Dispatcher", description: "Handles day-to-day transportation dispatch." },
  { key: "transport_manager", name: "Transport Manager", description: "Responsible for routes, trips, vehicles, drivers, and transport vendors." },
  { key: "fleet_manager", name: "Fleet Manager", description: "Manages vehicles: registration, insurance, inspections, maintenance." },
  { key: "driver", name: "Driver", description: "Executes assigned trips and shipments via a simplified interface." },
  { key: "warehouse_manager", name: "Warehouse Manager", description: "Manages warehouse operations: receiving, inventory, staff." },
  { key: "warehouse_staff", name: "Warehouse Staff", description: "Limited operational access: scan, receive, pick, pack, load." },
  { key: "freight_forwarding_manager", name: "Freight Forwarding Manager", description: "Manages freight quotations, bookings, carriers, and billing." },
  { key: "customs_manager", name: "Customs Manager", description: "Responsible for customs declarations, permits, and clearance." },
  { key: "customs_officer", name: "Customs Officer", description: "Handles assigned customs declarations and inspections." },
  { key: "port_operations_manager", name: "Port Operations Manager", description: "Manages port bookings, container movement, and gate/vessel schedules." },
  { key: "finance", name: "Finance Manager", description: "Responsible for pricing, invoices, payments, and financial reporting." },
  { key: "accountant", name: "Accountant", description: "Creates invoices, records payments, manages expenses and reconciliation." },
  { key: "sales_manager", name: "Sales Manager", description: "Manages leads, customers, quotations, and pricing negotiation." },
  { key: "sales_executive", name: "Sales Executive", description: "Creates leads, customers, and quotes; converts to bookings." },
  { key: "customer_service_manager", name: "Customer Service Manager", description: "Manages customer support, complaints, and satisfaction." },
  { key: "customer_service_agent", name: "Customer Service Agent", description: "Handles customer inquiries and shipment status lookups." },
  { key: "procurement_manager", name: "Procurement Manager", description: "Manages suppliers, purchase orders, and vendor invoices." },
  { key: "hr_manager", name: "HR Manager", description: "Manages employee and driver HR records, contracts, and training." },
  { key: "compliance_manager", name: "Compliance Manager", description: "Manages regulatory, vehicle, and driver compliance documents." },
  { key: "maintenance_manager", name: "Maintenance Manager", description: "Manages vehicle maintenance schedules and records." },
  { key: "maintenance_technician", name: "Maintenance Technician", description: "Records vehicle maintenance and inspection work." },
  { key: "customer", name: "Customer", description: "Views their own orders, shipments, and invoices." },
  { key: "supplier_vendor", name: "Supplier / Vendor", description: "External vendor with limited portal access." },
  { key: "viewer_auditor", name: "Viewer / Auditor", description: "Read-only access across the company for review purposes." },
];

// module gaps: no dedicated "employees/HR", "vendors", or "support tickets"
// tables/modules exist yet, so hr_manager, procurement_manager, and
// customer_service_* roles get a reduced grant limited to what the schema
// actually models today (drivers/expenses/customers) rather than a
// fabricated permission for a module that doesn't exist.
const ROLE_PERMISSIONS = {
  super_admin: [], // bypassed entirely by has_permission()
  platform_support_admin: [...view("users"), "users.edit", ...view("reports")],
  company_owner: [
    ...MODULES.filter((m) => m !== "users").flatMap(viewExport),
  ],
  company_admin: [
    "users.view", "users.create", "users.edit", "users.delete",
    ...manage("customers"), ...manage("vehicles"), ...manage("drivers"), ...manage("warehouses"),
    ...viewExport("orders"), ...viewExport("shipments"), ...viewExport("invoices"),
    ...viewExport("payments"), ...viewExport("expenses"), ...view("reports"),
  ],
  country_admin: [
    ...manage("orders"), ...manage("shipments"), ...manage("routes"), ...manage("vehicles"),
    ...manage("drivers"), ...manage("warehouses"), ...manage("customers"), ...manage("deliveries"),
    ...manage("customs"), ...view("reports"),
  ],
  branch_manager: [
    ...manage("customers"), ...manage("orders"), ...manage("shipments"), ...manage("vehicles"),
    ...manage("drivers"), ...manage("deliveries"), ...manage("warehouses"), ...manage("expenses"),
    ...view("reports"),
  ],
  operations_manager: [
    ...some("orders", ["view", "edit"]), ...some("shipments", ["view", "edit"]),
    ...some("routes", ["view", "edit"]), ...some("vehicles", ["view", "edit"]),
    ...some("drivers", ["view", "edit"]), ...view("deliveries"), ...view("warehouses"), ...view("reports"),
  ],
  dispatcher: [
    ...view("orders"), ...some("shipments", ["create", "edit"]), "shipments.dispatch",
    ...some("routes", ["view", "edit"]), ...some("vehicles", ["view", "edit"]),
    ...some("drivers", ["view", "edit"]), ...view("deliveries"),
  ],
  transport_manager: [
    ...manage("routes"), ...some("vehicles", ["view", "edit"]), ...some("drivers", ["view", "edit"]),
    ...view("expenses"), ...view("reports"),
  ],
  fleet_manager: [...manage("vehicles"), ...view("reports")],
  driver: [...view("shipments"), ...some("deliveries", ["create", "edit"]), ...view("routes")],
  warehouse_manager: [...manage("warehouses"), ...manage("inventory"), ...some("deliveries", ["view", "edit"]), ...view("reports")],
  warehouse_staff: [...some("inventory", ["view", "edit"]), ...some("deliveries", ["view", "edit"])],
  freight_forwarding_manager: [...manage("orders"), ...manage("shipments"), ...some("invoices", ["view", "create"])],
  customs_manager: [...manage("customs"), "customs.clear"],
  customs_officer: [...some("customs", ["view", "edit"])],
  port_operations_manager: [...manage("ports")],
  finance: [...manage("invoices"), "invoices.approve", ...manage("payments"), ...manage("expenses"), ...view("reports")],
  accountant: [...some("invoices", ["view", "create", "edit"]), ...manage("payments"), ...manage("expenses"), ...view("reports")],
  sales_manager: [...manage("customers"), ...some("orders", ["view", "create", "edit"]), ...view("reports")],
  sales_executive: [...some("customers", ["view", "create", "edit"]), ...some("orders", ["view", "create"])],
  customer_service_manager: [...view("customers"), ...view("orders"), ...view("shipments"), ...view("deliveries")],
  customer_service_agent: [...view("customers"), ...view("shipments")],
  procurement_manager: [...manage("expenses")],
  hr_manager: [...view("drivers")],
  compliance_manager: [...view("vehicles"), ...view("drivers"), ...view("customs"), ...view("reports")],
  maintenance_manager: [...some("vehicles", ["view", "edit"]), ...view("reports")],
  maintenance_technician: [...some("vehicles", ["view", "edit"])],
  customer: [...view("orders"), ...view("shipments"), ...view("invoices")],
  supplier_vendor: [],
  viewer_auditor: MODULES.flatMap(view),
};

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

// Permissions
const permissionRows = [
  ...MODULES.flatMap((m) => STANDARD_ACTIONS.map((a) => [`${m}.${a}`, `${a} ${m}`])),
  ...SPECIAL_PERMISSIONS,
];
for (const [key, description] of permissionRows) {
  await client.query(
    "insert into permissions (key, description) values ($1, $2) on conflict (key) do update set description = excluded.description",
    [key, description],
  );
}
console.log(`Upserted ${permissionRows.length} permissions across ${MODULES.length} modules.`);

// Roles
for (const role of ROLES) {
  await client.query(
    "insert into roles (key, name, description) values ($1, $2, $3) on conflict (key) do update set name = excluded.name, description = excluded.description",
    [role.key, role.name, role.description],
  );
}
console.log(`Upserted ${ROLES.length} roles.`);

// role_permissions
let mappingCount = 0;
for (const [roleKey, permissionKeys] of Object.entries(ROLE_PERMISSIONS)) {
  const { rows: roleRows } = await client.query("select id from roles where key = $1", [roleKey]);
  const roleId = roleRows[0]?.id;
  if (!roleId) {
    console.warn(`  ! role not found: ${roleKey}`);
    continue;
  }
  await client.query("delete from role_permissions where role_id = $1", [roleId]);
  for (const permKey of permissionKeys) {
    const { rows: permRows } = await client.query("select id from permissions where key = $1", [permKey]);
    const permId = permRows[0]?.id;
    if (!permId) {
      console.warn(`  ! permission not found: ${permKey} (role ${roleKey})`);
      continue;
    }
    await client.query(
      "insert into role_permissions (role_id, permission_id) values ($1, $2) on conflict do nothing",
      [roleId, permId],
    );
    mappingCount++;
  }
}
console.log(`Wrote ${mappingCount} role_permissions mappings across ${Object.keys(ROLE_PERMISSIONS).length} roles.`);

await client.end();
console.log("Done.");
