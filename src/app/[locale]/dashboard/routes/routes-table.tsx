"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DataTable } from "@/components/data-table";

export type Route = {
  id: string;
  origin: string;
  destination: string;
  distance: number | null;
  duration: number | null;
};

const columns: ColumnDef<Route>[] = [
  {
    accessorKey: "origin",
    header: "Origin",
    cell: ({ row }) => (
      <Link href={`routes/${row.original.id}`} className="text-neutral-900 underline underline-offset-2">
        {row.original.origin}
      </Link>
    ),
  },
  { accessorKey: "destination", header: "Destination" },
  { accessorKey: "distance", header: "Distance (km)" },
  { accessorKey: "duration", header: "Duration (min)" },
];

export function RoutesTable({ data }: { data: Route[] }) {
  return <DataTable columns={columns} data={data} />;
}
