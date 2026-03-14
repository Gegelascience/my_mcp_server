import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`Proxy middleware received request for: ${pathname}`);

  // Si la requête concerne votre MCP, on laisse passer sans transformation
  if (pathname.includes('/mcp')) {
    return NextResponse.next();
  }

  // ... reste de votre logique
}

export const config = {
  // IMPORTANT : Assurez-vous que le matcher n'ignore pas votre route
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};