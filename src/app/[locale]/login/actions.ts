"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signInWithPassword(formData: FormData) {
  const locale = String(formData.get("locale") ?? "en");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });

  if (error) {
    redirect(`/${locale}/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/${locale}/dashboard`);
}

export async function signInWithMagicLink(formData: FormData) {
  const locale = String(formData.get("locale") ?? "en");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: String(formData.get("email")),
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/${locale}/dashboard`,
    },
  });

  if (error) {
    redirect(`/${locale}/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/${locale}/login?message=Check your email for the magic link`);
}

export async function signInWithOAuth(provider: "google" | "azure", locale: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/${locale}/dashboard`,
    },
  });

  if (error) {
    redirect(`/${locale}/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(data.url);
}
