import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("user_companies")
    .select("companies(id, name, email, phone, currency, timezone)")
    .eq("user_id", user!.id)
    .limit(1)
    .single();

  const company = membership?.companies as unknown as {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    currency: string;
    timezone: string;
  } | null;

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">Settings</h1>
      {company ? (
        <SettingsForm company={company} />
      ) : (
        <p className="text-sm text-neutral-400">No company found.</p>
      )}
    </div>
  );
}
