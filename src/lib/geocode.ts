// Free, keyless geocoding via OSM's Nominatim. Usage policy requires a
// descriptive User-Agent and caps requests at ~1/sec — fine for on-demand
// lookups of a route's origin/destination, not for bulk geocoding.
export async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { "User-Agent": "Gulf RouteWise/1.0 (demo)" }, next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const results = (await res.json()) as { lat: string; lon: string }[];
    if (!results[0]) return null;
    return { lat: Number(results[0].lat), lng: Number(results[0].lon) };
  } catch {
    return null;
  }
}
