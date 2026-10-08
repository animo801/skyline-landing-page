'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import QuoteHeader from './QuoteHeader';
import ZipCodeStep from './ZipCodeStep';
import HomeStoriesStep from './HomeStoriesStep';
import type { HomeStories } from './HomeStoriesStep';
import TimelineStep from './TimelineStep';
import type { Timeline } from './TimelineStep';
import ContactInfoStep from './ContactInfoStep';
import type { ContactInfo } from './ContactInfoStep';
import ThankYouStep from './ThankYouStep';
import OutOfAreaStep from './OutOfAreaStep';
import { isZipInServiceArea } from '@/data/serviceAreaZipCodes';
import { trackMetaEvent } from '@/components/MetaPixel';
import { answerEvent, FUNNEL_EVENTS } from '@/lib/funnel';
import { logFunnelEvent } from '@/lib/funnel-client';
import { randomId } from '@/lib/uuid';

// 5 states: 4 questions (steps 0-3) plus the thank-you screen (step 4).
// Progress reflects how many questions have been answered so far, so it
// fills from empty at the first question to full once the quiz is done.
const TOTAL_STEPS = 5;
const LAST_STEP = TOTAL_STEPS - 1;

// The zip step can also branch to a dead-end "out of area" screen instead
// of advancing, so step isn't purely numeric.
type Step = number | 'out-of-area';

function progressPercentForStep(step: Step): number {
  if (step === 'out-of-area') return 0;
  return (step / LAST_STEP) * 100;
}

type QuoteAnswers = {
  zip: string;
  stories: HomeStories | null;
  timeline: Timeline | null;
  contact: ContactInfo | null;
};

function stepFromSearchParams(searchParams: URLSearchParams): Step {
  const raw = searchParams.get('step');
  if (raw === 'out-of-area') return 'out-of-area';
  const parsed = raw === null ? 0 : Number(raw);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= LAST_STEP
    ? parsed
    : 0;
}

