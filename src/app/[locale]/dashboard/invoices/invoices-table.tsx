"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { formatDate } from "@/lib/format-date";

export type Invoice = {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string | null;
  customers: { name: string } | null;
};

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoice_number",
    header: "Invoice #",
    cell: ({ row }) => (
      <Link href={`invoices/${row.original.id}`} className="text-neutral-900 underline underline-offset-2">
        {row.original.invoice_number}
      </Link>
    ),
  },
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
      return v ? formatDate(v) : "-";
    },
  },
];

export function InvoicesTable({ data }: { data: Invoice[] }) {
  return <DataTable columns={columns} data={data} />;
}
