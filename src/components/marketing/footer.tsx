import Link from "next/link";

const COLUMNS = [
  { title: "Platform", links: ["Solutions", "Network", "How it works"] },
  { title: "Solutions", links: ["Road Freight", "Sea Freight", "Air Freight", "Warehousing"] },
  { title: "Countries", links: ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain"] },
];

export function Footer({ locale }: { locale: string }) {
  return (
    <footer className="border-t border-border-subtle bg-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-teal-400 to-ocean-500 text-xs font-bold text-white">
                G
              </div>
              <span className="text-sm font-semibold">Gulf RouteWise</span>
            </div>
            <p className="mt-3 text-xs text-foreground-muted">Smart logistics across the Gulf.</p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link} className="text-xs text-foreground-muted">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border-subtle pt-6 text-xs text-foreground-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Gulf RouteWise. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href={`/${locale}/login`} className="hover:text-foreground">
              Login
            </Link>
            <Link href={`/${locale}/register`} className="hover:text-foreground">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
