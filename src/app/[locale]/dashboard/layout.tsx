import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const nav = [
  { href: "", label: "Overview" },
  { href: "orders", label: "Orders" },
  { href: "shipments", label: "Shipments" },
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
        <div className="mb-6 text-sm font-semibold">LogisticsGulf</div>
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
