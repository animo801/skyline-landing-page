import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import FunnelTracker from '@/components/FunnelTracker';
import FeatureCallouts from '@/components/v3/FeatureCallouts';
import GuaranteeParallax from '@/components/v3/GuaranteeParallax';
import HouseCarousel from '@/components/v3/HouseCarousel';
import ReviewCards from '@/components/v3/ReviewCards';
import { V3_APP_VIDEO, V3_REASONS } from '@/data/v3Content';
import { FUNNEL_EVENTS, funnelEvent } from '@/lib/funnel';

// Fallback for Helvetica Neue Condensed on devices that don't have it
// (see .font-v3-condensed in globals.css).
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-v3-fallback',
});

// Standalone landing page (not part of the home page A/B test), built from
// the "Skyline Permanent Lighting" Figma design. Its button opens the
// full-page quote flow at /v3/quote, and both report to the v3 funnel.
export const metadata: Metadata = {
  title: 'Skyline Smart Lighting | Free Quote for Permanent Christmas Lights',
  description:
    'Get a free quote for permanent Christmas lights. In around 10 minutes, our team will call to discuss options and see if we’re a good fit.',
  robots: { index: false, follow: false },
};

// Content column: the design is a 402px-wide phone layout with 24px sides.
const column = 'mx-auto w-full max-w-[480px] px-6';

