import type { createClient } from "@/lib/supabase/server";

export type DashboardContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  locale: string;
  userId: string;
  userEmail: string;
  companyId: string;
  countryId: string | null;
  companyName: string;
  roleKey: string;
  roleName: string;
  memberships: { companyName: string; roleName: string }[];
};
