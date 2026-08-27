import { getTranslations } from "next-intl/server";
import { signInWithPassword, signInWithMagicLink, signInWithOAuth, demoSignIn } from "./actions";
import { DEMO_USERS } from "./demo-users";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { locale } = await params;
  const { error, message } = await searchParams;
  const t = await getTranslations("login");

  return (
    <div className="flex min-h-screen flex-1 flex-wrap items-center justify-center gap-6 bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-white p-8 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-neutral-500">{t("subtitle")}</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <form action={signInWithPassword} className="space-y-3">
          <input type="hidden" name="locale" value={locale} />
          <input
            name="email"
            type="email"
            placeholder={t("email")}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <input
            name="password"
            type="password"
            placeholder={t("password")}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white"
          >
            {t("signIn")}
          </button>
        </form>

        <form action={signInWithMagicLink} className="space-y-2">
          <input type="hidden" name="locale" value={locale} />
          <input
            name="email"
            type="email"
            placeholder={t("magicLinkEmail")}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-md border px-3 py-2 text-sm font-medium"
          >
            {t("sendMagicLink")}
          </button>
        </form>

        <div className="flex gap-2">
          <form
            action={async () => {
              "use server";
              await signInWithOAuth("google", locale);
            }}
            className="flex-1"
          >
            <button type="submit" className="w-full rounded-md border px-3 py-2 text-sm">
              {t("google")}
            </button>
          </form>
          <form
            action={async () => {
              "use server";
              await signInWithOAuth("azure", locale);
            }}
            className="flex-1"
          >
            <button type="submit" className="w-full rounded-md border px-3 py-2 text-sm">
              {t("microsoft")}
            </button>
          </form>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-3 rounded-lg border bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold">Demo logins</h2>
          <p className="text-xs text-neutral-500">One click, no password needed. Seeded demo accounts.</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_USERS.map((demo) => (
            <form
              key={demo.role}
              action={async () => {
                "use server";
                await demoSignIn(demo.email, locale);
              }}
            >
              <button
                type="submit"
                className="w-full rounded-md border px-2 py-1.5 text-xs font-medium hover:bg-neutral-50"
              >
                {demo.label}
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
