import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { QuoteForm } from "./quote-form";

export default async function NewQuotePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(await can("quotes.create"))) return <NoAccess module="new quote" />;

  const supabase = await createClient();
  const { data: customers } = await supabase.from("customers").select("id, name").order("name");

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">New quote</h1>
      <QuoteForm locale={locale} customers={customers ?? []} />
    </div>
  );
}
