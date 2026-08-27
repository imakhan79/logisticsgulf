"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { signInWithPassword, signInWithMagicLink, signInWithOAuth, demoSignIn } from "./actions";
import { DEMO_USERS } from "./demo-users";

export function LoginCard({
  locale,
  t,
  error,
  message,
}: {
  locale: string;
  t: (key: string) => string;
  error?: string;
  message?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-sm text-foreground-muted">{t("subtitle")}</p>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
      {message && (
        <p className="mt-4 rounded-lg bg-teal-500/10 px-3 py-2 text-sm text-teal-600">{message}</p>
      )}

      <form action={signInWithPassword} className="mt-6 space-y-3">
        <input type="hidden" name="locale" value={locale} />
        <input
          name="email"
          type="email"
          placeholder={t("email")}
          required
          className="w-full rounded-lg border border-border-subtle bg-surface-raised px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
        <input
          name="password"
          type="password"
          placeholder={t("password")}
          required
          className="w-full rounded-lg border border-border-subtle bg-surface-raised px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-navy-900 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-navy-800 hover:shadow-md active:scale-[0.99]"
        >
          {t("signIn")}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border-subtle" />
        <span className="text-xs text-foreground-muted">or</span>
        <div className="h-px flex-1 bg-border-subtle" />
      </div>

      <form action={signInWithMagicLink} className="space-y-2">
        <input type="hidden" name="locale" value={locale} />
        <input
          name="email"
          type="email"
          placeholder={t("magicLinkEmail")}
          required
          className="w-full rounded-lg border border-border-subtle bg-surface-raised px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
        <button
          type="submit"
          className="w-full rounded-lg border border-border-subtle px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
        >
          {t("sendMagicLink")}
        </button>
      </form>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <form action={signInWithOAuth.bind(null, "google", locale)}>
          <button
            type="submit"
            className="w-full rounded-lg border border-border-subtle px-3.5 py-2.5 text-xs font-medium transition-colors hover:bg-surface"
          >
            {t("google")}
          </button>
        </form>
        <form action={signInWithOAuth.bind(null, "azure", locale)}>
          <button
            type="submit"
            className="w-full rounded-lg border border-border-subtle px-3.5 py-2.5 text-xs font-medium transition-colors hover:bg-surface"
          >
            {t("microsoft")}
          </button>
        </form>
      </div>

      <div className="mt-6 flex items-center gap-1.5 text-xs text-foreground-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-teal-500" />
        Secure enterprise access
      </div>

      <div className="mt-8 rounded-xl border border-border-subtle bg-surface p-4">
        <h2 className="text-xs font-semibold text-foreground-muted">Demo logins</h2>
        <p className="mt-0.5 text-xs text-foreground-muted">One click, seeded demo accounts.</p>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {DEMO_USERS.map((demo) => (
            <form key={demo.role} action={demoSignIn.bind(null, demo.email, locale)}>
              <button
                type="submit"
                className="w-full rounded-md border border-border-subtle bg-surface-raised px-2 py-1.5 text-xs font-medium transition-colors hover:bg-surface"
              >
                {demo.label}
              </button>
            </form>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
