import type { HomeStories } from '@/components/quote/HomeStoriesStep';
import type { Timeline } from '@/components/quote/TimelineStep';

// Every event the funnel tracks. The /api/funnel-event route only accepts
// names from this list, so a typo (or a stranger poking the endpoint)
// can't create junk keys in Redis.
//
// Quiz answers are logged as `answer:<question>:<value>`, so each option
// shows up as its own box on /funnel. Values (not positions) are used, so
// reordering options doesn't reshuffle historical counts.
export const FUNNEL_EVENTS = {
  landed: 'landed',
  ctaClick: 'cta_click',
  quizStart: 'quiz_start',
  zipInArea: 'zip_in_area',
  zipOutOfArea: 'zip_out_of_area',
  contactSubmit: 'contact_submit',
} as const;

// Answer options for each select question, with the labels /funnel shows.
// Kept in sync with HomeStoriesStep and TimelineStep by their types.
export const STORIES_OPTIONS: { value: HomeStories; label: string }[] = [
  { value: 'single', label: 'Single-story' },
  { value: 'two', label: 'Two-story' },
];

export const TIMELINE_OPTIONS: { value: Timeline; label: string }[] = [
  { value: 'before-month-end', label: 'Before the end of the month' },
  { value: 'before-dec-15', label: 'Before December 15th' },
  { value: 'next-year', label: 'Sometime next year' },
];

export function answerEvent(question: 'stories' | 'timeline', value: string) {
  return `answer:${question}:${value}`;
}

// Page loads of the landing page. Besides the usual unique-session set,
// these also bump a page-view counter and add the visitor to the
// unique-visitors set that the headline numbers on /funnel read.
export const LANDED_EVENTS: string[] = [FUNNEL_EVENTS.landed];

// Counter of every page load (reloads included) for a landed event.
export function viewsName(landedEvent: string) {
  return `views:${landedEvent}`;
}

// Set of visitor ids (kept in localStorage, so they survive across
// sessions and days) that landed on the page.
export const VISITORS_NAME = 'visitors';

export const ALLOWED_FUNNEL_EVENTS = new Set<string>([
  ...Object.values(FUNNEL_EVENTS),
  ...STORIES_OPTIONS.map((o) => answerEvent('stories', o.value)),
  ...TIMELINE_OPTIONS.map((o) => answerEvent('timeline', o.value)),
]);

// One Redis set per event, holding the session ids that fired it — so the
// set's size is the number of unique sessions at that step. Each event is
// written twice: to an all-time set, and to that day's set
// (`skyline:funnel:2026-10-06:landed`), which the date filters on /funnel
// union together so a session active on several days counts once.
// Keys are prefixed with `skyline:` so the store could be shared safely.
export function funnelKey(eventName: string, day?: string) {
  return day
    ? `skyline:funnel:${day}:${eventName}`
    : `skyline:funnel:${eventName}`;
}

// Which timezone a "day" starts in, for the date filters (Charlotte, NC).
export const FUNNEL_TIMEZONE = 'America/New_York';

// YYYY-MM-DD for `date` in FUNNEL_TIMEZONE.
export function funnelDay(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: FUNNEL_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

// Shifts a YYYY-MM-DD string by whole days (calendar math only, so
// timezones and DST can't skew it).
export function addDays(day: string, days: number) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
