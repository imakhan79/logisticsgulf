"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS, type NavItem } from "./nav-config";

export function Sidebar({
  locale,
  visiblePermissions,
}: {
  locale: string;
  /** Set of module.view permission keys the current user has, from a server check. */
  visiblePermissions: Set<string>;
}) {
  const pathname = usePathname();
  const base = `/${locale}/dashboard`;

  function isVisible(item: NavItem) {
    return !item.permission || visiblePermissions.has(item.permission);
  }

  function isActive(href: string) {
    const full = href ? `${base}/${href}` : base;
    return href ? pathname.startsWith(full) : pathname === base;
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-e border-border-subtle bg-navy-950 text-white">
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-teal-400 to-ocean-500 text-xs font-bold">
          G
        </div>
        <span className="text-sm font-semibold tracking-tight">Gulf RouteWise</span>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter(isVisible);
          if (items.length === 0) return null;
          return (
            <div key={group.label}>
              <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href ? `${base}/${item.href}` : base}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-white/10 font-medium text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
