import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GoogleMapDirectionsEmbed } from "@/components/google-map-embed";

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

  return (
    <div className="p-8">
      <h1 className="mb-1 text-2xl font-semibold">
        {route.origin} → {route.destination}
      </h1>
      <p className="mb-4 text-sm text-neutral-500">
        {route.distance ? `${route.distance} km` : "-"} · {route.duration ? `${route.duration} min` : "-"}
      </p>
      <GoogleMapDirectionsEmbed origin={route.origin} destination={route.destination} className="h-96 w-full rounded-md border" />
    </div>
  );
}
