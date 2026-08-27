"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { formatDate, formatDateTime } from "@/lib/format-date";

export type Shipment = {
  id: string;
  shipment_no: string;
  status: string;
  eta: string | null;
  created_at: string;
};

const columns: ColumnDef<Shipment>[] = [
  {
    accessorKey: "shipment_no",
    header: "Shipment #",
    cell: ({ row }) => (
      <Link href={`shipments/${row.original.id}`} className="text-neutral-900 underline underline-offset-2">
        {row.original.shipment_no}
      </Link>
    ),
  },
  { accessorKey: "status", header: "Status" },
  {
    accessorKey: "eta",
    header: "ETA",
    cell: ({ getValue }) => {
      const value = getValue<string | null>();
      return value ? formatDateTime(value) : "-";
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
];

export function ShipmentsTable({ data }: { data: Shipment[] }) {
  return <DataTable columns={columns} data={data} />;
}
