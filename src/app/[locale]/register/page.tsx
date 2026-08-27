import Link from "next/link";
import { signUp } from "./actions";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-border-subtle bg-surface-raised p-8 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-sm text-foreground-muted">Smart logistics across the Gulf.</p>
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <form action={signUp} className="space-y-3">
          <input type="hidden" name="locale" value={locale} />
          <input
            name="full_name"
            type="text"
            placeholder="Full name"
            required
            className="w-full rounded-lg border border-border-subtle bg-surface-raised px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border border-border-subtle bg-surface-raised px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="w-full rounded-lg border border-border-subtle bg-surface-raised px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-navy-900 px-3.5 py-2.5 text-sm font-medium text-white transition-all hover:bg-navy-800 hover:shadow-md active:scale-[0.99]"
          >
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-foreground-muted">
          Already have an account?{" "}
          <Link href={`/${locale}/login`} className="font-medium text-foreground underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
