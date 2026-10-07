import Image from 'next/image';
import Link from 'next/link';
import heroHouse from '../../public/images/image.jpg';

export default function Hero() {
  return (
    <section className='relative w-full md:flex md:min-h-screen md:flex-row-reverse'>
      {/* Logo: pinned to the top-left of the whole section (not the image),
          so it stays put regardless of which side the image is on. */}
      <Link
        href='/'
        className='absolute top-4 left-6 z-20 block w-35 sm:top-6 sm:left-8 sm:w-40'
      >
        <Image
          src='/images/skyline-logo.svg'
          alt='Skyline Smart Lighting'
          width={178.53}
          height={47.64}
          className='h-auto w-full'
          priority
        />
      </Link>

      {/* Image: extended 40% taller than the visible frame on mobile so the
          extra height sits behind (under) the blue content panel below it. */}
      <div className='relative h-[84vh] min-h-147 w-full md:h-auto md:min-h-screen md:w-1/2'>
        <Image
          src={heroHouse}
          alt='A house at night showing off permanent Christmas lights installed along the roofline'
          fill
          priority
          sizes='(min-width: 768px) 50vw, 100vw'
          className='object-cover object-[center_12%] md:object-[center_25%]'
        />
      </div>

      {/* Content panel: sits in normal flow below the image on mobile (so it
          can grow past the image's bottom edge), full split panel beside the
          image on desktop. */}
      <div className='relative z-10 mt-[-36vh] mr-6 bg-skyline-blue py-8 pl-6 pr-6 shadow-2xl sm:mr-2 sm:py-10 sm:pl-8 sm:pr-8 md:mt-0 md:mr-0 md:flex md:w-1/2 md:flex-col md:justify-center md:px-16 md:py-12 md:shadow-none lg:px-20'>
        <div className='mx-auto w-full max-w-md md:mx-0 md:max-w-4xl lg:max-w-6xl'>
          <h1 className='text-[30px] leading-[1] font-black text-white sm:text-4xl md:text-5xl lg:text-[62px]'>
            Get your{' '}
            {/* Single-color vertical band: transparent top/bottom, hard-cut
                to fully opaque skyline-navy for the middle 70% — no fade,
                just a sharp edge at 15%/85%. */}
            <span className='bg-[linear-gradient(to_bottom,transparent_0%,transparent_15%,var(--color-skyline-navy)_15%,var(--color-skyline-navy)_85%,transparent_85%,transparent_100%)] box-decoration-clone px-1'>
              free quote
            </span>{' '}
            for permanent Christmas lights
          </h1>

          <p className='mt-3 text-lg leading-relaxed text-white/90 md:text-xl lg:text-[26px]'>
            In around 10 minutes, our team will call you to discuss options and
            see if we&rsquo;re a good fit.
          </p>

          {/* data-cta lets FunnelTracker log clicks on this button. */}
          <Link
            href='/quote'
            data-cta='quote'
            className='mt-8 inline-flex h-14 w-full items-center justify-center bg-skyline-navy px-8 text-lg font-bold text-white transition-colors hover:bg-skyline-navy/90 sm:w-auto'
          >
            Get your free quote
          </Link>
        </div>
      </div>
    </section>
  );
}
