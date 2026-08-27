import { createClient } from "@/lib/supabase/server";
import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function SupportPage() {
  if (!(await can("support.view"))) return <NoAccess module="support" />;

  const supabase = await createClient();
  const { data: tickets, error } = await supabase
    .from("support_tickets")
    .select("id, subject, status, priority, customers(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Support tickets</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-raised">
        <table className="w-full text-sm">
          <thead className="border-b border-border-subtle text-left text-xs text-foreground-muted">
            <tr>
              <th className="px-5 py-2 font-medium">Subject</th>
              <th className="px-5 py-2 font-medium">Customer</th>
              <th className="px-5 py-2 font-medium">Priority</th>
              <th className="px-5 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(tickets ?? []).map((t) => {
              const c = t.customers as unknown as { name: string } | null;
              return (
                <tr key={t.id} className="border-b border-border-subtle last:border-0">
                  <td className="px-5 py-2.5 font-medium">{t.subject}</td>
                  <td className="px-5 py-2.5 text-foreground-muted">{c?.name ?? "-"}</td>
                  <td className="px-5 py-2.5 capitalize text-foreground-muted">{t.priority}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={t.status} /></td>
                </tr>
              );
            })}
            {!tickets?.length && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-foreground-muted">
                  No tickets yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
