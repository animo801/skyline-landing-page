import Image from 'next/image';
import Link from 'next/link';
import FunnelTracker from '@/components/FunnelTracker';
import ReviewMarquee from '@/components/v2/ReviewMarquee';
import ShowcaseRotator from '@/components/v2/ShowcaseRotator';
import Snowfall from '@/components/v2/Snowfall';
import { FUNNEL_EVENTS, funnelEvent } from '@/lib/funnel';
import type { FunnelId } from '@/lib/funnel';
import heroHouse from '../../../public/images/showcase/everyday-accent.webp';

/**
 * The single-scroll landing page layout shared by /v2 and /virtual-quote:
 * dark nighttime hero with snowfall, a rotating lighting showcase, and
 * review cards. The quiz either sits in a card on the page (children, as on
 * /v2) or lives on its own page that the hero button links to (ctaHref, as
 * on /virtual-quote). Each page supplies its own copy and which funnel on
 * /funnel it reports to.
 */
export default function NightLandingPage({
  funnel,
  badge,
  subhead,
  ctaLabel,
  ctaHref,
  cardTitle,
  cardSubtitle,
  children,
}: {
  funnel: FunnelId;
  badge: string;
  subhead: string;
  ctaLabel: string;
  // Where the hero button goes. Omit to scroll to the on-page quiz card.
  ctaHref?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  children?: React.ReactNode;
}) {
  const ctaClassName =
    'mt-6 inline-flex h-14 w-full items-center justify-center bg-skyline-blue px-8 text-lg font-bold text-white transition-colors hover:bg-skyline-blue/90 sm:w-auto';

  return (
    <main>
      <FunnelTracker
        landedEvent={funnelEvent(funnel, FUNNEL_EVENTS.landed)}
        ctaClickEvent={funnelEvent(funnel, FUNNEL_EVENTS.ctaClick)}
      />

      <section className='relative overflow-hidden bg-[#071233] text-white'>
        <Image
          src={heroHouse}
          alt=''
          fill
          priority
          sizes='100vw'
          className='object-cover object-[center_40%]'
        />
        {/* Darkens the photo into a night-sky backdrop so white text reads
            clearly, fading to solid at the bottom. */}
        <div className='absolute inset-0 bg-gradient-to-b from-[#071233]/80 via-[#071233]/85 to-[#071233]' />
        <Snowfall />

        <div className='relative z-10 mx-auto max-w-3xl px-5 pt-8 pb-14 text-center sm:px-8'>
          <Image
            src='/images/skyline-logo.svg'
            alt='Skyline Smart Lighting'
            width={178.53}
            height={47.64}
            className='mx-auto h-auto w-36 sm:w-44'
            priority
          />

          <p className='mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.12em] uppercase backdrop-blur-sm sm:text-sm'>
            <span className='relative flex size-2'>
              <span className='absolute inline-flex size-full animate-ping rounded-full bg-skyline-highlight opacity-75 motion-reduce:animate-none' />
              <span className='relative inline-flex size-2 rounded-full bg-skyline-highlight' />
            </span>
            {badge}
          </p>

          <h1 className='mt-5 text-[34px] leading-[1.05] font-black [-webkit-text-stroke:0.025em_currentColor] sm:text-5xl lg:text-6xl'>
            Beautiful Christmas lights{' '}
            <span className='text-[#9db0ff]'>
              you&rsquo;ll never install again.
            </span>
          </h1>

          <p className='mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl'>
            {subhead}
          </p>

          {/* data-cta lets FunnelTracker log clicks on this button. */}
          {ctaHref ? (
            <Link href={ctaHref} data-cta='quote' className={ctaClassName}>
              {ctaLabel}
            </Link>
          ) : (
            <a href='#quote' data-cta='quote' className={ctaClassName}>
              {ctaLabel}
            </a>
          )}

          <div className='mt-12'>
            <ShowcaseRotator />
          </div>
        </div>
      </section>

      {children && (
        <section
          id='quote'
          aria-labelledby='quote-heading'
          className='scroll-mt-4 bg-[#f3f4f6] px-4 py-10 sm:py-14'
        >
          <div className='mx-auto max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-8'>
            <div className='text-center'>
              <h2
                id='quote-heading'
                className='text-xl font-black tracking-wide text-[#111] uppercase'
              >
                {cardTitle}
              </h2>
              <p className='mt-1 text-sm text-black/60'>{cardSubtitle}</p>
            </div>
            <div className='mt-6 border-t border-black/10 pt-6'>{children}</div>
          </div>
        </section>
      )}

      <ReviewMarquee />
    </main>
  );
}
