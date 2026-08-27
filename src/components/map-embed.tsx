// Free, keyless map embeds via OpenStreetMap. The old unofficial
// maps.google.com/maps?...&output=embed trick was tried first (per the
// "free Google Maps, no key" request) but Google now blocks that iframe in
// practice (confirmed blank on live testing) — OSM's embed endpoint is
// actually reliable with no API key or billing account required.

function bboxAround(lat: number, lng: number, delta = 0.05) {
  return `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
}

export function MapLocationEmbed({
  query,
  className,
}: {
  /** "lat,lng" (preferred) or a free-text place name */
  query: string;
  className?: string;
}) {
  const [latStr, lngStr] = query.split(",").map((s) => s.trim());
  const lat = Number(latStr);
  const lng = Number(lngStr);
  const isCoords = Number.isFinite(lat) && Number.isFinite(lng) && query.includes(",");

  const src = isCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bboxAround(lat, lng)}&layer=mapnik&marker=${lat},${lng}`
    : `https://www.openstreetmap.org/export/embed.html?search=${encodeURIComponent(query)}&layer=mapnik`;

  return (
    <iframe
      src={src}
      className={className ?? "h-64 w-full rounded-md border"}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={`Map: ${query}`}
    />
  );
}

// True turn-by-turn routing needs a routing API (OSRM/Mapbox Directions),
// not just an iframe embed. Until one is wired up, show origin and
// destination as two verifiably-working location embeds side by side
// rather than fake a route line.
export function MapDirectionsEmbed({
  origin,
  destination,
  className,
}: {
  origin: string;
  destination: string;
  className?: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <p className="mb-1 text-xs font-medium text-neutral-500">Origin: {origin}</p>
        <MapLocationEmbed query={origin} className={className ?? "h-64 w-full rounded-md border"} />
      </div>
      <div>
        <p className="mb-1 text-xs font-medium text-neutral-500">Destination: {destination}</p>
        <MapLocationEmbed query={destination} className={className ?? "h-64 w-full rounded-md border"} />
      </div>
    </div>
  );
}
