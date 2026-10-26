'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import QuoteHeader from './QuoteHeader';
import ZipCodeStep from './ZipCodeStep';
import HomeStoriesStep from './HomeStoriesStep';
import type { HomeStories } from './HomeStoriesStep';
import CoverageStep from './CoverageStep';
import SquareFootageStep from './SquareFootageStep';
import TimelineStep from './TimelineStep';
import type { Timeline } from './TimelineStep';
import ContactInfoStep from './ContactInfoStep';
import type { ContactInfo } from './ContactInfoStep';
import ThankYouStep from './ThankYouStep';
import EstimateResultStep from './EstimateResultStep';
import OutOfAreaStep from './OutOfAreaStep';
import LoadingStep from './LoadingStep';
import { isZipInServiceArea } from '@/data/serviceAreaZipCodes';
import { trackMetaEvent } from '@/components/MetaPixel';
import { answerEvent, FUNNEL_EVENTS, funnelEvent } from '@/lib/funnel';
import type { FunnelId } from '@/lib/funnel';
import type { Coverage, Estimate } from '@/lib/estimate';
import { QuestionCountProvider, QuoteLayoutProvider } from './QuoteLayout';
import type { QuoteLayout } from './QuoteLayout';
import { logFunnelEvent } from '@/lib/funnel-client';
import { randomId } from '@/lib/uuid';
import { isTestMode } from '@/lib/testMode';

// How long the loading animation shows at minimum after submitting, so the
// house finishes drawing and its lights come on even when the request is
// quick. A slower request keeps it up longer.
const LOADING_MIN_MS = 4200;

const LOADING_MESSAGES: Record<QuoteQuestions, string[]> = {
  standard: ['Sending your info…', 'Lining up your lights…', 'Almost there…'],
  estimator: [
    'Measuring your roofline…',
    'Placing your lights…',
    'Calculating your estimate…',
  ],
};

type StepId =
  'zip' | 'stories' | 'coverage' | 'sqft' | 'timeline' | 'contact' | 'done';

// The order of steps for each kind of quote. Every entry but the last is a
// question; 'done' is the closing screen (thank-you, or the estimate). The
// step index lives in the URL (?step=N).
const FLOWS = {
  // The original 4-question quote (/quote and the /v2 card).
  standard: ['zip', 'stories', 'timeline', 'contact', 'done'],
  // /virtual-quote: adds coverage and square footage to price the home,
  // and ends on an instant estimate.
  estimator: [
    'zip',
    'stories',
    'coverage',
    'sqft',
    'timeline',
    'contact',
    'done',
  ],
} as const satisfies Record<string, readonly StepId[]>;

export type QuoteQuestions = keyof typeof FLOWS;

// The zip step can also branch to a dead-end "out of area" screen instead
// of advancing, so step isn't purely numeric.
type Step = number | 'out-of-area';

type QuoteAnswers = {
  zip: string;
  stories: HomeStories | null;
  coverage: Coverage | null;
  squareFeet: number | null;
  timeline: Timeline | null;
  contact: ContactInfo | null;
};

function stepFromSearchParams(
  searchParams: URLSearchParams,
  lastStep: number,
): Step {
  const raw = searchParams.get('step');
  if (raw === 'out-of-area') return 'out-of-area';
  const parsed = raw === null ? 0 : Number(raw);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= lastStep
    ? parsed
    : 0;
}