export default function LandingPageV3() {
  return (
    <main className={`${archivo.variable} font-v3`}>
      <FunnelTracker
        landedEvent={funnelEvent('v3', FUNNEL_EVENTS.landed)}
        ctaClickEvent={funnelEvent('v3', FUNNEL_EVENTS.ctaClick)}
      />

      {/* Hero */}
      <section className='bg-skyline-blue pt-4 pb-[46px] text-white'>
        <div className={column}>
          <Image
            src='/images/v3/logo.svg'
            alt='Skyline Smart Lighting'
            width={178.533}
            height={47.6404}
            priority
            className='block'
          />
        </div>

        <div className='mt-4'>
          <HouseCarousel />
        </div>

        <div className={`${column} mt-[21px]`}>
          <h1 className='font-v3-condensed text-[38px] leading-[34px] font-black'>
            Get your{' '}
            <span className='-ml-1 inline-block bg-skyline-navy pl-1 leading-[30px] shadow-[6px_0_0_var(--color-skyline-navy)]'>
              free quote
            </span>{' '}
            for permanent Christmas lights
          </h1>
          <p className='mt-2 max-w-[319px] text-[20px] leading-6'>
            In around 10 minutes, our team will call you to discuss options and
            see if we&rsquo;re a good fit.
          </p>
          {/* data-cta lets FunnelTracker log clicks on this button. */}
          <Link
            href='/v3/quote'
            data-cta='quote'
            className='mt-6 flex h-14 items-center justify-center bg-skyline-navy text-[20px] leading-[30px] font-bold transition-colors hover:bg-[#0a1d7a]'
          >
            Get your free quote
          </Link>
        </div>
      </section>

      {/* 3 things that make our lights unique */}
      <section className='bg-black text-white'>
        <div className='relative mx-auto aspect-[402/906] w-full max-w-[480px] overflow-hidden'>
          <Image
            src='/images/v3/lights.webp'
            alt='White house lit along every roofline and peak with warm white permanent lights'
            width={1654}
            height={4094}
            sizes='(min-width: 480px) 480px, 100vw'
            className='absolute top-0 left-0 h-auto w-[99.75%]'
          />
          <h2 className='font-v3-condensed absolute inset-x-0 top-[9.71%] mx-auto w-[354px] max-w-full text-center text-[40px] leading-10 font-black'>
            3 things that make our lights unique
          </h2>

          <FeatureCallouts />
        </div>
      </section>

      {/* Skyline's "If It Breaks, We Fix It" Guarantee */}
      <section className='bg-[#0b2c78] text-white'>
        <div className='relative mx-auto aspect-[401/1052] w-full max-w-[480px] overflow-hidden'>
          <GuaranteeParallax />
          <div className='relative px-6 pt-20'>
            <h2>
              <span className='block text-[28px] leading-[30px] font-bold opacity-60'>
                Skyline&rsquo;s
              </span>
              <span className='sr-only'>
                &ldquo;If It Breaks, We Fix It&rdquo; Guarantee
              </span>
              <span
                aria-hidden='true'
                className='relative mt-[7px] block h-[113px] w-[345px] max-w-full'
              >
                <span className='absolute top-0 left-0 h-[92.893px] w-[344.791px]'>
                  <span className='absolute inset-[-1.22%_-0.29%_-1.08%_-0.38%]'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=''
                      src='/images/v3/if-it-breaks.svg'
                      className='block size-full max-w-none'
                    />
                  </span>
                </span>
                <span className='absolute top-[98.53px] left-[158.58px] h-[20.916px] w-[137.595px]'>
                  <span className='absolute inset-[-2.39%_-0.36%]'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=''
                      src='/images/v3/guarantee-word.svg'
                      className='block size-full max-w-none'
                    />
                  </span>
                </span>
              </span>
            </h2>
            <p className='mt-6 max-w-[354px] text-[20px] leading-[30px]'>
              Very simple. If something breaks on your lights, we will come out
              and fix it. No questions asked. Best guarantee in the state.
            </p>
          </div>
        </div>
      </section>

      {/* Dedicated app: video background with the heading over it */}
      <section className='bg-[#030411] text-white'>
        <div className='relative mx-auto aspect-[402/852] w-full max-w-[480px] overflow-hidden'>
          {V3_APP_VIDEO ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload='metadata'
              poster={V3_APP_VIDEO.poster}
              aria-hidden='true'
              className='absolute inset-0 size-full object-cover'
            >
              <source src={V3_APP_VIDEO.src} type={V3_APP_VIDEO.type} />
            </video>
          ) : (
            <Image
              src='/images/v3/app-screenshot.webp'
              alt='The Skyline app’s lighting presets on a phone, in front of a lit-up home'
              width={1086}
              height={1946}
              sizes='(min-width: 480px) 480px, 100vw'
              className='absolute bottom-0 left-0 h-auto w-full'
            />
          )}
          {/* Keeps the heading readable over the video. */}
          <div className='absolute inset-x-0 top-0 h-[160px] bg-gradient-to-b from-[#030411] from-75% to-transparent' />
          <div className='relative px-6 pt-9'>
            <p className='text-[20px] leading-[30px] font-bold opacity-70'>
              Control your lights with our
            </p>
            <h2 className='font-v3-condensed mt-2 text-[50px] leading-[30px] font-black'>
              Dedicated app
            </h2>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className='bg-white pt-[102px] pb-[147px]'>
        <div className={column}>
          <h2 className='max-w-[291px] text-[32px] leading-[30px] font-bold text-[#111]'>
            Hear what 90+ customers say on
            <span className='sr-only'> Google</span>
          </h2>
          <div className='relative mt-[5px] h-[60px] w-[165px] overflow-hidden'>
            <Image
              src='/images/v3/google.webp'
              alt=''
              width={2432}
              height={1216}
              sizes='315px'
              className='absolute top-[-83.01%] left-[-44.39%] h-[264.92%] w-[190.75%] max-w-none'
            />
          </div>
        </div>
        <div className='mx-auto mt-[21px] max-w-[480px]'>
          <ReviewCards />
        </div>
      </section>

      {/* 8 reasons */}
      <section className='bg-[#f3f4f6] pt-16 pb-16 text-[#111]'>
        <div className={column}>
          <h2 className='font-v3-condensed text-[36px] leading-7 font-black'>
            8 reasons why Permanent Christmas Lights are{' '}
            <span className='relative inline-block'>
              <span
                aria-hidden='true'
                className='absolute -inset-x-[3px] bottom-0 -z-0 h-[21px] bg-skyline-highlight'
              />
              <span className='relative'>better</span>
            </span>
          </h2>
          <ul className='mt-[31px] grid grid-cols-2 gap-[10px]'>
            {V3_REASONS.map((reason) => (
              <li
                key={reason.label}
                className='font-v3-condensed flex h-[142px] flex-col justify-end gap-2.5 bg-white px-3 pb-4 leading-5 font-black'
                style={{ fontSize: reason.size }}
              >
                <reason.icon
                  size={36}
                  weight='bold'
                  aria-hidden='true'
                  className='shrink-0 text-skyline-blue'
                />
                {reason.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing call to action */}
      <section className='bg-skyline-blue py-16 text-white'>
        <div className={column}>
          <h2 className='font-v3-condensed text-[38px] leading-[34px] font-black'>
            Ready for lights you&rsquo;ll{' '}
            <span className='-ml-1 inline-block bg-skyline-navy pl-1 leading-[30px] shadow-[6px_0_0_var(--color-skyline-navy)]'>
              never hang
            </span>{' '}
            again?
          </h2>
          <p className='mt-3 max-w-[319px] text-[20px] leading-6'>
            In around 10 minutes, our team will call you to discuss options
            and see if we&rsquo;re a good fit.
          </p>
          {/* data-cta lets FunnelTracker log clicks on this button. */}
          <Link
            href='/v3/quote'
            data-cta='quote'
            className='mt-6 flex h-14 items-center justify-center bg-skyline-navy text-[20px] leading-[30px] font-bold transition-colors hover:bg-[#0a1d7a]'
          >
            Get your free quote
          </Link>
        </div>
      </section>
    </main>
  );
}
