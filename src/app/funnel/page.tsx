import type { Metadata } from 'next';
import Image from 'next/image';
import { connection } from 'next/server';
import { Redis } from '@upstash/redis';
import type { FunnelId } from '@/lib/funnel';
import { VARIANTS } from '@/lib/abTest';
import {
  addDays,
  answerEvent,
  FUNNEL_EVENTS,
  FUNNEL_TIMEZONE,
  funnelEvent,
  funnelDay,
  funnelKey,
  LANDED_EVENTS,
  STORIES_OPTIONS,
  TIMELINE_OPTIONS,
  viewsName,
  VISITORS_NAME,
} from '@/lib/funnel';
import { FunnelChart, type FunnelCounts, type FunnelStage } from './FunnelChart';

// Password-protected by proxy.ts (FUNNEL_PASSWORD) and kept out of search
// engines. Counts are unique sessions per step, for the date range picked
// at the top (all time by default).
export const metadata: Metadata = {
  title: 'Funnel',
  robots: { index: false, follow: false },
};

// The same funnel shape for every landing page; only the event names
// (prefixed per page) and the first steps' wording differ.
function buildStages(
  funnel: FunnelId,
  copy: { landed: string; cta: string; started: string }
): FunnelStage[] {
  const e = (eventName: string) => funnelEvent(funnel, eventName);
  return [
    {
      title: 'Landed',
      nodes: [{ event: e(FUNNEL_EVENTS.landed), label: copy.landed }],
    },
    {
      title: 'Clicked CTA',
      nodes: [{ event: e(FUNNEL_EVENTS.ctaClick), label: copy.cta }],
    },
    {
      title: 'Started quote',
      nodes: [{ event: e(FUNNEL_EVENTS.quizStart), label: copy.started }],
    },
    {
      title: 'Q1. Zip code',
      nodes: [
        { event: e(FUNNEL_EVENTS.zipInArea), label: 'In service area' },
        {
          event: e(FUNNEL_EVENTS.zipOutOfArea),
          label: 'Outside service area',
          terminal: true,
        },
      ],
    },
    {
      title: 'Q2. Home stories',
      nodes: STORIES_OPTIONS.map((o) => ({
        event: e(answerEvent('stories', o.value)),
        label: o.label,
      })),
    },
    {
      title: 'Q3. Timeline',
      nodes: TIMELINE_OPTIONS.map((o) => ({
        event: e(answerEvent('timeline', o.value)),
        label: o.label,
      })),
    },
    {
      title: 'Converted',
      nodes: [
        { event: e(FUNNEL_EVENTS.contactSubmit), label: 'Submitted contact info' },
      ],
    },
  ];
}

// One tab per landing page. `key` is the `page` search param; the first
// entry is the default tab.
const PAGES = [
  {
    key: 'home',
    path: VARIANTS.a.label,
    description: 'Original page + /quote',
    stages: buildStages('home', {
      landed: 'Landed on /',
      cta: 'Clicked “Get your free quote”',
      started: 'Saw the zip question',
    }),
  },
  {
    key: 'v2',
    path: VARIANTS.b.label,
    description: 'New single-page design',
    stages: buildStages('v2', {
      landed: 'Landed on /v2',
      cta: 'Clicked the hero button',
      started: 'Saw the quote card',
    }),
  },
];

// Builds a /funnel link, keeping only the params that are set.
function funnelHref(params: Record<string, string | undefined>) {
  const query = new URLSearchParams(
    Object.entries(params).filter((e): e is [string, string] => Boolean(e[1]))
  ).toString();
  return query ? `/funnel?${query}` : '/funnel';
}

// Date filter presets, keyed by the `range` search param. `from`/`to` are
// days back from today (0 = today); null = all time.
const PRESETS = [
  { key: 'today', label: 'Today', from: 0, to: 0 },
  { key: 'yesterday', label: 'Yesterday', from: 1, to: 1 },
  { key: '7d', label: 'Last 7 days', from: 6, to: 0 },
  { key: '30d', label: 'Last 30 days', from: 29, to: 0 },
  { key: 'all', label: 'All time', from: null, to: null },
] as const;

// Longest custom range allowed — each day in the range is one more Redis
// key per event to union.
const MAX_RANGE_DAYS = 366;

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type Range = { from: string; to: string } | null; // null = all time

