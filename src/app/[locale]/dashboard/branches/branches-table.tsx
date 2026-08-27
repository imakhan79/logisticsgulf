"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export type Branch = {
  id: string;
  name: string;
  is_active: boolean;
};

const columns: ColumnDef<Branch>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ getValue }) => (getValue<boolean>() ? "Yes" : "No"),
  },
];

export function BranchesTable({ data }: { data: Branch[] }) {
  return <DataTable columns={columns} data={data} />;
}
