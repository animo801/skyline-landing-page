import { NextResponse, type NextRequest } from 'next/server';
import {
  AB_COOKIE,
  AB_COOKIE_MAX_AGE_SECONDS,
  AB_SPLIT_B,
  isVariant,
  type Variant,
} from '@/lib/abTest';

// Search engines and link-preview crawlers always get the original page,
// so the test never changes what's indexed (the /v2 design is noindex).
const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|facebot|whatsapp|preview|lighthouse/i;

// "/" A/B test: assigns each new visitor a variant, remembers it in a
// cookie, and serves variant B by rewriting to /v2 — the address bar stays
// on "/". Add ?variant=a or ?variant=b to force (and remember) a variant,
// e.g. to preview both designs.
function homeAbTest(request: NextRequest) {
  if (BOT_PATTERN.test(request.headers.get('user-agent') ?? '')) {
    return NextResponse.next();
  }

  const forced = request.nextUrl.searchParams.get('variant');
  const existing = request.cookies.get(AB_COOKIE)?.value;
  const variant: Variant = isVariant(forced)
    ? forced
    : isVariant(existing)
      ? existing
      : Math.random() < AB_SPLIT_B
        ? 'b'
        : 'a';

  const response =
    variant === 'b'
      ? NextResponse.rewrite(new URL(`/v2${request.nextUrl.search}`, request.url))
      : NextResponse.next();

  if (variant !== existing) {
    response.cookies.set(AB_COOKIE, variant, {
      maxAge: AB_COOKIE_MAX_AGE_SECONDS,
      path: '/',
      sameSite: 'lax',
    });
  }
  return response;
}

// Puts /funnel behind the browser's built-in username/password prompt.
// Any username works — only the password (FUNNEL_PASSWORD) is checked.
// If the env var isn't set, the page stays locked.
function funnelAuth(request: NextRequest) {
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

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/funnel') return funnelAuth(request);
  return homeAbTest(request);
}

export const config = {
  matcher: ['/', '/funnel'],
};
