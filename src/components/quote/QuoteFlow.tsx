'use client';

import { Suspense, useState } from 'react';
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
import { trackMetaCustomEvent, trackMetaEvent } from '@/components/MetaPixel';
import { META_FORM_SUBMIT_EVENT, customEventIdFor } from '@/lib/meta';

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
    goToStep(isZipInServiceArea(zip) ? 1 : 'out-of-area');
  };

  const handleRetryZip = () => {
    setAnswers((prev) => ({ ...prev, zip: '' }));
    goToStep(0);
  };

  const handleStoriesSelect = (stories: HomeStories) => {
    setAnswers((prev) => ({ ...prev, stories }));
    goToStep(2);
  };

  const handleTimelineSelect = (timeline: Timeline) => {
    setAnswers((prev) => ({ ...prev, timeline }));
    goToStep(3);
  };

  // Sends the completed quote to our API (which forwards it to GHL) before
  // showing the thank-you screen. Throws on failure so the form can show
  // an error and let the user retry.
  const handleContactSubmit = async (contact: ContactInfo) => {
    setAnswers((prev) => ({ ...prev, contact }));

    // Shared by the browser Pixel and the server-side Conversions API event
    // so Meta counts the lead once.
    const eventId = crypto.randomUUID();

    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zip: answers.zip,
        stories: answers.stories,
        timeline: answers.timeline,
        ...contact,
        eventId,
        eventSourceUrl: window.location.href,
      }),
    });
    if (!res.ok) throw new Error(`Quote submission failed: ${res.status}`);

    trackMetaEvent('Lead', {}, { eventID: eventId });
    trackMetaCustomEvent(
      META_FORM_SUBMIT_EVENT,
      {},
      { eventID: customEventIdFor(eventId) }
    );

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
