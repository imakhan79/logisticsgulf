"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, LogOut, Globe } from "lucide-react";
import { signOut } from "@/app/[locale]/dashboard/actions";
import { markNotificationRead } from "@/app/[locale]/dashboard/notifications-actions";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string | null;
  read: boolean;
  created_at: string;
};

export function Topbar({
  locale,
  userEmail,
  notifications,
}: {
  locale: string;
  userEmail: string;
  notifications: Notification[];
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [items, setItems] = useState(notifications);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unreadCount = items.filter((n) => !n.read).length;
  const otherLocale = locale === "en" ? "ar" : "en";
  const pathWithoutLocale =
    typeof window !== "undefined" ? window.location.pathname.replace(/^\/(en|ar)/, "") : "";

  async function onMarkRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await markNotificationRead(id);
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-end gap-2 border-b border-border-subtle bg-surface-raised px-6">
      <a
        href={`/${otherLocale}${pathWithoutLocale}`}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground-muted hover:bg-surface"
      >
        <Globe className="h-3.5 w-3.5" />
        {locale === "en" ? "العربية" : "EN"}
      </a>

      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setNotifOpen((v) => !v)}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </button>
        {notifOpen && (
          <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-border-subtle bg-surface-raised shadow-lg">
            <div className="border-b border-border-subtle px-4 py-2.5 text-xs font-semibold text-foreground-muted">
              Notifications
            </div>
            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-foreground-muted">No notifications.</p>
              ) : (
                items.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => onMarkRead(n.id)}
                    className={`block w-full border-b border-border-subtle px-4 py-3 text-left text-sm last:border-0 hover:bg-surface ${n.read ? "opacity-60" : ""}`}
                  >
                    <div className="font-medium">{n.title}</div>
                    {n.message && <div className="mt-0.5 text-xs text-foreground-muted">{n.message}</div>}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative" ref={userRef}>
        <button
          onClick={() => setUserOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <span className="max-w-[140px] truncate text-sm">{userEmail}</span>
          <ChevronDown className="h-3.5 w-3.5 text-foreground-muted" />
        </button>
        {userOpen && (
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-border-subtle bg-surface-raised shadow-lg">
            <form action={() => signOut(locale)}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm text-red-600 hover:bg-surface"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
