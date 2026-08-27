"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export type Member = {
  id: string;
  is_active: boolean;
  users: { email: string; full_name: string | null } | null;
  roles: { name: string } | null;
};

const columns: ColumnDef<Member>[] = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => row.original.users?.full_name || "-",
  },
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => row.original.users?.email ?? "-",
  },
  {
    id: "role",
    header: "Role",
    cell: ({ row }) => row.original.roles?.name ?? "-",
  },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ getValue }) => (getValue<boolean>() ? "Yes" : "No"),
  },
];

export function UsersTable({ data }: { data: Member[] }) {
  return <DataTable columns={columns} data={data} />;
}
