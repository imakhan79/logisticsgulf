import { createClient } from "@/lib/supabase/server";
import { AuditTable, type AuditEntry } from "./audit-table";

export default async function AuditPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_log")
    .select("id, table_name, action, changed_at, users(email)")
    .order("changed_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Audit log</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <AuditTable data={(data as unknown as AuditEntry[]) ?? []} />
    </div>
  );
}
