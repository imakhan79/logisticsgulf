"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, Menu, X } from "lucide-react";

const NAV = [
  { href: "#solutions", label: "Solutions" },
  { href: "#network", label: "Network" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#trust", label: "Trust" },
];

export function Header({ locale }: { locale: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const otherLocale = locale === "en" ? "ar" : "en";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "border-b border-border-subtle bg-background/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-ocean-500 text-sm font-bold text-white">
            G
          </div>
          <span className="text-sm font-semibold tracking-tight">Gulf RouteWise</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-foreground-muted transition-colors hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href={`/${otherLocale}`} className="flex items-center gap-1 text-xs font-medium text-foreground-muted hover:text-foreground">
            <Globe className="h-3.5 w-3.5" />
            {locale === "en" ? "العربية" : "EN"}
          </a>
          <Link href={`/${locale}/login`} className="text-sm font-medium text-foreground-muted hover:text-foreground">
            Login
          </Link>
          <Link
            href={`/${locale}/register`}
            className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-navy-800 hover:shadow-md"
          >
            Get Started
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border-subtle bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-foreground-muted" onClick={() => setMobileOpen(false)}>
                {item.label}
              </a>
            ))}
            <Link href={`/${locale}/login`} className="text-sm font-medium">Login</Link>
            <Link href={`/${locale}/register`} className="rounded-lg bg-navy-900 px-4 py-2 text-center text-sm font-medium text-white">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
