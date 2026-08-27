"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export type Delivery = {
  id: string;
  status: string;
  signature_url: string | null;
  photo_url: string | null;
  shipments: { shipment_no: string } | null;
  drivers: { name: string } | null;
};

const columns: ColumnDef<Delivery>[] = [
  {
    id: "shipment",
    header: "Shipment #",
    cell: ({ row }) => row.original.shipments?.shipment_no ?? "-",
  },
  {
    id: "driver",
    header: "Driver",
    cell: ({ row }) => row.original.drivers?.name ?? "-",
  },
  { accessorKey: "status", header: "Status" },
  {
    id: "pod",
    header: "Proof of delivery",
    cell: ({ row }) => (row.original.signature_url || row.original.photo_url ? "Yes" : "-"),
  },
];

export function DeliveriesTable({ data }: { data: Delivery[] }) {
  return <DataTable columns={columns} data={data} />;
}
