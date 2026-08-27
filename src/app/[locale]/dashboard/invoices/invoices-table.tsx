"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export type Invoice = {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string | null;
  customers: { name: string } | null;
};

const columns: ColumnDef<Invoice>[] = [
  { accessorKey: "invoice_number", header: "Invoice #" },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => row.original.customers?.name ?? "-",
  },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "status", header: "Status" },
  {
    accessorKey: "due_date",
    header: "Due date",
    cell: ({ getValue }) => {
      const v = getValue<string | null>();
      return v ? new Date(v).toLocaleDateString() : "-";
    },
  },
];

export function InvoicesTable({ data }: { data: Invoice[] }) {
  return <DataTable columns={columns} data={data} />;
}
