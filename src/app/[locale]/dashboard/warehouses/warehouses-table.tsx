"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export type Warehouse = {
  id: string;
  name: string;
  capacity: number | null;
  is_active: boolean;
};

const columns: ColumnDef<Warehouse>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "capacity", header: "Capacity" },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ getValue }) => (getValue<boolean>() ? "Yes" : "No"),
  },
];

export function WarehousesTable({ data }: { data: Warehouse[] }) {
  return <DataTable columns={columns} data={data} />;
}