// Resolves the search params to a date range. Custom from/to dates win
// over a preset; anything missing or malformed falls back to all time.
function resolveRange(params: Record<string, string | string[] | undefined>): {
  range: Range;
  activeKey: string;
} {
  const today = funnelDay();
  const from = typeof params.from === 'string' ? params.from : '';
  const to = typeof params.to === 'string' ? params.to : '';

  if (DAY_PATTERN.test(from) || DAY_PATTERN.test(to)) {
    let start = DAY_PATTERN.test(from) ? from : to;
    let end = DAY_PATTERN.test(to) ? to : from;
    if (start > end) [start, end] = [end, start];
    if (addDays(start, MAX_RANGE_DAYS - 1) < end) {
      start = addDays(end, -(MAX_RANGE_DAYS - 1));
    }
    return { range: { from: start, to: end }, activeKey: 'custom' };
  }

  const preset =
    PRESETS.find((p) => p.key === params.range) ??
    PRESETS.find((p) => p.key === 'all')!;
  return {
    range:
      preset.from === null
        ? null
        : {
            from: addDays(today, -preset.from),
            to: addDays(today, -preset.to),
          },
    activeKey: preset.key,
  };
}

function daysBetween(from: string, to: string) {
  const days: string[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) days.push(d);
  return days;
}

type Metrics = {
  counts: FunnelCounts;
  // Page loads of the landing page, reloads included.
  views: number;
  // Distinct visitor ids that landed on the page.
  visitors: number;
};

async function loadMetrics(range: Range): Promise<Metrics> {
  const events = PAGES.flatMap((p) =>
    p.stages.flatMap((s) => s.nodes.map((n) => n.event))
  );
  const setNames = [...events, VISITORS_NAME];
  const viewNames = LANDED_EVENTS.map(viewsName);
  const pipeline = Redis.fromEnv().pipeline();

  if (!range) {
    setNames.forEach((n) => pipeline.scard(funnelKey(n)));
    pipeline.mget(...viewNames.map((n) => funnelKey(n)));
  } else {
    // Union each set's daily keys into a throwaway key (SUNIONSTORE
    // returns the union's size), so someone seen on several days in the
    // range still counts once. The key is deleted right after.
    const days = daysBetween(range.from, range.to);
    const tmpPrefix = `skyline:funnel:tmp:${crypto.randomUUID()}`;
    setNames.forEach((n) => {
      const tmp = `${tmpPrefix}:${n}`;
      pipeline.sunionstore(
        tmp,
        ...(days.map((d) => funnelKey(n, d)) as [string, ...string[]])
      );
      pipeline.del(tmp);
    });
    pipeline.mget(...viewNames.flatMap((n) => days.map((d) => funnelKey(n, d))));
  }

  const results = await pipeline.exec<unknown[]>();
  const stride = range ? 2 : 1;
  const sizes = setNames.map((_, i) => Number(results[i * stride] ?? 0));
  const viewCounts = (results[results.length - 1] ?? []) as (
    | number
    | string
    | null
  )[];

  return {
    counts: Object.fromEntries(events.map((e, i) => [e, sizes[i]])),
    visitors: sizes[sizes.length - 1],
    views: viewCounts.reduce<number>((sum, v) => sum + Number(v ?? 0), 0),
  };
}

