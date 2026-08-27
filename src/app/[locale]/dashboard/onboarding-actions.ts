"use server";

import { createClient } from "@/lib/supabase/server";

export async function createCompany(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const countryId = String(formData.get("country_id"));

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({
      name: String(formData.get("name")),
      country_id: countryId,
      email: user.email,
    })
    .select("id")
    .single();

  if (companyError || !company) {
    return { error: companyError?.message ?? "Could not create company" };
  }

  const { data: role } = await supabase
    .from("roles")
    .select("id")
    .eq("key", "company_admin")
    .single();

  const { error: membershipError } = await supabase.from("user_companies").insert({
    user_id: user.id,
    company_id: company.id,
    country_id: countryId,
    role_id: role?.id,
  });

  if (membershipError) return { error: membershipError.message };

  return { error: null };
}
