'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { SHOWCASE_PHOTOS } from '@/data/showcasePhotos';

// Pixels per second the strip drifts on its own.
const AUTO_SPEED = 30;
// After a swipe ends, wait this long (for momentum) before auto-scrolling
// picks up again from wherever the swipe left it.
const RESUME_DELAY_MS = 1200;
// The list is rendered this many times so there's room to swipe either way
// before the loop quietly jumps back to the middle copy.
const COPIES = 3;

/**
 * Endless, auto-scrolling strip of recent installs. It's a real scroll
 * container, so on a phone a swipe moves it along faster (with native
 * momentum) and the drift carries on afterwards. Pauses on hover; doesn't
 * auto-scroll for visitors who prefer reduced motion.
 */
export default function InstallCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Width of one copy of the list.
    const copyWidth = () => scroller.scrollWidth / COPIES;
    let position = copyWidth();
    scroller.scrollLeft = position;

    let interacting = false;
    let hovering = false;
    let resumeTimer: number | undefined;
    let lastTime: number | null = null;
    let frame = 0;

    const startInteraction = () => {
      interacting = true;
      window.clearTimeout(resumeTimer);
    };
    const endInteraction = () => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        interacting = false;
      }, RESUME_DELAY_MS);
    };

    const tick = (time: number) => {
      const elapsed = lastTime === null ? 0 : (time - lastTime) / 1000;
      lastTime = time;
      const width = copyWidth();

      if (interacting || hovering || reduceMotion) {
        // Follow wherever the visitor scrolled to.
        position = scroller.scrollLeft;
      } else {
        position += AUTO_SPEED * elapsed;
        // Keep within the middle copy so the loop never runs out. Done only
        // while idle, since jumping mid-swipe would cancel its momentum.
        if (position >= width * 2) position -= width;
        if (position < width * 0.5) position += width;
        scroller.scrollLeft = position;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onWheel = () => {
      startInteraction();
      endInteraction();
    };
    const onEnter = () => (hovering = true);
    const onLeave = () => (hovering = false);
    scroller.addEventListener('touchstart', startInteraction, { passive: true });
    scroller.addEventListener('touchend', endInteraction);
    scroller.addEventListener('touchcancel', endInteraction);
    scroller.addEventListener('wheel', onWheel, { passive: true });
    scroller.addEventListener('mouseenter', onEnter);
    scroller.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resumeTimer);
      scroller.removeEventListener('touchstart', startInteraction);
      scroller.removeEventListener('touchend', endInteraction);
      scroller.removeEventListener('touchcancel', endInteraction);
      scroller.removeEventListener('wheel', onWheel);
      scroller.removeEventListener('mouseenter', onEnter);
      scroller.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={scrollerRef}
      aria-label='Recent Skyline installs'
      className='overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
    >
      <ul className='flex w-max'>
        {Array.from({ length: COPIES }, () => SHOWCASE_PHOTOS)
          .flat()
          .map((photo, i) => {
            // Only the middle copy is announced; the others exist so the
            // loop never visibly ends.
            const isDuplicate = Math.floor(i / SHOWCASE_PHOTOS.length) !== 1;
            return (
              <li
                key={i}
                aria-hidden={isDuplicate || undefined}
                className='w-64 shrink-0 pr-3 sm:w-72'
              >
                <div className='relative aspect-[4/3] overflow-hidden rounded-xl'>
                  <Image
                    src={photo.src}
                    alt={isDuplicate ? '' : photo.alt}
                    fill
                    sizes='288px'
                    style={{ objectPosition: photo.position }}
                    className='object-cover'
                  />
                </div>
                <p className='mt-2 text-sm font-bold text-black/70'>
                  {photo.label}
                </p>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
