import { createClient } from "@/lib/supabase/server";
import { BranchesTable, type Branch } from "./branches-table";

export default async function BranchesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("branches")
    .select("id, name, is_active")
    .order("name")
    .limit(100);

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Branches</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <BranchesTable data={(data as Branch[]) ?? []} />
    </div>
  );
}
