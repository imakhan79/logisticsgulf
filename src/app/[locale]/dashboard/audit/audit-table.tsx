"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { formatDateTime } from "@/lib/format-date";

export type AuditEntry = {
  id: string;
  table_name: string;
  action: string;
  changed_at: string;
  users: { email: string } | null;
};

const columns: ColumnDef<AuditEntry>[] = [
  { accessorKey: "table_name", header: "Table" },
  { accessorKey: "action", header: "Action" },
  {
    id: "changed_by",
    header: "Changed by",
    cell: ({ row }) => row.original.users?.email ?? "-",
  },
  {
    accessorKey: "changed_at",
    header: "When",
    cell: ({ getValue }) => formatDateTime(getValue<string>()),
  },
];

export function AuditTable({ data }: { data: AuditEntry[] }) {
  return <DataTable columns={columns} data={data} />;
}
