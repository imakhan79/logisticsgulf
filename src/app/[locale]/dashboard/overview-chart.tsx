"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function OverviewChart({ data }: { data: { status: string; count: number }[] }) {
  if (!data.length) {
    return <p className="text-sm text-neutral-400">No shipment data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="status" fontSize={12} />
        <YAxis allowDecimals={false} fontSize={12} />
        <Bar dataKey="count" fill="#171717" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
