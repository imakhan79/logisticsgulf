"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "@/components/data-table";

export type Quote = {
  id: string;
  quote_no: string;
  status: string;
  amount: number | null;
  created_at: string;
  customers: { name: string } | null;
};

const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: "quote_no",
    header: "Quote #",
    cell: ({ row }) => (
      <Link href={`quotes/${row.original.id}`} className="text-neutral-900 underline underline-offset-2">
        {row.original.quote_no}
      </Link>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => row.original.customers?.name ?? "-",
  },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "amount", header: "Amount" },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
  },
];

export function QuotesTable({ data }: { data: Quote[] }) {
  return <DataTable columns={columns} data={data} />;
}
