"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

export type InventoryItem = {
  id: string;
  sku: string;
  product: string;
  quantity: number;
  warehouses: { name: string } | null;
};

const columns: ColumnDef<InventoryItem>[] = [
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "product", header: "Product" },
  { accessorKey: "quantity", header: "Quantity" },
  {
    id: "warehouse",
    header: "Warehouse",
    cell: ({ row }) => row.original.warehouses?.name ?? "-",
  },
];

export function InventoryTable({ data }: { data: InventoryItem[] }) {
  return <DataTable columns={columns} data={data} />;
}
