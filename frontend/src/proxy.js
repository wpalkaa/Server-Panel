import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";

export async function proxy(request) {
    // Let Auth0 handle its own /auth/* routes (login, logout, callback)
    if (request.nextUrl.pathname.startsWith("/auth")) {
        return await auth0.middleware(request);
    }

    const authRes = await auth0.middleware(request);
    const { pathname } = request.nextUrl;

    const session = await auth0.getSession(request);

    if (session) {
        // Authenticated: redirect away from login page to home
        if (pathname === "/login") {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return authRes;
    }

    // Not authenticated: redirect to Auth0 login
    if (pathname !== "/login") {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return authRes;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
