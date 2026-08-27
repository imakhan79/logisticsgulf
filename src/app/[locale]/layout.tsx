import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Plus_Jakarta_Sans, Noto_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import { routing, rtlLocales } from "@/i18n/routing";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const notoArabic = Noto_Sans_Arabic({ variable: "--font-noto-arabic", subsets: ["arabic"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gulf RouteWise — Smart Logistics Across the Gulf",
  description: "One intelligent platform for road, sea, air, warehouse, customs and cross-border logistics across the GCC.",
  manifest: "/manifest.webmanifest",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();
  const isRtl = rtlLocales.includes(locale);
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${jakarta.variable} ${notoArabic.variable} ${mono.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col ${isRtl ? "font-arabic" : "font-sans"}`}>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
