"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { formatDate } from "@/lib/format-date";

export type Order = {
  id: string;
  order_no: string;
  origin: string | null;
  destination: string | null;
  weight: number | null;
  volume: number | null;
  status: string;
  created_at: string;
  customers: { name: string } | null;
};

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "order_no",
    header: "Order #",
    cell: ({ row }) => (
      <Link href={`orders/${row.original.id}`} className="text-neutral-900 underline underline-offset-2">
        {row.original.order_no}
      </Link>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => row.original.customers?.name ?? "-",
  },
  { accessorKey: "origin", header: "Origin" },
  { accessorKey: "destination", header: "Destination" },
  { accessorKey: "weight", header: "Weight (kg)" },
  { accessorKey: "volume", header: "Volume (m³)" },
  { accessorKey: "status", header: "Status" },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
];

export function OrdersTable({ data }: { data: Order[] }) {
  return <DataTable columns={columns} data={data} />;
}
