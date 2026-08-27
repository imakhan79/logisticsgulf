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
    <div className="flex min-h-screen flex-1 items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-white p-8 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="text-sm text-neutral-500">Multi-tenant logistics platform</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <form action={signUp} className="space-y-3">
          <input type="hidden" name="locale" value={locale} />
          <input
            name="full_name"
            type="text"
            placeholder="Full name"
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
          >
            Create account
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href={`/${locale}/login`} className="font-medium text-neutral-900 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
