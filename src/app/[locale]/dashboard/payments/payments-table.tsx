"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { formatDateTime } from "@/lib/format-date";

export type Payment = {
  id: string;
  amount: number;
  payment_method: string;
  paid_at: string;
  invoices: { invoice_number: string } | null;
};

const columns: ColumnDef<Payment>[] = [
  {
    id: "invoice",
    header: "Invoice #",
    cell: ({ row }) => row.original.invoices?.invoice_number ?? "-",
  },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "payment_method", header: "Method" },
  {
    accessorKey: "paid_at",
    header: "Paid at",
    cell: ({ getValue }) => formatDateTime(getValue<string>()),
  },
];

export function PaymentsTable({ data }: { data: Payment[] }) {
  return <DataTable columns={columns} data={data} />;
}
