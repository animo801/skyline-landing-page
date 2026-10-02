import { after } from 'next/server';
import { isZipInServiceArea } from '@/data/serviceAreaZipCodes';
import { sendMetaLead } from '@/lib/metaConversionsApi';

// Quote submissions are forwarded server-side to the GoHighLevel inbound
// webhook so the webhook URL never ships in the client bundle.
const STORIES_LABELS: Record<string, string> = {
  single: 'Single-story',
  two: 'Two-story',
};

function timelineLabel(timeline: string): string | null {
  switch (timeline) {
    case 'before-month-end': {
      const month = new Date().toLocaleString('en-US', {
        month: 'long',
        timeZone: 'America/New_York',
      });
      return `Before the end of ${month}`;
    }
    case 'before-dec-15':
      return 'Before December 15th';
    case 'next-year':
      return 'Sometime next year';
    default:
      return null;
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function POST(request: Request) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('GHL_WEBHOOK_URL is not set');
    return Response.json({ error: 'Not configured' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { zip, stories, timeline, firstName, email, phone, eventId, eventSourceUrl } =
    body;
  const storiesLabel = typeof stories === 'string' && STORIES_LABELS[stories];
  const timelineText = typeof timeline === 'string' && timelineLabel(timeline);

  if (
    !isNonEmptyString(zip) ||
    !isZipInServiceArea(zip) ||
    !storiesLabel ||
    !timelineText ||
    !isNonEmptyString(firstName) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(phone)
  ) {
    return Response.json({ error: 'Invalid submission' }, { status: 400 });
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      first_name: firstName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      postal_code: zip.trim(),
      home_stories: storiesLabel,
      install_timeline: timelineText,
      source: 'Skyline landing page quote form',
    }),
  });

  if (!res.ok) {
    console.error('GHL webhook failed', res.status, await res.text());
    return Response.json({ error: 'Upstream error' }, { status: 502 });
  }

  // Report the lead to Meta after responding so a slow or failing CAPI call
  // never holds up or breaks the form submission.
  if (isNonEmptyString(eventId)) {
    after(() =>
      sendMetaLead({
        request,
        eventId,
        eventSourceUrl:
          typeof eventSourceUrl === 'string' ? eventSourceUrl : undefined,
        firstName,
        email,
        phone,
        zip,
      }).catch((error) => console.error('Meta CAPI error', error))
    );
  }

  return Response.json({ ok: true });
}
