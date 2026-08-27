import { Wallet, Receipt, TrendingDown, AlertCircle } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinanceBarChart } from "./finance-chart";
import type { DashboardContext } from "./types";

export async function FinanceDashboard({ ctx }: { ctx: DashboardContext }) {
  const { supabase, companyId } = ctx;

  const [{ data: invoices }, { data: expenses }] = await Promise.all([
    supabase.from("invoices").select("amount, status").eq("company_id", companyId),
    supabase.from("expenses").select("amount, expense_type").eq("company_id", companyId),
  ]);

  const paid = (invoices ?? []).filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.amount), 0);
  const unpaid = (invoices ?? []).filter((i) => i.status === "unpaid").reduce((s, i) => s + Number(i.amount), 0);
  const totalExpenses = (expenses ?? []).reduce((s, e) => s + Number(e.amount), 0);
  const overdueCount = (invoices ?? []).filter((i) => i.status === "unpaid").length;

  const expensesByCategory = Object.entries(
    (expenses ?? []).reduce<Record<string, number>>((acc, e) => {
      acc[e.expense_type] = (acc[e.expense_type] ?? 0) + Number(e.amount);
      return acc;
    }, {}),
  ).map(([label, value]) => ({ label, value }));

  const invoiceStatus = [
    { label: "Paid", value: paid },
    { label: "Unpaid", value: unpaid },
  ];

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard label="Revenue collected" value={paid} icon={<Wallet className="h-4 w-4" />} accent="teal" />
        <KpiCard label="Outstanding" value={unpaid} icon={<Receipt className="h-4 w-4" />} accent="gold" />
        <KpiCard label="Total expenses" value={totalExpenses} icon={<TrendingDown className="h-4 w-4" />} accent="navy" />
        <KpiCard label="Unpaid invoices" value={overdueCount} icon={<AlertCircle className="h-4 w-4" />} accent="ocean" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoices — paid vs unpaid</CardTitle>
          </CardHeader>
          <CardContent>
            <FinanceBarChart data={invoiceStatus} color="#0f9e96" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expenses by category</CardTitle>
          </CardHeader>
          <CardContent>
            <FinanceBarChart data={expensesByCategory} color="#c9982f" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
