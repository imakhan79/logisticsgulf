"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export type Vehicle = {
  id: string;
  plate_no: string;
  vehicle_type: string | null;
  capacity: number | null;
  status: string;
};

const columns: ColumnDef<Vehicle>[] = [
  { accessorKey: "plate_no", header: "Plate #" },
  { accessorKey: "vehicle_type", header: "Type" },
  { accessorKey: "capacity", header: "Capacity" },
  { accessorKey: "status", header: "Status" },
];

export function VehiclesTable({ data }: { data: Vehicle[] }) {
  return <DataTable columns={columns} data={data} />;
}
