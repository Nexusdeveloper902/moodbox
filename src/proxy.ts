import { NextResponse, type NextRequest } from "next/server";

// Optimistic check only (cookie present → let the page verify the session).
// Gives anonymous visitors a real 307 to login instead of an in-stream redirect.
export function proxy(request: NextRequest) {
  if (request.cookies.has("mb_session")) return NextResponse.next();
  const { pathname, search } = request.nextUrl;
  return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname + search)}`, request.url));
}

export const config = { matcher: ["/cuenta/:path*", "/checkout", "/pedido/:path*"] };
