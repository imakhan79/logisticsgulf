import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const nav = [
  { href: "", label: "Overview" },
  { href: "orders", label: "Orders" },
  { href: "shipments", label: "Shipments" },
  { href: "branches", label: "Branches" },
  { href: "routes", label: "Routes" },
  { href: "tracking", label: "Tracking" },
  { href: "customers", label: "Customers" },
  { href: "vehicles", label: "Vehicles" },
  { href: "drivers", label: "Drivers" },
  { href: "fleet", label: "Fleet" },
  { href: "warehouses", label: "Warehouses" },
  { href: "inventory", label: "Inventory" },
  { href: "deliveries", label: "Deliveries" },
  { href: "customs", label: "Customs" },
  { href: "invoices", label: "Invoices" },
  { href: "payments", label: "Payments" },
  { href: "reports", label: "Reports" },
  { href: "settings", label: "Settings" },
  { href: "users", label: "Users" },
  { href: "roles", label: "Roles" },
  { href: "audit", label: "Audit" },
];

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/login`);

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="w-56 shrink-0 border-e bg-neutral-50 p-4">
        <div className="mb-6 text-sm font-semibold">Gulf RouteWise</div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={`/${locale}/dashboard/${item.href}`}
              className="block rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
