import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DesignSystemShowcase } from "./showcase";

export default async function DesignSystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: membership } = await supabase
    .from("user_companies")
    .select("company_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  return (
    <div className="p-8">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Design system</h1>
      <p className="mb-8 text-sm text-foreground-muted">Live component reference for Gulf RouteWise.</p>
      {membership ? (
        <DesignSystemShowcase companyId={membership.company_id} />
      ) : (
        <p className="text-sm text-foreground-muted">Join a company to see the file upload demo.</p>
      )}
    </div>
  );
}
