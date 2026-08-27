import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { NetworkSection } from "@/components/marketing/network-section";
import { SolutionsSection } from "@/components/marketing/solutions-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeaturesSection } from "@/components/marketing/features-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { Footer } from "@/components/marketing/footer";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect(`/${locale}/dashboard`);

  return (
    <div className="flex-1">
      <Header locale={locale} />
      <Hero locale={locale} />
      <SolutionsSection />
      <NetworkSection />
      <HowItWorks />
      <FeaturesSection />
      <TrustSection />
      <CtaSection locale={locale} />
      <Footer locale={locale} />
    </div>
  );
}
