import { ShieldAlert, FileWarning, Truck, IdCard } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardContext } from "./types";

function daysUntil(date: string | null) {
  if (!date) return null;
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export async function ComplianceDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;

  const [{ data: vehicles }, { data: drivers }] = await Promise.all([
    supabase.from("vehicles").select("id, plate_no, insurance_expiry, registration_expiry").eq("company_id", companyId),
    supabase.from("drivers").select("id, name, license_expiry").eq("company_id", companyId),
  ]);

  const expiringSoon = (date: string | null) => {
    const d = daysUntil(date);
    return d !== null && d <= 30;
  };

  const vehiclesExpiring = (vehicles ?? []).filter(
    (v) => expiringSoon(v.insurance_expiry) || expiringSoon(v.registration_expiry),
  );
  const driversExpiring = (drivers ?? []).filter((d) => expiringSoon(d.license_expiry));
  const trackedVehicles = (vehicles ?? []).filter((v) => v.insurance_expiry || v.registration_expiry).length;
  const trackedDrivers = (drivers ?? []).filter((d) => d.license_expiry).length;

  return (
    <>
      <p className="mb-4 text-xs text-foreground-muted">
        Based on insurance/registration/license expiry dates — {trackedVehicles} of {vehicles?.length ?? 0} vehicles and{" "}
        {trackedDrivers} of {drivers?.length ?? 0} drivers currently have dates on file.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Vehicles tracked" value={trackedVehicles} icon={<Truck className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Vehicle docs expiring" value={vehiclesExpiring.length} icon={<FileWarning className="h-4 w-4" />} accent="gold" />
        <KpiCard label="Drivers tracked" value={trackedDrivers} icon={<IdCard className="h-4 w-4" />} accent="ocean" />
        <KpiCard label="Licenses expiring" value={driversExpiring.length} icon={<ShieldAlert className="h-4 w-4" />} accent="teal" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle documents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {(vehicles ?? []).map((v) => (
                <li key={v.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                  <span className="font-medium">{v.plate_no}</span>
                  <span className="text-xs text-foreground-muted">
                    Ins: {v.insurance_expiry ?? "-"} · Reg: {v.registration_expiry ?? "-"}
                  </span>
                </li>
              ))}
              {!vehicles?.length && <li className="px-5 py-6 text-center text-sm text-foreground-muted">No vehicles yet.</li>}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Driver licenses</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {(drivers ?? []).map((d) => (
                <li key={d.id} className="flex items-center justify-between px-5 py-2.5 text-sm">
                  <span className="font-medium">{d.name}</span>
                  <span className="text-xs text-foreground-muted">{d.license_expiry ?? "-"}</span>
                </li>
              ))}
              {!drivers?.length && <li className="px-5 py-6 text-center text-sm text-foreground-muted">No drivers yet.</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
