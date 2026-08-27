import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { OrdersTable, type Order } from "./orders-table";

export default async function OrdersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_no, origin, destination, weight, volume, status, created_at, customers(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Link
          href="orders/new"
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
        >
          New order
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error.message}</p>}

      <OrdersTable data={(data as unknown as Order[]) ?? []} />
    </div>
  );
}
