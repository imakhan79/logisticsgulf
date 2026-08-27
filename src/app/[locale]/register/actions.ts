"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const locale = String(formData.get("locale") ?? "en");
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
    options: {
      data: { full_name: String(formData.get("full_name") ?? "") },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/${locale}/dashboard`,
    },
  });

  if (error) {
    redirect(`/${locale}/register?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/${locale}/login?message=${encodeURIComponent("Check your email to confirm your account")}`);
}
