import { Redis } from '@upstash/redis';
import {
  ALLOWED_FUNNEL_EVENTS,
  funnelDay,
  funnelKey,
  FUNNEL_EVENTS,
  LANDED_EVENTS,
  OUT_OF_AREA_ZIP_SESSIONS_NAME,
  OUT_OF_AREA_ZIPS_NAME,
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

  const { sessionId, visitorId, eventName, zip } = (body ?? {}) as {
    sessionId?: unknown;
    visitorId?: unknown;
    eventName?: unknown;
    zip?: unknown;
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
    const redis = Redis.fromEnv();
    const pipeline = redis
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

    // Count which zip a turned-away visitor entered, once per session.
    if (
      eventName.endsWith(FUNNEL_EVENTS.zipOutOfArea) &&
      typeof zip === 'string' &&
      /^\d{5}$/.test(zip)
    ) {
      const isNew = await redis.sadd(
        funnelKey(OUT_OF_AREA_ZIP_SESSIONS_NAME),
        `${sessionId}:${zip}`
      );
      if (isNew) {
        await redis
          .pipeline()
          .zincrby(funnelKey(OUT_OF_AREA_ZIPS_NAME), 1, zip)
          .zincrby(funnelKey(OUT_OF_AREA_ZIPS_NAME, day), 1, zip)
          .exec();
      }
    }
  } catch (err) {
    console.error('funnel-event write error:', err);
  }

  return Response.json({ ok: true });
}