function formatDay(day: string) {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function FunnelPage({
  searchParams,
}: PageProps<'/funnel'>) {
  await connection();
  const params = await searchParams;
  const { range, activeKey } = resolveRange(params);
  const page = PAGES.find((p) => p.key === params.page) ?? PAGES[0];
  // Keeps the selected tab when the date range changes, and vice versa.
  const pageParam = page === PAGES[0] ? undefined : page.key;
  const rangeParams =
    activeKey === 'custom'
      ? { from: range?.from, to: range?.to }
      : { range: activeKey === 'all' ? undefined : activeKey };

  let metrics: Metrics = { counts: {}, views: 0, visitors: 0 };
  let error: string | null = null;
  try {
    metrics = await loadMetrics(range);
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  const { counts, views, visitors } = metrics;
  // Headline numbers cover every landing page together.
  const leads = PAGES.reduce(
    (sum, p) =>
      sum + (counts[funnelEvent(p.key as FunnelId, FUNNEL_EVENTS.contactSubmit)] ?? 0),
    0
  );
  const rangeLabel = !range
    ? 'all time'
    : range.from === range.to
      ? formatDay(range.from)
      : `${formatDay(range.from)} – ${formatDay(range.to)}`;

  return (
    <main className='bg-white pb-16 text-black'>
      <div className='bg-black/[0.04] px-6 pb-10 pt-6 md:px-10'>
        <Image
          src='/images/skyline-logo.svg'
          alt='Skyline Smart Lighting'
          width={178.53}
          height={47.64}
          className='h-9 w-auto rounded bg-skyline-navy p-1.5'
          priority
        />
        <h1 className='mt-8 text-[28px] font-bold leading-[1.15]'>
          Analytics for Funnel
        </h1>
        <p className='mt-1 text-sm text-black/50'>
          Showing {rangeLabel}. Funnel steps count unique sessions.
        </p>

        <div className='mt-6 flex flex-wrap items-end gap-x-6 gap-y-4'>
          <nav aria-label='Date range' className='flex flex-wrap gap-2'>
            {PRESETS.map((p) => (
              <a
                key={p.key}
                href={funnelHref({
                  range: p.key === 'all' ? undefined : p.key,
                  page: pageParam,
                })}
                aria-current={activeKey === p.key ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-sm font-bold no-underline ${
                  activeKey === p.key
                    ? 'bg-black text-white'
                    : 'bg-white text-black/70 hover:bg-black/10'
                }`}
              >
                {p.label}
              </a>
            ))}
          </nav>

          <form action='/funnel' className='flex flex-wrap items-end gap-2'>
            {pageParam ? (
              <input type='hidden' name='page' value={pageParam} />
            ) : null}
            <label className='text-xs font-bold text-black/50'>
              From
              <input
                type='date'
                name='from'
                defaultValue={range?.from}
                max={funnelDay()}
                required
                className='mt-1 block h-9 rounded border border-black/10 bg-white px-2 text-sm text-black'
              />
            </label>
            <label className='text-xs font-bold text-black/50'>
              To
              <input
                type='date'
                name='to'
                defaultValue={range?.to}
                max={funnelDay()}
                required
                className='mt-1 block h-9 rounded border border-black/10 bg-white px-2 text-sm text-black'
              />
            </label>
            <button
              type='submit'
              className={`h-9 rounded px-4 text-sm font-bold ${
                activeKey === 'custom'
                  ? 'bg-black text-white'
                  : 'bg-white text-black/70 hover:bg-black/10'
              }`}
            >
              Apply
            </button>
          </form>
        </div>

        <section
          aria-label='Summary'
          className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-4'
        >
          <Stat
            label='Page views'
            value={views.toLocaleString()}
            note='All pages, reloads included'
          />
          <Stat
            label='Unique visitors'
            value={visitors.toLocaleString()}
            note='Counted once across the range'
          />
          <Stat
            label='Leads'
            value={leads.toLocaleString()}
            note='Submitted contact info, all pages'
          />
          <Stat
            label='Conversion rate'
            value={
              visitors > 0 ? `${((leads / visitors) * 100).toFixed(1)}%` : '—'
            }
            note='Leads ÷ unique visitors'
          />
        </section>
      </div>

      <div className='px-6 md:px-10'>
        {error ? (
          <p className='mt-6 text-sm text-red-600'>
            Couldn’t load funnel data: {error}
          </p>
        ) : null}

        <AbComparison counts={counts} />

        <nav
          aria-label='Landing page'
          className='mt-10 flex gap-6 overflow-x-auto border-b border-black/10'
        >
          {PAGES.map((p) => {
            const active = p === page;
            const landed = counts[p.stages[0].nodes[0].event] ?? 0;
            return (
              <a
                key={p.key}
                href={funnelHref({
                  ...rangeParams,
                  page: p === PAGES[0] ? undefined : p.key,
                })}
                aria-current={active ? 'page' : undefined}
                className={`-mb-px shrink-0 border-b-2 pb-3 no-underline ${
                  active
                    ? 'border-black text-black'
                    : 'border-transparent text-black/50 hover:text-black/80'
                }`}
              >
                <span className='block text-base font-bold'>{p.path}</span>
                <span className='block text-xs'>
                  {p.description} · {landed.toLocaleString()} sessions
                </span>
              </a>
            );
          })}
        </nav>

        <div className='mt-6'>
          <FunnelChart stages={page.stages} counts={counts} />
        </div>

        <p className='mt-10 text-xs text-black/40'>
          Days run midnight to midnight, {FUNNEL_TIMEZONE} time.
        </p>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className='rounded-lg border border-black/10 bg-white p-5'>
      <p className='text-sm font-bold text-black/60'>{label}</p>
      <p className='mt-2 text-4xl font-semibold leading-none tabular-nums'>
        {value}
      </p>
      <p className='mt-2 text-xs text-black/40'>{note}</p>
    </div>
  );
}

// Standard normal CDF (Abramowitz–Stegun approximation), for the A/B
// confidence figure below.
function normalCdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

// How confident we can be that the two lead rates genuinely differ
// (two-proportion z-test, two-sided). Null until both variants have
// enough sessions for the number to mean anything.
function confidenceTheyDiffer(
  leadsA: number,
  sessionsA: number,
  leadsB: number,
  sessionsB: number
): number | null {
  if (sessionsA < 30 || sessionsB < 30) return null;
  const pooled = (leadsA + leadsB) / (sessionsA + sessionsB);
  const se = Math.sqrt(
    pooled * (1 - pooled) * (1 / sessionsA + 1 / sessionsB)
  );
  if (se === 0) return null;
  const z = (leadsB / sessionsB - leadsA / sessionsA) / se;
  return 1 - 2 * (1 - normalCdf(Math.abs(z)));
}

function rate(part: number, whole: number) {
  return whole > 0 ? part / whole : null;
}

function formatRate(value: number | null) {
  return value === null ? '—' : `${(value * 100).toFixed(1)}%`;
}

/**
 * Side-by-side A/B summary for the home page test: the key steps for each
 * variant as a share of its own sessions, B's lift over A, and how
 * confident we can be that the lead rates really differ.
 */
function AbComparison({ counts }: { counts: FunnelCounts }) {
  const rows = [
    { label: 'Sessions', event: FUNNEL_EVENTS.landed },
    { label: 'Clicked CTA', event: FUNNEL_EVENTS.ctaClick },
    { label: 'Started quote', event: FUNNEL_EVENTS.quizStart },
    { label: 'In service area', event: FUNNEL_EVENTS.zipInArea },
    { label: 'Leads', event: FUNNEL_EVENTS.contactSubmit },
  ];
  const count = (variant: 'a' | 'b', event: string) =>
    counts[funnelEvent(VARIANTS[variant].funnel, event)] ?? 0;

  const sessionsA = count('a', FUNNEL_EVENTS.landed);
  const sessionsB = count('b', FUNNEL_EVENTS.landed);
  const leadsA = count('a', FUNNEL_EVENTS.contactSubmit);
  const leadsB = count('b', FUNNEL_EVENTS.contactSubmit);
  const rateA = rate(leadsA, sessionsA);
  const rateB = rate(leadsB, sessionsB);
  const lift =
    rateA !== null && rateB !== null && rateA > 0 ? rateB / rateA - 1 : null;
  const confidence = confidenceTheyDiffer(leadsA, sessionsA, leadsB, sessionsB);

  return (
    <section aria-labelledby='ab-heading' className='mt-10'>
      <h2 id='ab-heading' className='text-xl font-bold'>
        Home page A/B test
      </h2>
      <p className='mt-1 text-sm text-black/50'>
        Visitors to / are split between the two designs. Percentages are of
        each variant&rsquo;s own sessions.
      </p>

      <div className='mt-4 overflow-x-auto rounded-lg border border-black/10 bg-white'>
        <table className='w-full min-w-[520px] text-sm'>
          <thead>
            <tr className='border-b border-black/10 text-left text-black/50'>
              <th className='px-4 py-3 font-semibold'>Step</th>
              <th className='px-4 py-3 font-semibold'>{VARIANTS.a.label}</th>
              <th className='px-4 py-3 font-semibold'>{VARIANTS.b.label}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const a = count('a', row.event);
              const b = count('b', row.event);
              return (
                <tr key={row.event} className='border-b border-black/5'>
                  <td className='px-4 py-3 font-semibold'>{row.label}</td>
                  {[
                    [a, sessionsA],
                    [b, sessionsB],
                  ].map(([value, sessions], j) => (
                    <td key={j} className='px-4 py-3 tabular-nums'>
                      {value.toLocaleString()}
                      {i > 0 ? (
                        <span className='ml-2 text-black/40'>
                          {formatRate(rate(value, sessions))}
                        </span>
                      ) : null}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <Stat
          label='Lead rate A vs B'
          value={`${formatRate(rateA)} / ${formatRate(rateB)}`}
          note='Leads ÷ sessions'
        />
        <Stat
          label='B vs A'
          value={
            lift === null ? '—' : `${lift >= 0 ? '+' : ''}${(lift * 100).toFixed(0)}%`
          }
          note='Relative change in lead rate'
        />
        <Stat
          label='Confidence'
          value={confidence === null ? '—' : `${(confidence * 100).toFixed(0)}%`}
          note={
            confidence === null
              ? 'Needs 30+ sessions per variant'
              : confidence >= 0.95
                ? 'Likely a real difference'
                : 'Not conclusive yet — keep it running'
          }
        />
      </div>
    </section>
  );
}
