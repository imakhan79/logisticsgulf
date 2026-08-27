export function ComingSoon({ title, note }: { title: string; note: string }) {
  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
      <p className="max-w-lg text-sm text-neutral-500">{note}</p>
    </div>
  );
}
