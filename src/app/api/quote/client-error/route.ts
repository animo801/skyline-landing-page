// Receives reports of quote submissions that failed in the visitor's
// browser — including ones where the request never reached /api/quote —
// so they show up in the Vercel logs alongside the [quote …] lines.
export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // Log what we can even if the body is malformed.
  }

  const clip = (value: unknown) =>
    typeof value === 'string' ? value.slice(0, 300) : undefined;

  console.error(
    `[quote ${clip(body.eventId)?.slice(0, 8) ?? 'unknown'}] Browser reported failed submission`,
    JSON.stringify({
      reason: clip(body.reason),
      status: typeof body.status === 'number' ? body.status : undefined,
      attempt: typeof body.attempt === 'number' ? body.attempt : undefined,
      online: typeof body.online === 'boolean' ? body.online : undefined,
      page: clip(body.page),
      userAgent: request.headers.get('user-agent'),
    })
  );

  return Response.json({ ok: true });
}
