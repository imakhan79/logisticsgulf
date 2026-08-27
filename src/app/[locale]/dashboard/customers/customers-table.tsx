"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export type Customer = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
};

const columns: ColumnDef<Customer>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "address", header: "Address" },
];

export function CustomersTable({ data }: { data: Customer[] }) {
  return <DataTable columns={columns} data={data} />;
}
