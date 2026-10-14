'use client';

import Image from 'next/image';
import { COVERAGE_OPTIONS, formatUsd } from '@/lib/estimate';
import type { Coverage, Estimate } from '@/lib/estimate';
import { STORIES_OPTIONS, TIMELINE_OPTIONS } from '@/lib/funnel';
import { WARRANTY, WHATS_INCLUDED } from '@/data/estimateResultContent';
import InstallCarousel from './InstallCarousel';
import { useQuoteLayout } from './QuoteLayout';
import type { HomeStories } from './HomeStoriesStep';
import type { Timeline } from './TimelineStep';

export type EstimateAnswers = {
  zip: string;
  stories: HomeStories | null;
  coverage: Coverage | null;
  squareFeet: number | null;
  timeline: Timeline | null;
};

function CheckIcon() {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 20 20'
      className='mt-0.5 size-5 shrink-0 text-skyline-blue'
    >
      <circle cx='10' cy='10' r='10' fill='currentColor' opacity='0.12' />
      <path
        d='M6 10.5l2.5 2.5L14 7.5'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 24 24' className='size-6 text-skyline-blue'>
      <path
        d='M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z'
        fill='currentColor'
        opacity='0.15'
      />
      <path
        d='M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.75'
        strokeLinejoin='round'
      />
      <path
        d='M9 12l2 2 4-4'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.75'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

const sectionHeading = 'text-xl font-black text-[#111]';

// Final screen of /virtual-quote: their price range, the answers it's
// based on, an example install, what's included, and the warranty.
export default function EstimateResultStep({
  firstName,
  estimate,
  answers,
}: {
  firstName: string;
  estimate: Estimate | null;
  answers: EstimateAnswers;
}) {
  const isCard = useQuoteLayout() === 'card';

  const summary = [
    { label: 'Zip code', value: answers.zip },
    {
      label: 'Home',
      value: STORIES_OPTIONS.find((o) => o.value === answers.stories)?.label,
    },
    {
      label: 'Coverage',
      value: COVERAGE_OPTIONS.find((o) => o.value === answers.coverage)?.label,
    },
    {
      label: 'Size',
      value: answers.squareFeet
        ? `~${answers.squareFeet.toLocaleString('en-US')} sq ft`
        : undefined,
    },
    {
      label: 'Timeline',
      value: TIMELINE_OPTIONS.find((o) => o.value === answers.timeline)?.label,
    },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  return (
    <div className={`${isCard ? '' : 'mt-8'} flex flex-col gap-8 pb-12`}>
      {/* Estimate card */}
      <section className='overflow-hidden rounded-2xl bg-[#071233] text-white shadow-xl'>
        <div className='px-6 pt-6 pb-5 text-center'>
          <p className='text-xs font-bold tracking-[0.14em] text-white/60 uppercase'>
            {firstName ? `${firstName}, here’s your estimate` : 'Your estimate'}
          </p>
          {estimate ? (
            <p className='mt-2 text-[34px] leading-tight font-black sm:text-[40px]'>
              {formatUsd(estimate.low)}
              <span className='text-white/40'> – </span>
              {formatUsd(estimate.high)}
            </p>
          ) : (
            <p className='mt-2 text-2xl font-black'>
              We&rsquo;ll send your estimate shortly
            </p>
          )}
          <p className='mt-1 text-sm text-white/60'>
            Estimated installed price
          </p>
        </div>

        {summary.length > 0 && (
          <div className='border-t border-white/10 bg-white/5 px-6 py-4'>
            <p className='text-xs font-bold tracking-[0.12em] text-white/50 uppercase'>
              Based on your home
            </p>
            <dl className='mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm'>
              {summary.map((row) => (
                <div key={row.label}>
                  <dt className='text-white/50'>{row.label}</dt>
                  <dd className='font-bold'>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <p className='border-t border-white/10 px-6 py-4 text-center text-sm leading-relaxed text-white/80'>
          Our team will reach out soon to confirm the details. Your final price
          is confirmed after a free look at your home.
        </p>
      </section>

      {/* Recent installs: an auto-scrolling, swipeable strip that starts in
          line with the page and runs off the right edge of the screen. The
          left padding lives on the section itself so it's measured against
          the page column, matching the gutter. */}
      <section className='mr-[calc(50%-50vw)] min-w-0'>
        <h2 className={sectionHeading}>Recent Skyline installs</h2>
        <div className='mt-3'>
          <InstallCarousel />
        </div>
      </section>

      {/* What's included: a full-width grey band. The negative margins
          stretch it to the screen edges while the matching padding keeps its
          content lined up with the rest of the page. */}
      <section className='mx-[calc(50%-50vw)] bg-[#f3f4f6] px-[calc(50vw-50%)] py-10'>
        <h2 className={sectionHeading}>What&rsquo;s included</h2>
        <ul className='mt-4 grid grid-cols-2 gap-x-3 gap-y-5'>
          {WHATS_INCLUDED.map((item) => (
            <li key={item.title} className='min-w-0'>
              <div className='relative aspect-[4/3] overflow-hidden rounded-lg'>
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes='(min-width: 448px) 200px, 50vw'
                  style={{ objectPosition: item.image.position }}
                  className='object-cover'
                />
              </div>
              <div className='mt-2 flex items-start gap-1.5'>
                <CheckIcon />
                <p className='text-sm leading-snug font-bold text-[#111]'>
                  {item.title}
                </p>
              </div>
              <p className='mt-1 text-xs leading-relaxed text-black/60'>
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Warranty — styled after the warranty block on Skyline's site */}
      <section aria-labelledby='warranty-heading'>
        <div className='relative mr-2 mb-2'>
          <div
            aria-hidden='true'
            className='absolute inset-0 translate-x-2 translate-y-2 bg-[#f3ff63]'
          />
          <div className='relative border-[3px] border-[#111] bg-white px-6 py-5'>
            <p className='text-[52px] leading-none font-black tracking-tight text-skyline-blue'>
              {WARRANTY.term}
            </p>
            <p className='mt-3 text-sm font-black tracking-wide text-[#111] uppercase'>
              {WARRANTY.coverage}
            </p>
          </div>
        </div>
        <div className='mt-6 flex items-center gap-3'>
          <ShieldIcon />
          <h2 id='warranty-heading' className={sectionHeading}>
            {WARRANTY.heading}
          </h2>
        </div>
        <p className='mt-2 text-sm leading-relaxed text-black/60'>
          {WARRANTY.detail}
        </p>
      </section>

      <p className='text-center text-xs leading-relaxed text-black/40'>
        Estimates are based on your answers and typical installs, and may vary
        with your home&rsquo;s roofline.
      </p>
    </div>
  );
}
