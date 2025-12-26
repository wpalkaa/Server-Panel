
import { NextResponse } from "next/server";

export default function middleware( request ) {

    const session = request.cookies.get('user_session');
    const { pathname } = request.nextUrl;

    // If session, redirect from login
    if( pathname === '/login' ) {
        if( session ) {
            return NextResponse.redirect( new URL( '/', request.url) );
        }
        return NextResponse.next()
    }
    // If no session, redirect to login
    if( !session ) {
        return NextResponse.redirect( new URL('/login', request.url) );
    }

    return NextResponse.next()
}

export const config = {
    matcher: [ '/', '/login', '/files/:path*', '/resources', '/settings/:path*' ],
}