function isAnswered(id: StepId, answers: QuoteAnswers): boolean {
  switch (id) {
    case 'zip':
      return Boolean(answers.zip);
    case 'stories':
      return answers.stories !== null;
    case 'coverage':
      return answers.coverage !== null;
    case 'sqft':
      return answers.squareFeet !== null;
    case 'timeline':
      return answers.timeline !== null;
    default:
      return true;
  }
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
        new Blob([payload], { type: 'application/json' }),
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

type QuoteFlowProps = {
  // 'page' is the full-screen flow on /quote; 'card' embeds it in a
  // landing page (e.g. /v2) without its own header.
  layout?: QuoteLayout;
  // Which landing page's funnel on /funnel these steps count toward.
  funnel?: FunnelId;
  // Which set of questions to ask (see FLOWS).
  questions?: QuoteQuestions;
  // Where the logo links in the full-page layout (the page they came from).
  homeHref?: string;
};

function QuoteFlowInner({
  layout = 'page',
  funnel = 'home',
  questions = 'standard',
  homeHref = '/',
}: QuoteFlowProps) {
  const router = useRouter();
  const isCard = layout === 'card';
  const cardRef = useRef<HTMLDivElement>(null);
  const track = (eventName: string, details?: { zip?: string }) =>
    logFunnelEvent(funnelEvent(funnel, eventName), details);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const flow: readonly StepId[] = FLOWS[questions];
  const lastStep = flow.length - 1;
  const questionCount = lastStep;

  // The current question is derived from the URL rather than local state,
  // so the browser's back/forward buttons move between questions instead
  // of leaving the quote flow entirely.
  const step = stepFromSearchParams(searchParams, lastStep);
  const stepId: StepId | 'out-of-area' =
    step === 'out-of-area' ? step : flow[step];

  const [answers, setAnswers] = useState<QuoteAnswers>({
    zip: '',
    stories: null,
    coverage: null,
    squareFeet: null,
    timeline: null,
    contact: null,
  });
  // Set from the server's response once the lead is submitted, so the
  // range shown always matches the one sent to GHL.
  const [estimate, setEstimate] = useState<Estimate | null>(null);

  // True from submitting the contact form until the closing screen shows.
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clears once the step has actually changed
    if (stepId !== 'contact') setLoading(false);
  }, [stepId]);

  // ?test=1: run the whole flow without sending anything to GHL or Meta.
  const [testMode, setTestMode] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only state once on mount
    setTestMode(isTestMode());
  }, []);

  // Answers live in memory, so a refresh (or returning to a bookmarked
  // ?step=3) lands mid-flow with nothing answered. Send them back to the
  // start rather than letting them submit an incomplete quote.
  const missingEarlierAnswer =
    typeof step === 'number' &&
    step < lastStep &&
    flow.slice(0, step).some((id) => !isAnswered(id, answers));
  useEffect(() => {
    if (missingEarlierAnswer) router.replace(pathname, { scroll: false });
  }, [missingEarlierAnswer, router, pathname]);

  // "Started quote" means the visitor saw the first question: on mount for
  // the full-page flow, and once the card scrolls into view when embedded.
  // Funnel counts are unique sessions per step, so re-firing this on a
  // remount (or React's dev double-invoke) doesn't inflate it.
  useEffect(() => {
    const quizStart = funnelEvent(funnel, FUNNEL_EVENTS.quizStart);
    const card = cardRef.current;
    if (!isCard || !card || typeof IntersectionObserver === 'undefined') {
      logFunnelEvent(quizStart);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          logFunnelEvent(quizStart);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [isCard, funnel]);

  // When embedded, keep the card's top in view as it changes height between
  // steps, but don't yank the page around if it's already visible.
  useEffect(() => {
    const card = cardRef.current;
    if (!isCard || !card) return;
    if (card.getBoundingClientRect().top < 0) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isCard, step]);

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
    // Embedded in a landing page, stay put instead of jumping to the top.
    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: !isCard,
    });
  };

  const goToStepAfter = (id: StepId) => goToStep(flow.indexOf(id) + 1);
  const questionNumber = (id: StepId) => flow.indexOf(id) + 1;

  const handleZipComplete = (zip: string) => {
    setAnswers((prev) => ({ ...prev, zip }));
    const inArea = isZipInServiceArea(zip);
    if (inArea) track(FUNNEL_EVENTS.zipInArea);
    // The zip is recorded so /funnel can list which zips get turned away.
    else track(FUNNEL_EVENTS.zipOutOfArea, { zip });
    if (inArea) goToStepAfter('zip');
    else goToStep('out-of-area');
  };

  const handleRetryZip = () => {
    setAnswers((prev) => ({ ...prev, zip: '' }));
    goToStep(0);
  };

  const handleStoriesSelect = (stories: HomeStories) => {
    setAnswers((prev) => ({ ...prev, stories }));
    track(answerEvent('stories', stories));
    goToStepAfter('stories');
  };

  const handleCoverageSelect = (coverage: Coverage) => {
    setAnswers((prev) => ({ ...prev, coverage }));
    track(answerEvent('coverage', coverage));
    goToStepAfter('coverage');
  };

  const handleSquareFeetComplete = (squareFeet: number) => {
    setAnswers((prev) => ({ ...prev, squareFeet }));
    track(FUNNEL_EVENTS.sqftEntered);
    goToStepAfter('sqft');
  };

  const handleTimelineSelect = (timeline: Timeline) => {
    setAnswers((prev) => ({ ...prev, timeline }));
    track(answerEvent('timeline', timeline));
    goToStepAfter('timeline');
  };

  // Sends the completed quote to our API (which forwards it to GHL) before
  // showing the closing screen. Throws on failure so the form can show an
  // error and let the user retry.
  const handleContactSubmit = async (contact: ContactInfo) => {
    // The contact step lets them fix a typo'd zip, so its zip wins.
    setAnswers((prev) => ({ ...prev, zip: contact.zip, contact }));
    setLoading(true);
    const minimumLoading = new Promise((resolve) =>
      setTimeout(resolve, LOADING_MIN_MS),
    );
    try {
      await submitLead(contact);
      await minimumLoading;
      goToStepAfter('contact');
    } catch (error) {
      // Back to the form, which shows the error and lets them retry.
      setLoading(false);
      throw error;
    }
  };

  const submitLead = async (contact: ContactInfo) => {
    // Shared by the browser Pixel and the server-side Conversions API event
    // so Meta counts the lead once.
    const eventId = randomId();
    const body = JSON.stringify({
      stories: answers.stories,
      timeline: answers.timeline,
      // Only asked by the estimator; the server prices the home from these.
      coverage: answers.coverage ?? undefined,
      squareFeet: answers.squareFeet ?? undefined,
      // Includes the zip, which they may have corrected on the contact step.
      ...contact,
      eventId,
      eventSourceUrl: window.location.href,
      // Which landing page the lead came from. The URL alone can't tell,
      // since both A/B variants are served at "/".
      funnel,
      // The server checks and prices it, but sends nothing to GHL or Meta.
      test: isTestMode() || undefined,
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

    // The lead is already in GHL at this point, so neither reading the
    // estimate nor tracking may surface as a "something went wrong" error.
    try {
      const data: { estimate?: Estimate } = await res.json();
      if (data.estimate) setEstimate(data.estimate);
    } catch {
      // The closing screen handles a missing estimate.
    }
    try {
      // The page's custom event ("Vercel LP Form Submit", or "Free quote
      // submitted on Vercel site" for /virtual-quote) is sent server-side
      // only (see sendMetaLead), so it never needs deduplication.
      trackMetaEvent('Lead', {}, { eventID: eventId });
      // Logged only once the lead reached GHL, so "Converted" on /funnel
      // matches real leads.
      track(FUNNEL_EVENTS.contactSubmit);
    } catch {
      // Ignore — tracking is best-effort.
    }
  };

  const steps = (
    <>
      {testMode && (
        <p
          role='status'
          className='mb-4 rounded-lg bg-amber-100 px-4 py-2 text-center text-sm font-bold text-amber-900'
        >
          Test mode: submissions aren&rsquo;t sent to GHL or Meta.
        </p>
      )}
      {stepId === 'zip' && (
        <ZipCodeStep
          defaultZip={answers.zip}
          questionNumber={questionNumber('zip')}
          onComplete={handleZipComplete}
        />
      )}
      {stepId === 'stories' && (
        <HomeStoriesStep
          defaultValue={answers.stories}
          questionNumber={questionNumber('stories')}
          onSelect={handleStoriesSelect}
        />
      )}
      {stepId === 'coverage' && (
        <CoverageStep
          defaultValue={answers.coverage}
          questionNumber={questionNumber('coverage')}
          onSelect={handleCoverageSelect}
        />
      )}
      {stepId === 'sqft' && (
        <SquareFootageStep
          defaultValue={answers.squareFeet}
          questionNumber={questionNumber('sqft')}
          onComplete={handleSquareFeetComplete}
        />
      )}
      {stepId === 'timeline' && (
        <TimelineStep
          defaultValue={answers.timeline}
          questionNumber={questionNumber('timeline')}
          onSelect={handleTimelineSelect}
        />
      )}
      {loading && <LoadingStep messages={LOADING_MESSAGES[questions]} />}
      {stepId === 'contact' && (
        // Hidden, not unmounted, while loading, so a failed submit returns
        // to the form with everything still filled in.
        <div hidden={loading}>
          <ContactInfoStep
            defaultValue={answers.contact ?? undefined}
            zip={answers.zip}
            questionNumber={questionNumber('contact')}
            submitLabel={
              questions === 'estimator'
                ? 'See my estimate'
                : 'Get my free quote'
            }
            onSubmit={handleContactSubmit}
          />
        </div>
      )}
      {stepId === 'done' &&
        (questions === 'estimator' ? (
          <EstimateResultStep
            firstName={answers.contact?.firstName ?? ''}
            estimate={estimate}
            answers={answers}
          />
        ) : (
          <ThankYouStep firstName={answers.contact?.firstName ?? ''} />
        ))}
      {stepId === 'out-of-area' && <OutOfAreaStep onRetry={handleRetryZip} />}
    </>
  );

  // Progress reflects how many questions have been answered so far, so it
  // fills from empty at the first question to full on the closing screen.
  const progressPercent = step === 'out-of-area' ? 0 : (step / lastStep) * 100;

  return (
    <QuoteLayoutProvider value={layout}>
      <QuestionCountProvider value={questionCount}>
        {isCard ? (
          <div ref={cardRef} className='scroll-mt-4'>
            {steps}
          </div>
        ) : (
          <main className='mx-auto min-h-screen w-full max-w-md bg-white px-6 pt-4'>
            <QuoteHeader
              progressPercent={progressPercent}
              homeHref={homeHref}
            />
            {steps}
          </main>
        )}
      </QuestionCountProvider>
    </QuoteLayoutProvider>
  );
}

export default function QuoteFlow(props: QuoteFlowProps) {
  // useSearchParams requires a Suspense boundary above it.
  return (
    <Suspense fallback={null}>
      <QuoteFlowInner {...props} />
    </Suspense>
  );
}
