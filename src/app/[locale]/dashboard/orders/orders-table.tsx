"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

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
  { accessorKey: "order_no", header: "Order #" },
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
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
  },
];

export function OrdersTable({ data }: { data: Order[] }) {
  return <DataTable columns={columns} data={data} />;
}
