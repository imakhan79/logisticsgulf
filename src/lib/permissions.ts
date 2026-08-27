import { createClient } from "@/lib/supabase/server";

export async function getCurrentCompanyId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_companies")
    .select("company_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .single();

  return data?.company_id ?? null;
}

/** Checks a module.action permission (e.g. "shipments.create") for the
 * current user's role in their active company, via the has_permission()
 * SQL function (which also bypasses for super_admin). */
export async function can(permissionKey: string): Promise<boolean> {
  const supabase = await createClient();
  const companyId = await getCurrentCompanyId();
  if (!companyId) return false;

  const { data, error } = await supabase.rpc("has_permission", {
    target_company_id: companyId,
    permission_key: permissionKey,
  });

  return !error && !!data;
}
