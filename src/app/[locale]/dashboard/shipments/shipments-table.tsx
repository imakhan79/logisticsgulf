"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export type Shipment = {
  id: string;
  shipment_no: string;
  status: string;
  eta: string | null;
  created_at: string;
};

const columns: ColumnDef<Shipment>[] = [
  { accessorKey: "shipment_no", header: "Shipment #" },
  { accessorKey: "status", header: "Status" },
  {
    accessorKey: "eta",
    header: "ETA",
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value ? new Date(value).toLocaleString() : "-";
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
  },
];

export function ShipmentsTable({ data }: { data: Shipment[] }) {
  return <DataTable columns={columns} data={data} />;
}
