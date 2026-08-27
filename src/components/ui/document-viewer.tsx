import { FileText, ExternalLink } from "lucide-react";

function isImage(url: string) {
  return /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(url);
}
function isPdf(url: string) {
  return /\.pdf(\?|$)/i.test(url);
}

export function DocumentViewer({ url, name }: { url: string; name?: string }) {
  if (isImage(url)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={name ?? "Document"} className="max-h-96 w-full rounded-lg border border-border-subtle object-contain" />;
  }

  if (isPdf(url)) {
    return <iframe src={url} title={name ?? "Document"} className="h-96 w-full rounded-lg border border-border-subtle" />;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface p-4 text-sm hover:bg-surface-raised"
    >
      <FileText className="h-5 w-5 text-foreground-muted" />
      <span className="flex-1 truncate">{name ?? "Document"}</span>
      <ExternalLink className="h-4 w-4 text-foreground-muted" />
    </a>
  );
}
