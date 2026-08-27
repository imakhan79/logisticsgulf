import { createClient } from "@/lib/supabase/server";
import { RolesTable, type Role } from "./roles-table";

export default async function RolesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("roles")
    .select("id, key, name, description")
    .order("name");

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Roles</h1>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <RolesTable data={(data as Role[]) ?? []} />
    </div>
  );
}
