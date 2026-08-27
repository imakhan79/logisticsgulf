"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export type Driver = {
  id: string;
  name: string;
  license_no: string | null;
  phone: string | null;
  status: string;
};

const columns: ColumnDef<Driver>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "license_no", header: "License #" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "status", header: "Status" },
];

export function DriversTable({ data }: { data: Driver[] }) {
  return <DataTable columns={columns} data={data} />;
}
