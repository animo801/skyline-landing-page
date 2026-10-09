'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { SHOWCASE_PHOTOS } from '@/data/showcasePhotos';

const INTERVAL_MS = 3500;

/**
 * Framed photo that crossfades through lighting styles, with the style's
 * name glowing above it. Pauses while hovered or focused, and doesn't
 * auto-advance for visitors who prefer reduced motion.
 */
export default function ShowcaseRotator() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || SHOWCASE_PHOTOS.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SHOWCASE_PHOTOS.length),
      INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, [paused]);

  if (SHOWCASE_PHOTOS.length === 0) return null;

  return (
    <div
      className='mx-auto w-full max-w-2xl'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p
        aria-live='polite'
        className='text-center text-2xl font-black tracking-[0.15em] text-white uppercase [text-shadow:0_0_12px_rgba(255,226,150,0.9),0_0_28px_rgba(255,200,90,0.6)] sm:text-3xl'
      >
        {SHOWCASE_PHOTOS[index].label}
      </p>
      <div className='relative mt-4 aspect-[3/2] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10'>
        {SHOWCASE_PHOTOS.map((photo, i) => (
          <Image
            key={i}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes='(min-width: 768px) 672px, 100vw'
            aria-hidden={i !== index || undefined}
            style={{ objectPosition: photo.position }}
            className={`object-cover transition-opacity duration-1000 motion-reduce:transition-none ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
