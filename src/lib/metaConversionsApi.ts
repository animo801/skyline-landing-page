import { createHash } from 'node:crypto';
import {
  META_FORM_SUBMIT_EVENT,
  META_PIXEL_ID,
  customEventIdFor,
} from './meta';

const GRAPH_API_VERSION = 'v24.0';

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function readCookie(cookieHeader: string | null, name: string) {
  const match = cookieHeader?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

// Sends a server-side Lead, plus the custom form-submit event, to Meta's
// Conversions API. They share event IDs with the browser Pixel's copies so
// Meta deduplicates them. User data is
// normalized and SHA-256 hashed per Meta's customer information parameters.
export async function sendMetaLead({
  request,
  eventId,
  eventSourceUrl,
  firstName,
  email,
  phone,
  zip,
}: {
  request: Request;
  eventId: string;
  eventSourceUrl: string | undefined;
  firstName: string;
  email: string;
  phone: string;
  zip: string;
}) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('META_CAPI_ACCESS_TOKEN is not set');
    return;
  }

  // Form only accepts US numbers, so prefix the country code Meta expects.
  const phoneDigits = phone.replace(/\D/g, '');
  const normalizedPhone =
    phoneDigits.length === 10 ? `1${phoneDigits}` : phoneDigits;

  const cookies = request.headers.get('cookie');
  const clientIp = request.headers
    .get('x-forwarded-for')
    ?.split(',')[0]
    ?.trim();

  const baseEvent = {
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: eventSourceUrl,
    user_data: {
      em: [sha256(email.trim().toLowerCase())],
      ph: [sha256(normalizedPhone)],
      fn: [sha256(firstName.trim().toLowerCase())],
      zp: [sha256(zip.trim())],
      country: [sha256('us')],
      client_ip_address: clientIp,
      client_user_agent: request.headers.get('user-agent') ?? undefined,
      fbp: readCookie(cookies, '_fbp'),
      fbc: readCookie(cookies, '_fbc'),
    },
  };

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [
          { ...baseEvent, event_name: 'Lead', event_id: eventId },
          {
            ...baseEvent,
            event_name: META_FORM_SUBMIT_EVENT,
            event_id: customEventIdFor(eventId),
          },
        ],
        // Routes events to Events Manager's Test Events tab. Leave unset in
        // production — test events aren't used for ad optimization.
        test_event_code: process.env.META_CAPI_TEST_EVENT_CODE || undefined,
      }),
    }
  );

  if (!res.ok) {
    console.error('Meta CAPI request failed', res.status, await res.text());
  }
}
