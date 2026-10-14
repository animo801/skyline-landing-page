import { after } from 'next/server';
import { isZipInServiceArea } from '@/data/serviceAreaZipCodes';
import { sendMetaLead } from '@/lib/metaConversionsApi';
import { customEventNameForFunnel } from '@/lib/meta';
import { VARIANTS } from '@/lib/abTest';
import {
  calculateEstimate,
  COVERAGE_OPTIONS,
  formatEstimate,
  isCoverage,
  isValidSquareFeet,
} from '@/lib/estimate';
import type { Estimate } from '@/lib/estimate';

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

function landingPageLabel(funnel: unknown): string {
  if (funnel === 'virtual-quote') return 'Virtual Quote';
  const variant = Object.values(VARIANTS).find((v) => v.funnel === funnel);
  return variant?.label ?? 'unknown';
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

// Logs carry a per-submission ID so every line from one submission can be
// found together in the Vercel logs. Contact details are masked so the logs
// don't hold full PII.
function maskEmail(email: unknown): string {
  if (typeof email !== 'string') return '(missing)';
  const [name, domain] = email.trim().split('@');
  return domain ? `${name.slice(0, 1)}***@${domain}` : '(invalid)';
}

function createLogger(submissionId: string) {
  const prefix = `[quote ${submissionId}]`;
  return {
    info: (message: string, data?: unknown) =>
      console.log(prefix, message, data === undefined ? '' : JSON.stringify(data)),
    error: (message: string, data?: unknown) =>
      console.error(prefix, message, data === undefined ? '' : JSON.stringify(data)),
  };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    console.error('[quote] Rejected: request body is not valid JSON');
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    zip,
    stories,
    timeline,
    coverage,
    squareFeet,
    firstName,
    email,
    phone,
    eventId,
    eventSourceUrl,
    funnel,
    test,
  } = body;
  // /virtual-quote prices the home, so it also requires coverage and size.
  const isEstimator = funnel === 'virtual-quote';
  const log = createLogger(
    isNonEmptyString(eventId) ? eventId.slice(0, 8) : crypto.randomUUID().slice(0, 8)
  );

  log.info('Submission received', {
    zip,
    stories,
    timeline,
    coverage,
    squareFeet,
    email: maskEmail(email),
    hasFirstName: isNonEmptyString(firstName),
    hasPhone: isNonEmptyString(phone),
    eventId,
    eventSourceUrl,
    funnel,
  });

  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    log.error('GHL_WEBHOOK_URL is not set — cannot forward lead');
    return Response.json({ error: 'Not configured' }, { status: 500 });
  }

  const storiesLabel = typeof stories === 'string' && STORIES_LABELS[stories];
  const timelineText = typeof timeline === 'string' && timelineLabel(timeline);

  const problems = [
    !isNonEmptyString(zip) && 'zip missing',
    isNonEmptyString(zip) && !isZipInServiceArea(zip) && 'zip outside service area',
    !storiesLabel && 'stories missing/invalid',
    !timelineText && 'timeline missing/invalid',
    !isNonEmptyString(firstName) && 'firstName missing',
    !isNonEmptyString(email) && 'email missing',
    !isNonEmptyString(phone) && 'phone missing',
    isEstimator && !isCoverage(coverage) && 'coverage missing/invalid',
    isEstimator && !isValidSquareFeet(squareFeet) && 'squareFeet missing/invalid',
  ].filter(Boolean);

  // The individual checks repeat what `problems` covers so TypeScript can
  // narrow the field types below.
  if (
    problems.length > 0 ||
    !isNonEmptyString(zip) ||
    !storiesLabel ||
    !timelineText ||
    !isNonEmptyString(firstName) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(phone)
  ) {
    log.error('Rejected: invalid submission', { problems });
    return Response.json({ error: 'Invalid submission' }, { status: 400 });
  }

  // Priced on the server (not trusted from the browser) so the range in
  // GHL is always the one the visitor was shown.
  const estimate: Estimate | null =
    isEstimator && isCoverage(coverage) && isValidSquareFeet(squareFeet)
      ? calculateEstimate({
          squareFeet,
          coverage,
          stories: stories === 'two' ? 'two' : 'single',
        })
      : null;

  const payload = {
    first_name: firstName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    postal_code: zip.trim(),
    home_stories: storiesLabel,
    install_timeline: timelineText,
    source: 'Vercel Landing Page Form Submit',
    // Which landing page design the lead came from, so the A/B variants
    // can be compared in GHL too.
    landing_page: landingPageLabel(funnel),
    ...(estimate && isCoverage(coverage) && isValidSquareFeet(squareFeet)
      ? {
          coverage: COVERAGE_OPTIONS.find((o) => o.value === coverage)?.label,
          square_feet: squareFeet,
          estimate_low: estimate.low,
          estimate_high: estimate.high,
          estimate_range: formatEstimate(estimate),
        }
      : {}),
  };

  // Test submissions (?test=1 on the site) are checked and priced like real
  // ones but never reach GHL or Meta.
  if (test === true) {
    log.info('Test submission — not sent to GHL or Meta', {
      fields: Object.keys(payload),
      estimate,
    });
    return Response.json(estimate ? { ok: true, estimate } : { ok: true });
  }

  log.info('Forwarding to GHL webhook', {
    // Only the webhook's trailing ID, to confirm which webhook is in use.
    webhook: `…${webhookUrl.slice(-12)}`,
    fields: Object.keys(payload),
  });

  const startedAt = Date.now();
  let res: Response;
  try {
    res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    log.error('GHL webhook request threw (network error)', {
      error: error instanceof Error ? error.message : String(error),
      ms: Date.now() - startedAt,
    });
    return Response.json({ error: 'Upstream error' }, { status: 502 });
  }

  const responseText = await res.text();
  const ghlResult = {
    status: res.status,
    ms: Date.now() - startedAt,
    body: responseText.slice(0, 500),
  };

  if (!res.ok) {
    log.error('GHL webhook returned an error', ghlResult);
    return Response.json({ error: 'Upstream error' }, { status: 502 });
  }

  log.info('GHL webhook accepted lead', ghlResult);

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
        customEventName: customEventNameForFunnel(funnel),
        log,
      }).catch((error) =>
        log.error('Meta CAPI threw', {
          error: error instanceof Error ? error.message : String(error),
        })
      )
    );
  } else {
    log.info('No eventId on submission — skipping Meta CAPI');
  }

  return Response.json(estimate ? { ok: true, estimate } : { ok: true });
}
