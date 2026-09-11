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

// Percent-filled matches each step's Figma frame — every designed step so
// far shows the same 34px-of-354px filled segment. The final thank-you
// screen fills the bar all the way since the questionnaire is complete.
const STEP_PROGRESS_PERCENT = [
  (34 / 354) * 100,
  (34 / 354) * 100,
  (34 / 354) * 100,
  (34 / 354) * 100,
  100,
];

const LAST_STEP = STEP_PROGRESS_PERCENT.length - 1;

type QuoteAnswers = {
  zip: string;
  stories: HomeStories | null;
  timeline: Timeline | null;
  contact: ContactInfo | null;
};

function stepFromSearchParams(searchParams: URLSearchParams): number {
  const raw = searchParams.get('step');
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
  const goToStep = (next: number) => {
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
    goToStep(1);
  };

  const handleStoriesSelect = (stories: HomeStories) => {
    setAnswers((prev) => ({ ...prev, stories }));
    goToStep(2);
  };

  const handleTimelineSelect = (timeline: Timeline) => {
    setAnswers((prev) => ({ ...prev, timeline }));
    goToStep(3);
  };

  const handleContactSubmit = (contact: ContactInfo) => {
    setAnswers((prev) => ({ ...prev, contact }));
    goToStep(4);
  };

  return (
    <main className='mx-auto min-h-screen w-full max-w-md bg-white px-6 pt-4'>
      <QuoteHeader progressPercent={STEP_PROGRESS_PERCENT[step]} />

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
