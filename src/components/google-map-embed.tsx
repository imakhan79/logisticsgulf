// Keyless Google Maps embed (no GOOGLE_MAP_KEY / billing account needed).
// Swap to the official Maps Embed API (requires a key) later if you want
// custom markers, live-updating pins, or higher usage guarantees.

export function GoogleMapLocationEmbed({ query, className }: { query: string; className?: string }) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=13&output=embed`;
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

export function GoogleMapDirectionsEmbed({
  origin,
  destination,
  className,
}: {
  origin: string;
  destination: string;
  className?: string;
}) {
  const src = `https://maps.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&output=embed`;
  return (
    <iframe
      src={src}
      className={className ?? "h-64 w-full rounded-md border"}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={`Route: ${origin} to ${destination}`}
    />
  );
}
