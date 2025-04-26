import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const protectedRoutes = [
        '/test',
        '/result'
    ];

    const token = request.cookies.get('access_token')?.value;

    if (protectedRoutes.includes(pathname) && !token) {
        const loginUrl = new URL('/', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/test',
        '/result'
    ],
};