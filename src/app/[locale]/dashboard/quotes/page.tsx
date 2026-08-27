import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { QuotesTable, type Quote } from "./quotes-table";

export default async function QuotesPage() {
  if (!(await can("quotes.view"))) return <NoAccess module="quotes" />;

  const supabase = await createClient();
  const [{ data, error }, canCreate] = await Promise.all([
    supabase
      .from("quotes")
      .select("id, quote_no, status, amount, created_at, customers(name)")
      .order("created_at", { ascending: false })
      .limit(50),
    can("quotes.create"),
  ]);

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quotes</h1>
        {canCreate && (
          <Link
            href="quotes/new"
            className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
          >
            New quote
          </Link>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error.message}</p>}

      <QuotesTable data={(data as unknown as Quote[]) ?? []} />
    </div>
  );
}
