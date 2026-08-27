import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

function stripLocale(pathname: string) {
  const match = pathname.match(/^\/([a-z]{2})(\/.*|$)/);
  if (match && (routing.locales as readonly string[]).includes(match[1])) {
    return match[2] || "/";
  }
  return pathname;
}

export async function updateSession(request: NextRequest, baseResponse: NextResponse) {
  let supabaseResponse = baseResponse;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const bare = stripLocale(request.nextUrl.pathname);
  const isAuthRoute = bare.startsWith("/login") || bare.startsWith("/auth");

  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone();
    const localeMatch = request.nextUrl.pathname.match(/^\/([a-z]{2})(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
