export function NoAccess({ module }: { module: string }) {
  return (
    <div className="p-8">
      <p className="text-sm text-neutral-500">
        You don&apos;t have permission to view <span className="font-medium">{module}</span>.
      </p>
    </div>
  );
}
