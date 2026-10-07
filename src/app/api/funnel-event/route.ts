import { Redis } from '@upstash/redis';
import {
  ALLOWED_FUNNEL_EVENTS,
  funnelDay,
  funnelKey,
  LANDED_EVENTS,
  viewsName,
  VISITORS_NAME,
} from '@/lib/funnel';

function isId(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= 64;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const { sessionId, visitorId, eventName } = (body ?? {}) as {
    sessionId?: unknown;
    visitorId?: unknown;
    eventName?: unknown;
  };

  if (
    !isId(sessionId) ||
    typeof eventName !== 'string' ||
    !ALLOWED_FUNNEL_EVENTS.has(eventName)
  ) {
    return Response.json({ ok: false }, { status: 400 });
  }

  try {
    const day = funnelDay();
    const pipeline = Redis.fromEnv()
      .pipeline()
      .sadd(funnelKey(eventName), sessionId)
      .sadd(funnelKey(eventName, day), sessionId);
    if (LANDED_EVENTS.includes(eventName)) {
      const visitor = isId(visitorId) ? visitorId : sessionId;
      pipeline
        .incr(funnelKey(viewsName(eventName)))
        .incr(funnelKey(viewsName(eventName), day))
        .sadd(funnelKey(VISITORS_NAME), visitor)
        .sadd(funnelKey(VISITORS_NAME, day), visitor);
    }
    await pipeline.exec();
  } catch (err) {
    console.error('funnel-event write error:', err);
  }

  return Response.json({ ok: true });
}
