"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateCompany(companyId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("companies")
    .update({
      name: String(formData.get("name")),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      currency: String(formData.get("currency") ?? "AED"),
      timezone: String(formData.get("timezone") ?? "Asia/Dubai"),
    })
    .eq("id", companyId);

  if (error) return { error: error.message };

  revalidatePath("/[locale]/dashboard/settings", "page");
  return { error: null };
}
