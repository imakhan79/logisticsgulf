// Seeds realistic Gulf logistics business data across every module so each
// role dashboard has real rows to render. Idempotent per-table: skips a
// table's inserts if it already holds more than the handful of rows created
// by earlier manual workflow testing.
import { Client } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

function daysAgo(n, hour = 9) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}
function daysFromNow(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function pick(arr, i) {
  return arr[i % arr.length];
}

const { rows: companyRows } = await client.query(
  "select id, country_id from companies where name = 'Demo Logistics Co'",
);
const companyId = companyRows[0].id;
const countryAE = companyRows[0].country_id;

const { rows: countryRows } = await client.query("select id, code from countries");
const country = Object.fromEntries(countryRows.map((r) => [r.code, r.id]));

const { rows: memberRows } = await client.query(
  `select r.key as role_key, uc.user_id
   from user_companies uc join roles r on r.id = uc.role_id
   where uc.company_id = $1`,
  [companyId],
);
const uid = Object.fromEntries(memberRows.map((r) => [r.role_key, r.user_id]));

async function count(table) {
  const { rows } = await client.query(`select count(*)::int as c from ${table}`);
  return rows[0].c;
}

// ── Cities ──────────────────────────────────────────────────────────────
let cityId = {};
if ((await count("cities")) < 5) {
  const CITIES = [
    ["AE", "Dubai"], ["AE", "Abu Dhabi"], ["AE", "Sharjah"],
    ["SA", "Riyadh"], ["SA", "Jeddah"], ["SA", "Dammam"],
    ["QA", "Doha"], ["KW", "Kuwait City"], ["OM", "Muscat"], ["BH", "Manama"],
  ];
  for (const [code, name] of CITIES) {
    const { rows } = await client.query(
      "insert into cities (country_id, name) values ($1, $2) returning id, name",
      [country[code], name],
    );
    cityId[name] = rows[0].id;
  }
  console.log(`Inserted ${CITIES.length} cities.`);
} else {
  const { rows } = await client.query("select id, name from cities");
  cityId = Object.fromEntries(rows.map((r) => [r.name, r.id]));
  console.log("Cities already seeded, reusing existing.");
}

// ── Branches ────────────────────────────────────────────────────────────
let branchId = {};
if ((await count("branches")) < 3) {
  const BRANCHES = [
    ["Dubai HQ", "AE", "Dubai"],
    ["Abu Dhabi Branch", "AE", "Abu Dhabi"],
    ["Riyadh Branch", "SA", "Riyadh"],
    ["Jeddah Branch", "SA", "Jeddah"],
    ["Doha Branch", "QA", "Doha"],
  ];
  for (const [name, code, city] of BRANCHES) {
    const { rows } = await client.query(
      `insert into branches (company_id, country_id, city_id, name, created_by, updated_by)
       values ($1, $2, $3, $4, $5, $5) returning id, name`,
      [companyId, country[code], cityId[city], name, uid.company_admin],
    );
    branchId[name] = rows[0].id;
  }
  console.log(`Inserted ${BRANCHES.length} branches.`);
} else {
  const { rows } = await client.query("select id, name from branches");
  branchId = Object.fromEntries(rows.map((r) => [r.name, r.id]));
  console.log("Branches already seeded, reusing existing.");
}
const branchList = Object.values(branchId);

// ── Customers ───────────────────────────────────────────────────────────
let customerIds = [];
if ((await count("customers")) < 5) {
  const CUSTOMERS = [
    ["Al Rostamani Group", "AE", "Dubai"],
    ["Emaar Properties", "AE", "Dubai"],
    ["Etisalat Supply Chain", "AE", "Abu Dhabi"],
    ["Almarai Distribution", "SA", "Riyadh"],
    ["Savola Group", "SA", "Jeddah"],
    ["Ooredoo Qatar Logistics", "QA", "Doha"],
    ["Agility Kuwait", "KW", "Kuwait City"],
    ["Renaissance Services Oman", "OM", "Muscat"],
    ["Alba Aluminium Bahrain", "BH", "Manama"],
    ["Landmark Group", "AE", "Dubai"],
    ["SABIC Logistics", "SA", "Dammam"],
  ];
  for (let i = 0; i < CUSTOMERS.length; i++) {
    const [name, code, city] = CUSTOMERS[i];
    const slug = name.toLowerCase().replace(/[^a-z]+/g, "");
    const { rows } = await client.query(
      `insert into customers (company_id, country_id, name, email, phone, address, city_id, branch_id, created_by, updated_by)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9) returning id`,
      [
        companyId, country[code], name, `contact@${slug}.com`,
        `+9715${(10000000 + i * 137).toString().slice(0, 8)}`,
        `${city}, ${code === "AE" ? "UAE" : code === "SA" ? "Saudi Arabia" : name.includes("Qatar") ? "Qatar" : city}`,
        cityId[city], pick(branchList, i), uid.company_admin,
      ],
    );
    customerIds.push(rows[0].id);
  }
  console.log(`Inserted ${CUSTOMERS.length} customers.`);
} else {
  const { rows } = await client.query("select id from customers");
  customerIds = rows.map((r) => r.id);
  console.log("Customers already seeded, reusing existing.");
}

// ── Drivers ─────────────────────────────────────────────────────────────
let driverIds = [];
if ((await count("drivers")) < 3) {
  const DRIVER_NAMES = [
    "Ahmed Al Mansoori", "Mohammed Rahman", "Suresh Kumar", "Faisal Al Otaibi",
    "Rajesh Patel", "Khalid Al Hashimi", "Imran Sheikh", "Yusuf Ibrahim",
    "Arjun Nair", "Saeed Al Balushi",
  ];
  for (let i = 0; i < DRIVER_NAMES.length; i++) {
    const isDemoDriver = i === 0;
    const licenseExpiry = i === 1 ? daysFromNow(20) : i === 2 ? daysFromNow(-10) : daysFromNow(365 + i * 10);
    const { rows } = await client.query(
      `insert into drivers (company_id, country_id, branch_id, user_id, name, license_no, license_expiry, phone, status, created_by, updated_by)
       values ($1, $2, $3, $4, $5, $6, $7, $8, 'active', $9, $9) returning id`,
      [
        companyId, countryAE, pick(branchList, i), isDemoDriver ? uid.driver : null,
        DRIVER_NAMES[i], `DL-${100000 + i * 7}`, licenseExpiry.slice(0, 10),
        `+9715${(20000000 + i * 219).toString().slice(0, 8)}`, uid.fleet_manager,
      ],
    );
    driverIds.push(rows[0].id);
  }
  console.log(`Inserted ${DRIVER_NAMES.length} drivers (driver #1 linked to demo driver user).`);
} else {
  const { rows } = await client.query("select id from drivers");
  driverIds = rows.map((r) => r.id);
  console.log("Drivers already seeded, reusing existing.");
}

// ── Vehicles ────────────────────────────────────────────────────────────
let vehicleIds = [];
{
  const { rows: existing } = await client.query("select id from vehicles");
  vehicleIds = existing.map((r) => r.id);
}
if (vehicleIds.length < 3) {
  const VEHICLES = [
    ["DXB-22001", "Truck", 8000], ["DXB-22002", "Van", 1500], ["AUH-33012", "Trailer", 15000],
    ["AUH-33045", "Refrigerated Truck", 6000], ["RUH-44210", "Truck", 8000], ["JED-55133", "Van", 1500],
    ["DOH-66210", "Truck", 7000], ["KWT-77301", "Trailer", 15000], ["MCT-88041", "Van", 1200],
    ["BAH-99120", "Truck", 6500],
  ];
  for (let i = 0; i < VEHICLES.length; i++) {
    const [plate, type, capacity] = VEHICLES[i];
    const insuranceExpiry = i === 0 ? daysFromNow(15) : i === 1 ? daysFromNow(-5) : daysFromNow(300 + i * 8);
    const registrationExpiry = daysFromNow(200 + i * 12);
    const { rows } = await client.query(
      `insert into vehicles (company_id, country_id, branch_id, plate_no, vehicle_type, capacity, status, insurance_expiry, registration_expiry, last_lat, last_lng, last_location_at, created_by, updated_by)
       values ($1, $2, $3, $4, $5, $6, 'active', $7, $8, $9, $10, now(), $11, $11) returning id`,
      [
        companyId, countryAE, pick(branchList, i), plate, type, capacity,
        insuranceExpiry.slice(0, 10), registrationExpiry.slice(0, 10),
        25.1 + i * 0.05, 55.2 + i * 0.05, uid.fleet_manager,
      ],
    );
    vehicleIds.push(rows[0].id);
  }
  console.log(`Inserted ${VEHICLES.length} vehicles.`);
} else {
  console.log("Vehicles already seeded, reusing existing.");
}

// ── Routes ──────────────────────────────────────────────────────────────
let routeIds = [];
{
  const { rows: existing } = await client.query("select id from routes");
  routeIds = existing.map((r) => r.id);
}
if (routeIds.length < 3) {
  const ROUTES = [
    ["Dubai, UAE", "Riyadh, Saudi Arabia", 1100, 720],
    ["Dubai, UAE", "Doha, Qatar", 380, 300],
    ["Dubai, UAE", "Kuwait City, Kuwait", 870, 600],
    ["Dubai, UAE", "Muscat, Oman", 420, 330],
    ["Dubai, UAE", "Manama, Bahrain", 480, 360],
    ["Abu Dhabi, UAE", "Dubai, UAE", 140, 90],
    ["Riyadh, Saudi Arabia", "Jeddah, Saudi Arabia", 950, 660],
    ["Dammam, Saudi Arabia", "Riyadh, Saudi Arabia", 400, 270],
    ["Dubai, UAE", "Sharjah, UAE", 30, 25],
  ];
  for (const [origin, destination, distance, duration] of ROUTES) {
    const { rows } = await client.query(
      `insert into routes (company_id, country_id, origin, destination, distance, duration, created_by, updated_by)
       values ($1, $2, $3, $4, $5, $6, $7, $7) returning id`,
      [companyId, countryAE, origin, destination, distance, duration, uid.operations_manager],
    );
    routeIds.push(rows[0].id);
  }
  console.log(`Inserted ${ROUTES.length} routes.`);
} else {
  console.log("Routes already seeded, reusing existing.");
}

// ── Warehouses ──────────────────────────────────────────────────────────
let warehouseIds = [];
if ((await count("warehouses")) < 3) {
  const WAREHOUSES = [
    ["Dubai Central Warehouse", "AE", "Dubai", "Dubai HQ", 20000],
    ["Abu Dhabi Distribution Center", "AE", "Abu Dhabi", "Abu Dhabi Branch", 12000],
    ["Riyadh Logistics Hub", "SA", "Riyadh", "Riyadh Branch", 15000],
    ["Jeddah Port Warehouse", "SA", "Jeddah", "Jeddah Branch", 18000],
    ["Doha Storage Facility", "QA", "Doha", "Doha Branch", 9000],
  ];
  for (const [name, code, city, branch, capacity] of WAREHOUSES) {
    const { rows } = await client.query(
      `insert into warehouses (company_id, country_id, city_id, branch_id, name, capacity, created_by, updated_by)
       values ($1, $2, $3, $4, $5, $6, $7, $7) returning id`,
      [companyId, country[code], cityId[city], branchId[branch], name, capacity, uid.warehouse_manager],
    );
    warehouseIds.push(rows[0].id);
  }
  console.log(`Inserted ${WAREHOUSES.length} warehouses.`);
} else {
  const { rows } = await client.query("select id from warehouses");
  warehouseIds = rows.map((r) => r.id);
  console.log("Warehouses already seeded, reusing existing.");
}

// ── Inventory ───────────────────────────────────────────────────────────
if ((await count("inventory")) < 5) {
  const PRODUCTS = [
    "Consumer Electronics Cartons", "Textile Bales", "Auto Spare Parts",
    "FMCG Mixed Cartons", "Industrial Machinery Parts", "Packaged Food Pallets",
  ];
  let n = 0;
  for (const whId of warehouseIds) {
    for (let i = 0; i < PRODUCTS.length; i++) {
      await client.query(
        `insert into inventory (company_id, warehouse_id, sku, product, quantity, created_by, updated_by)
         values ($1, $2, $3, $4, $5, $6, $6)`,
        [companyId, whId, `SKU-${(n + 1).toString().padStart(4, "0")}`, PRODUCTS[i], 50 + n * 13, uid.warehouse_manager],
      );
      n++;
    }
  }
  console.log(`Inserted ${n} inventory rows.`);
} else {
  console.log("Inventory already seeded, reusing existing.");
}

// ── Quotes ──────────────────────────────────────────────────────────────
let quoteIds = [];
{
  const { rows: existing } = await client.query("select id, status from quotes");
  quoteIds = existing.map((r) => r.id);
}
if (quoteIds.length < 5) {
  const QUOTES = [
    ["QT-1002", "Dubai, UAE", "Doha, Qatar", "draft", 1800],
    ["QT-1003", "Dubai, UAE", "Kuwait City, Kuwait", "pending_approval", 3200],
    ["QT-1004", "Abu Dhabi, UAE", "Muscat, Oman", "approved", 2100],
    ["QT-1005", "Riyadh, Saudi Arabia", "Jeddah, Saudi Arabia", "accepted", 4200],
    ["QT-1006", "Dubai, UAE", "Manama, Bahrain", "rejected", 1500],
    ["QT-1007", "Jeddah, Saudi Arabia", "Riyadh, Saudi Arabia", "converted", 3900],
    ["QT-1008", "Dubai, UAE", "Riyadh, Saudi Arabia", "pending_approval", 2700],
    ["QT-1009", "Dammam, Saudi Arabia", "Riyadh, Saudi Arabia", "draft", 1650],
    ["QT-1010", "Dubai, UAE", "Sharjah, UAE", "approved", 400],
    ["QT-1011", "Abu Dhabi, UAE", "Dubai, UAE", "accepted", 900],
    ["QT-1012", "Dubai, UAE", "Doha, Qatar", "converted", 2000],
    ["QT-1013", "Kuwait City, Kuwait", "Dubai, UAE", "rejected", 3300],
    ["QT-1014", "Riyadh, Saudi Arabia", "Dammam, Saudi Arabia", "draft", 1200],
    ["QT-1015", "Muscat, Oman", "Dubai, UAE", "pending_approval", 2600],
  ];
  for (let i = 0; i < QUOTES.length; i++) {
    const [no, origin, destination, status, amount] = QUOTES[i];
    const custId = pick(customerIds, i);
    const created = daysAgo(45 - i);
    const isApproved = ["approved", "accepted", "converted"].includes(status);
    const { rows } = await client.query(
      `insert into quotes (company_id, country_id, quote_no, customer_id, origin, destination, cargo_details, weight, volume, amount, status, requested_by, approved_by, approved_at, created_by, updated_by, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $15, $16, $16) returning id`,
      [
        companyId, countryAE, no, custId, origin, destination,
        "General cargo, palletized", 800 + i * 45, 12 + i * 2, amount, status,
        uid.sales_executive ?? uid.operations_manager,
        isApproved ? uid.operations_manager : null,
        isApproved ? daysAgo(44 - i) : null,
        uid.operations_manager, created,
      ],
    );
    quoteIds.push(rows[0].id);
  }
  console.log(`Inserted ${QUOTES.length} quotes.`);
} else {
  console.log("Quotes already seeded, reusing existing.");
}

// ── Orders (only for accepted/converted quotes not yet booked, plus a few standalone) ──
let orderIds = [];
{
  const { rows: existing } = await client.query("select id, quote_id from orders");
  orderIds = existing.map((r) => r.id);
  var bookedQuoteIds = new Set(existing.map((r) => r.quote_id).filter(Boolean));
}
if (orderIds.length < 5) {
  const { rows: bookable } = await client.query(
    "select id, quote_no, customer_id, origin, destination, weight, volume from quotes where status in ('accepted','converted')",
  );
  let i = 0;
  for (const q of bookable) {
    if (bookedQuoteIds.has(q.id)) continue;
    const status = i % 4 === 0 ? "cancelled" : i % 3 === 0 ? "pending" : "confirmed";
    const { rows } = await client.query(
      `insert into orders (company_id, country_id, customer_id, order_no, origin, destination, weight, volume, status, quote_id, created_by, updated_by, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, $12, $12) returning id`,
      [
        companyId, countryAE, q.customer_id, `ORD-${q.quote_no}`, q.origin, q.destination,
        q.weight ?? 900 + i * 30, q.volume ?? 14 + i, status, q.id, uid.operations_manager, daysAgo(40 - i * 2),
      ],
    );
    orderIds.push(rows[0].id);
    i++;
  }
  // A few standalone direct bookings (no quote)
  const DIRECT = [
    ["Dubai, UAE", "Abu Dhabi, UAE", "pending"],
    ["Riyadh, Saudi Arabia", "Dammam, Saudi Arabia", "confirmed"],
    ["Dubai, UAE", "Manama, Bahrain", "confirmed"],
  ];
  for (let j = 0; j < DIRECT.length; j++) {
    const [origin, destination, status] = DIRECT[j];
    const { rows } = await client.query(
      `insert into orders (company_id, country_id, customer_id, order_no, origin, destination, weight, volume, status, created_by, updated_by, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10, $11, $11) returning id`,
      [
        companyId, countryAE, pick(customerIds, j + 3), `ORD-DIRECT-${1001 + j}`, origin, destination,
        700 + j * 60, 10 + j, status, uid.operations_manager, daysAgo(15 - j * 3),
      ],
    );
    orderIds.push(rows[0].id);
  }
  console.log(`Inserted ${i + DIRECT.length} orders.`);
} else {
  console.log("Orders already seeded, reusing existing.");
}

// ── Shipments (one per confirmed order not yet shipped) ────────────────
let shipmentIds = [];
{
  const { rows: existing } = await client.query("select id, order_id, status from shipments");
  shipmentIds = existing.map((r) => r.id);
  var shippedOrderIds = new Set(existing.map((r) => r.order_id).filter(Boolean));
}
let deliveredShipments = [];
if (shipmentIds.length < 5) {
  const { rows: confirmedOrders } = await client.query(
    "select id, order_no, customer_id from orders where status in ('confirmed','processing')",
  );
  const STATUSES = ["delivered", "delivered", "in_transit", "in_transit", "pending", "delivered", "pending"];
  let i = 0;
  for (const o of confirmedOrders) {
    if (shippedOrderIds.has(o.id)) continue;
    const status = pick(STATUSES, i);
    const driverForTrip = i === 0 ? driverIds[0] : pick(driverIds, i); // driverIds[0] = demo driver's linked driver
    const created = daysAgo(30 - i * 2);
    const { rows } = await client.query(
      `insert into shipments (company_id, country_id, shipment_no, order_id, customer_id, vehicle_id, driver_id, route_id, status, eta, created_by, updated_by, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11, $12, $12) returning id, status`,
      [
        companyId, countryAE, `SHP-${o.order_no}`, o.id, o.customer_id,
        pick(vehicleIds, i), status === "pending" ? null : driverForTrip, pick(routeIds, i),
        status, status === "pending" ? null : daysAgo(25 - i * 2, 14), uid.dispatcher, created,
      ],
    );
    shipmentIds.push(rows[0].id);
    if (status === "delivered") deliveredShipments.push({ id: rows[0].id, orderId: o.id, customerId: o.customer_id });
    i++;
  }
  console.log(`Inserted ${i} shipments.`);
} else {
  const { rows } = await client.query(
    "select s.id, s.order_id, o.customer_id from shipments s join orders o on o.id = s.order_id where s.status = 'delivered'",
  );
  deliveredShipments = rows.map((r) => ({ id: r.id, orderId: r.order_id, customerId: r.customer_id }));
  console.log("Shipments already seeded, reusing existing.");
}

// ── Deliveries (one per delivered shipment without one yet) ────────────
{
  const { rows: existing } = await client.query("select shipment_id from deliveries");
  const have = new Set(existing.map((r) => r.shipment_id));
  let n = 0;
  for (const s of deliveredShipments) {
    if (have.has(s.id)) continue;
    await client.query(
      `insert into deliveries (company_id, shipment_id, driver_id, status, created_by, updated_by)
       values ($1, $2, $3, 'delivered', $4, $4)`,
      [companyId, s.id, driverIds[0] ?? null, uid.driver],
    );
    n++;
  }
  if (n) console.log(`Inserted ${n} deliveries.`);
}

// ── Invoices (one per delivered shipment without one yet) ──────────────
let invoiceRows = [];
{
  const { rows: existing } = await client.query("select shipment_id from invoices");
  const have = new Set(existing.map((r) => r.shipment_id));
  let n = 0;
  for (let i = 0; i < deliveredShipments.length; i++) {
    const s = deliveredShipments[i];
    if (have.has(s.id)) continue;
    const status = i % 3 === 0 ? "paid" : "unpaid";
    const { rows } = await client.query(
      `insert into invoices (company_id, country_id, customer_id, shipment_id, invoice_number, amount, status, due_date, created_by, updated_by, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $10, $10) returning id, status`,
      [
        companyId, countryAE, s.customerId, s.id, `INV-${2001 + i}`, 1800 + i * 220, status,
        daysFromNow(14 - i * 3).slice(0, 10), uid.finance, daysAgo(20 - i * 2),
      ],
    );
    invoiceRows.push({ id: rows[0].id, status: rows[0].status });
    n++;
  }
  if (n) console.log(`Inserted ${n} invoices.`);
}

// ── Payments (one per paid invoice without one yet) ─────────────────────
{
  const { rows: paidInvoices } = await client.query("select id, amount from invoices where status = 'paid'");
  const { rows: existing } = await client.query("select invoice_id from payments");
  const have = new Set(existing.map((r) => r.invoice_id));
  const METHODS = ["bank_transfer", "credit_card", "cash", "cheque"];
  let n = 0;
  for (let i = 0; i < paidInvoices.length; i++) {
    const inv = paidInvoices[i];
    if (have.has(inv.id)) continue;
    await client.query(
      `insert into payments (company_id, invoice_id, amount, payment_method, paid_at, created_by, updated_by)
       values ($1, $2, $3, $4, $5, $6, $6)`,
      [companyId, inv.id, inv.amount, pick(METHODS, i), daysAgo(10 - i), uid.finance],
    );
    n++;
  }
  if (n) console.log(`Inserted ${n} payments.`);
}

// ── Expenses ─────────────────────────────────────────────────────────────
if ((await count("expenses")) < 5) {
  const TYPES = ["fuel", "toll", "maintenance", "parking", "customs_fee", "driver_allowance"];
  let n = 0;
  for (let i = 0; i < 18; i++) {
    await client.query(
      `insert into expenses (company_id, country_id, shipment_id, vehicle_id, branch_id, expense_type, amount, description, incurred_at, created_by, updated_by)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)`,
      [
        companyId, countryAE, pick(shipmentIds, i) ?? null, pick(vehicleIds, i),
        pick(branchList, i), pick(TYPES, i), 45 + i * 22,
        `${pick(TYPES, i).replace(/_/g, " ")} expense`, daysFromNow(-(30 - i)).slice(0, 10), uid.finance,
      ],
    );
    n++;
  }
  console.log(`Inserted ${n} expenses.`);
} else {
  console.log("Expenses already seeded, reusing existing.");
}

// ── Customs declarations ────────────────────────────────────────────────
if ((await count("customs_declarations")) < 4) {
  const STATUSES = ["submitted", "under_inspection", "cleared", "cleared", "held", "draft", "submitted", "cleared"];
  let n = 0;
  for (let i = 0; i < STATUSES.length; i++) {
    await client.query(
      `insert into customs_declarations (company_id, country_id, shipment_id, declaration_no, status, notes, created_by, updated_by, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, $7, $8, $8)`,
      [
        companyId, countryAE, pick(shipmentIds, i) ?? null, `CD-${5001 + i}`, STATUSES[i],
        STATUSES[i] === "held" ? "Awaiting additional documentation" : null,
        uid.customs_manager, daysAgo(20 - i * 2),
      ],
    );
    n++;
  }
  console.log(`Inserted ${n} customs declarations.`);
} else {
  console.log("Customs declarations already seeded, reusing existing.");
}

// ── Port activities ─────────────────────────────────────────────────────
if ((await count("port_activities")) < 3) {
  const ACTIVITIES = [
    ["vessel_booking", "scheduled"], ["container_movement", "in_progress"], ["gate_entry", "completed"],
    ["gate_exit", "completed"], ["vessel_booking", "in_progress"], ["container_movement", "scheduled"],
    ["gate_entry", "cancelled"], ["container_movement", "completed"], ["vessel_booking", "completed"],
    ["gate_exit", "scheduled"],
  ];
  let n = 0;
  for (let i = 0; i < ACTIVITIES.length; i++) {
    const [type, status] = ACTIVITIES[i];
    await client.query(
      `insert into port_activities (company_id, country_id, activity_type, reference_no, status, scheduled_at, created_by, updated_by, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, $7, $8, $8)`,
      [companyId, countryAE, type, `PORT-${6001 + i}`, status, daysFromNow(i - 5), uid.port_operations_manager, daysAgo(15 - i)],
    );
    n++;
  }
  console.log(`Inserted ${n} port activities.`);
} else {
  console.log("Port activities already seeded, reusing existing.");
}

// ── Support tickets ──────────────────────────────────────────────────────
if ((await count("support_tickets")) < 3) {
  const TICKETS = [
    ["Delayed delivery inquiry", "open", "high"],
    ["Invoice discrepancy", "in_progress", "medium"],
    ["Damaged goods claim", "open", "urgent"],
    ["Shipment tracking not updating", "resolved", "low"],
    ["Request for POD copy", "closed", "low"],
    ["Wrong delivery address", "in_progress", "high"],
    ["Billing question", "resolved", "medium"],
    ["Customs delay complaint", "open", "urgent"],
    ["Rate quote follow-up", "closed", "low"],
    ["Vehicle arrival time query", "resolved", "medium"],
  ];
  let n = 0;
  for (let i = 0; i < TICKETS.length; i++) {
    const [subject, status, priority] = TICKETS[i];
    await client.query(
      `insert into support_tickets (company_id, customer_id, shipment_id, subject, status, priority, assigned_to, created_by, updated_by, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9, $9)`,
      [
        companyId, pick(customerIds, i), pick(shipmentIds, i) ?? null, subject, status, priority,
        uid.customer_service_manager, uid.customer, daysAgo(18 - i),
      ],
    );
    n++;
  }
  console.log(`Inserted ${n} support tickets.`);
} else {
  console.log("Support tickets already seeded, reusing existing.");
}

// ── Suppliers ────────────────────────────────────────────────────────────
let supplierIds = [];
if ((await count("suppliers")) < 3) {
  const SUPPLIERS = [
    ["Gulf Fuel Distribution LLC", "Fuel"], ["Al Ain Tyres & Parts", "Vehicle Parts"],
    ["Emirates Packaging Co", "Packaging"], ["Prime Fleet Maintenance", "Maintenance"],
    ["Dubai Uniform Supplies", "Uniforms"], ["SafeLoad Equipment Rental", "Equipment"],
    ["Gulf IT Solutions", "Technology"], ["National Insurance Brokers", "Insurance"],
  ];
  for (const [name, category] of SUPPLIERS) {
    const slug = name.toLowerCase().replace(/[^a-z]+/g, "");
    const { rows } = await client.query(
      `insert into suppliers (company_id, name, category, contact_email, contact_phone, status, created_by, updated_by)
       values ($1, $2, $3, $4, $5, 'active', $6, $6) returning id`,
      [companyId, name, category, `sales@${slug}.com`, "+97145550000", uid.procurement_manager],
    );
    supplierIds.push(rows[0].id);
  }
  console.log(`Inserted ${SUPPLIERS.length} suppliers.`);
} else {
  const { rows } = await client.query("select id from suppliers");
  supplierIds = rows.map((r) => r.id);
  console.log("Suppliers already seeded, reusing existing.");
}

// ── Purchase orders ──────────────────────────────────────────────────────
if ((await count("purchase_orders")) < 3) {
  const STATUSES = ["draft", "sent", "received", "paid", "sent", "received", "paid", "draft"];
  let n = 0;
  for (let i = 0; i < STATUSES.length && i < supplierIds.length * 2; i++) {
    await client.query(
      `insert into purchase_orders (company_id, supplier_id, po_number, amount, status, created_by, updated_by, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, $6, $7, $7)`,
      [companyId, pick(supplierIds, i), `PO-${7001 + i}`, 2200 + i * 350, STATUSES[i], uid.procurement_manager, daysAgo(25 - i * 2)],
    );
    n++;
  }
  console.log(`Inserted ${n} purchase orders.`);
} else {
  console.log("Purchase orders already seeded, reusing existing.");
}

await client.end();
console.log("Done.");
