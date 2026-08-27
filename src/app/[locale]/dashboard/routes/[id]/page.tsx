import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MapDirectionsEmbed } from "@/components/map-embed";
import { geocode } from "@/lib/geocode";

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: route } = await supabase
    .from("routes")
    .select("id, origin, destination, distance, duration")
    .eq("id", id)
    .single();

  if (!route) notFound();

  const [originCoords, destinationCoords] = await Promise.all([
    geocode(route.origin),
    geocode(route.destination),
  ]);

  return (
    <div className="p-8">
      <h1 className="mb-1 text-2xl font-semibold">
        {route.origin} → {route.destination}
      </h1>
      <p className="mb-4 text-sm text-neutral-500">
        {route.distance ? `${route.distance} km` : "-"} · {route.duration ? `${route.duration} min` : "-"}
      </p>
      <MapDirectionsEmbed
        origin={originCoords ? { label: route.origin, ...originCoords } : null}
        destination={destinationCoords ? { label: route.destination, ...destinationCoords } : null}
        className="h-96 w-full rounded-md border"
      />
    </div>
  );
}
