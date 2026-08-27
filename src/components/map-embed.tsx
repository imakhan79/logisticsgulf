// Free, keyless map embeds via OpenStreetMap. The old unofficial
// maps.google.com/maps?...&output=embed trick was tried first (per the
// "free Google Maps, no key" request) but Google now blocks that iframe in
// practice (confirmed blank on live testing) — OSM's embed endpoint is
// actually reliable with no API key or billing account required.
//
// The embed only takes coordinates (no place-name search param, despite
// what it might look like) — geocode free-text addresses server-side with
// lib/geocode.ts before rendering this.

function bboxAround(lat: number, lng: number, delta = 0.05) {
  return `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
}

export function MapLocationEmbed({
  lat,
  lng,
  label,
  className,
}: {
  lat: number;
  lng: number;
  label?: string;
  className?: string;
}) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bboxAround(lat, lng)}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <iframe
      src={src}
      className={className ?? "h-64 w-full rounded-md border"}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={label ? `Map: ${label}` : "Map"}
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
  origin: { label: string; lat: number; lng: number } | null;
  destination: { label: string; lat: number; lng: number } | null;
  className?: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <p className="mb-1 text-xs font-medium text-neutral-500">
          Origin: {origin?.label ?? "unknown"}
        </p>
        {origin ? (
          <MapLocationEmbed lat={origin.lat} lng={origin.lng} label={origin.label} className={className} />
        ) : (
          <div className={className ?? "flex h-64 w-full items-center justify-center rounded-md border text-sm text-neutral-400"}>
            Could not locate this address
          </div>
        )}
      </div>
      <div>
        <p className="mb-1 text-xs font-medium text-neutral-500">
          Destination: {destination?.label ?? "unknown"}
        </p>
        {destination ? (
          <MapLocationEmbed lat={destination.lat} lng={destination.lng} label={destination.label} className={className} />
        ) : (
          <div className={className ?? "flex h-64 w-full items-center justify-center rounded-md border text-sm text-neutral-400"}>
            Could not locate this address
          </div>
        )}
      </div>
    </div>
  );
}
