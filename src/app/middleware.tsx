import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  // Remove port if present
  let cleanedHost = host.split(":")[0];

  // Determine if localhost
  const isLocalhost =
    cleanedHost === "localhost" || cleanedHost.endsWith(".localhost");

  // Base domain for production
  const baseDomain = isLocalhost ? "localhost" : "sellexplore.shop";

  // Remove 'www.' prefix if present
  if (cleanedHost.startsWith("www.")) {
    cleanedHost = cleanedHost.slice(4);
  }

  const domainParts = cleanedHost.split(".");
  let subdomain = "";

  if (isLocalhost) {
    // e.g., store.localhost
    if (domainParts.length > 1) {
      subdomain = domainParts[0];
    }
  } else {
    // e.g., store.sellexplore.shop OR sub.sub.sellexplore.shop
    if (domainParts.length > 2) {
      subdomain = domainParts[0]; // first segment after removing www
    }
  }

  const isMainDomain = cleanedHost === baseDomain || !subdomain;

  if (!isMainDomain) {
    url.pathname = `/vendor/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
