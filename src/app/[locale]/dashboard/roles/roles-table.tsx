"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export type Role = {
  id: string;
  key: string;
  name: string;
  description: string | null;
};

const columns: ColumnDef<Role>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "key", header: "Key" },
  { accessorKey: "description", header: "Description" },
];

export function RolesTable({ data }: { data: Role[] }) {
  return <DataTable columns={columns} data={data} />;
}
