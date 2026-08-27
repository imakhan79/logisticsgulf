import { can } from "@/lib/permissions";
import { NoAccess } from "@/components/no-access";
import { CustomerForm } from "./customer-form";

export default async function NewCustomerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(await can("customers.create"))) return <NoAccess module="new customer" />;

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-semibold">New customer</h1>
      <CustomerForm locale={locale} />
    </div>
  );
}
