import { GulfNetworkVisual } from "@/components/marketing/gulf-network-visual";
import { LoginCard } from "./login-card";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { locale } = await params;
  const { error, message } = await searchParams;

  return (
    <div className="flex min-h-screen flex-1">
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-navy-950 lg:flex">
        <GulfNetworkVisual className="h-full w-full max-w-2xl" />
        <div className="absolute bottom-12 left-12 max-w-sm text-white">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-ocean-500 text-sm font-bold">
            G
          </div>
          <h2 className="text-2xl font-semibold leading-tight tracking-tight">
            Smart Logistics Across the Gulf
          </h2>
          <p className="mt-2 text-sm text-white/60">
            One intelligent platform for road, sea, air, warehouse, customs and cross-border logistics
            across the GCC.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <LoginCard locale={locale} error={error} message={message} />
      </div>
    </div>
  );
}
