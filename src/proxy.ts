import { NextResponse, type NextRequest } from 'next/server';

// Puts /funnel behind the browser's built-in username/password prompt.
// Any username works — only the password (FUNNEL_PASSWORD) is checked.
// If the env var isn't set, the page stays locked.
export function proxy(request: NextRequest) {
  const password = process.env.FUNNEL_PASSWORD;
  const header = request.headers.get('authorization') ?? '';

  if (password && header.startsWith('Basic ')) {
    const decoded = atob(header.slice('Basic '.length));
    const supplied = decoded.slice(decoded.indexOf(':') + 1);
    if (supplied === password) return NextResponse.next();
  }

  return new NextResponse('Password required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Funnel"' },
  });
}

export const config = {
  matcher: '/funnel',
};
