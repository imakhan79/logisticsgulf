import { createClient } from "@/lib/supabase/server";
import { OrderForm } from "./order-form";

export default async function NewOrderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("id, name")
    .order("name");

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">New order</h1>
      <OrderForm locale={locale} customers={customers ?? []} />
    </div>
  );
}
