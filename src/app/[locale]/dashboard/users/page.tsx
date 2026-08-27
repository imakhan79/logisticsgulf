import { createClient } from "@/lib/supabase/server";
import { UsersTable, type Member } from "./users-table";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_companies")
    .select("id, is_active, users(email, full_name), roles(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Team members</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <UsersTable data={(data as unknown as Member[]) ?? []} />
    </div>
  );
}
