"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export type Shipment = {
  id: string;
  tracking_number: string;
  status: string;
  origin_address: string | null;
  destination_address: string | null;
  created_at: string;
};

const columns: ColumnDef<Shipment>[] = [
  { accessorKey: "tracking_number", header: "Tracking #" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "origin_address", header: "Origin" },
  { accessorKey: "destination_address", header: "Destination" },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
  },
];

export function ShipmentsTable({ data }: { data: Shipment[] }) {
  return <DataTable columns={columns} data={data} />;
}
