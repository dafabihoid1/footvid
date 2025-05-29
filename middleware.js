// middleware.ts
import { NextResponse }                 from "next/server";
import { createMiddlewareClient }       from "@supabase/auth-helpers-nextjs";

export const config = {
  // Protect everything except _next, API routes, and static assets:
  matcher: [
    "/((?!_next|api|favicon.ico|manifest.json|icons/|logo.png).*)"
  ],
};

export async function middleware(req) {
  // Let Supabase pull cookies from req/res under the hood
  const res      = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // If not logged in and not already on login page, redirect
  if (!session && pathname !== "/login") {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return res;
}
