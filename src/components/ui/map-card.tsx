import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { MapLocationEmbed } from "@/components/map-embed";

export function MapCard({
  title,
  lat,
  lng,
  label,
  footer,
}: {
  title: string;
  lat: number;
  lng: number;
  label?: string;
  footer?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <MapLocationEmbed lat={lat} lng={lng} label={label} className="h-56 w-full rounded-lg border border-border-subtle" />
        {footer && <div className="mt-2 text-xs text-foreground-muted">{footer}</div>}
      </CardContent>
    </Card>
  );
}