// Tells the server about a submission that failed in the browser, so it
// shows up in the Vercel logs even when the request never reached
// /api/quote. Best-effort: never throws.
function reportSubmitFailure(details: {
  eventId: string;
  reason: string;
  status?: number;
  attempt?: number;
}) {
  try {
    const payload = JSON.stringify({
      ...details,
      online: navigator.onLine,
      page: window.location.href,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/quote/client-error',
        new Blob([payload], { type: 'application/json' })
      );
    } else {
      fetch('/api/quote/client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Reporting is best-effort.
  }
}

function QuoteFlowInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The current question is derived from the URL rather than local state,
  // so the browser's back/forward buttons move between questions instead
  // of leaving the quote flow entirely.
  const step = stepFromSearchParams(searchParams);

  const [answers, setAnswers] = useState<QuoteAnswers>({
    zip: '',
    stories: null,
    timeline: null,
    contact: null,
  });

  // Answers live in memory, so a refresh (or returning to a bookmarked
  // ?step=3) lands mid-flow with nothing answered. Send them back to the
  // start rather than letting them submit an incomplete quote.
  const missingEarlierAnswer =
    typeof step === 'number' &&
    step < LAST_STEP &&
    ((step >= 1 && !answers.zip) ||
      (step >= 2 && !answers.stories) ||
      (step >= 3 && !answers.timeline));
  useEffect(() => {
    if (missingEarlierAnswer) router.replace(pathname);
  }, [missingEarlierAnswer, router, pathname]);

  // Funnel counts are unique sessions per step, so re-firing this on a
  // remount (or React's dev double-invoke) doesn't inflate it.
  useEffect(() => {
    logFunnelEvent(FUNNEL_EVENTS.quizStart);
  }, []);

  // Each step forward pushes a new history entry (rather than replacing
  // the current one) so "back" returns to the previous question.
  const goToStep = (next: Step) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === 0) {
      params.delete('step');
    } else {
      params.set('step', String(next));
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleZipComplete = (zip: string) => {
    setAnswers((prev) => ({ ...prev, zip }));
    const inArea = isZipInServiceArea(zip);
    logFunnelEvent(
      inArea ? FUNNEL_EVENTS.zipInArea : FUNNEL_EVENTS.zipOutOfArea
    );
    goToStep(inArea ? 1 : 'out-of-area');
  };

  const handleRetryZip = () => {
    setAnswers((prev) => ({ ...prev, zip: '' }));
    goToStep(0);
  };

  const handleStoriesSelect = (stories: HomeStories) => {
    setAnswers((prev) => ({ ...prev, stories }));
    logFunnelEvent(answerEvent('stories', stories));
    goToStep(2);
  };

  const handleTimelineSelect = (timeline: Timeline) => {
    setAnswers((prev) => ({ ...prev, timeline }));
    logFunnelEvent(answerEvent('timeline', timeline));
    goToStep(3);
  };

  // Sends the completed quote to our API (which forwards it to GHL) before
  // showing the thank-you screen. Throws on failure so the form can show
  // an error and let the user retry.
  const handleContactSubmit = async (contact: ContactInfo) => {
    setAnswers((prev) => ({ ...prev, contact }));

    // Shared by the browser Pixel and the server-side Conversions API event
    // so Meta counts the lead once.
    const eventId = randomId();
    const body = JSON.stringify({
      zip: answers.zip,
      stories: answers.stories,
      timeline: answers.timeline,
      ...contact,
      eventId,
      eventSourceUrl: window.location.href,
    });

    // A dropped mobile connection makes fetch throw before any response, so
    // network errors get one automatic retry. HTTP errors don't — the
    // server already logged why it rejected the submission.
    let res: Response | null = null;
    for (let attempt = 1; attempt <= 2 && !res; attempt++) {
      try {
        res = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        });
      } catch (error) {
        reportSubmitFailure({
          eventId,
          attempt,
          reason: `network error: ${error instanceof Error ? error.message : String(error)}`,
        });
        if (attempt === 2) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    if (!res?.ok) {
      reportSubmitFailure({
        eventId,
        status: res?.status,
        reason: 'server returned an error',
      });
      throw new Error(`Quote submission failed: ${res?.status}`);
    }

    // The lead is already in GHL at this point, so tracking problems must
    // never surface as a "something went wrong" error.
    try {
      // The custom "Vercel LP Form Submit" event is sent server-side only
      // (see sendMetaLead), so it never needs browser/server deduplication.
      trackMetaEvent('Lead', {}, { eventID: eventId });
      // Logged only once the lead reached GHL, so "Converted" on /funnel
      // matches real leads.
      logFunnelEvent(FUNNEL_EVENTS.contactSubmit);
    } catch {
      // Ignore — tracking is best-effort.
    }

    goToStep(4);
  };

  return (
    <main className='mx-auto min-h-screen w-full max-w-md bg-white px-6 pt-4'>
      <QuoteHeader progressPercent={progressPercentForStep(step)} />

      {step === 0 && (
        <ZipCodeStep defaultZip={answers.zip} onComplete={handleZipComplete} />
      )}
      {step === 1 && (
        <HomeStoriesStep
          defaultValue={answers.stories}
          onSelect={handleStoriesSelect}
        />
      )}
      {step === 2 && (
        <TimelineStep
          defaultValue={answers.timeline}
          onSelect={handleTimelineSelect}
        />
      )}
      {step === 3 && (
        <ContactInfoStep
          defaultValue={answers.contact ?? undefined}
          onSubmit={handleContactSubmit}
        />
      )}
      {step === 4 && (
        <ThankYouStep firstName={answers.contact?.firstName ?? ''} />
      )}
      {step === 'out-of-area' && <OutOfAreaStep onRetry={handleRetryZip} />}
    </main>
  );
}

export default function QuoteFlow() {
  // useSearchParams requires a Suspense boundary above it.
  return (
    <Suspense fallback={null}>
      <QuoteFlowInner />
    </Suspense>
  );
}
