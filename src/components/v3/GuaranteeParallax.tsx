'use client';

import { useEffect, useRef } from 'react';

// The guarantee photo in two layers: the sky, and everything else (houses,
// fence, the installer and his ladder) cut out of it in one piece. `shift`
// is how far each layer drifts, in px, across the section's trip through
// the screen. Both drift down against the scroll so they seem to move
// slower than the page, the scene a bit less than the sky. The sky has the
// area behind the scene filled in so nothing shows through as they part.
const LAYERS = [
  // The sky has extra rows on top (12% of the photo's height) so it can
  // drift down without a gap.
  { src: '/images/v3/guarantee/sky.webp', shift: 150, extraTop: 300 / 2493 },
  { src: '/images/v3/guarantee/scene.webp', shift: 75 },
];

/**
 * The /v3 guarantee section's photo with a parallax scroll: the scene
 * moves as one piece, a little slower than the page, and the sky behind it
 * a little slower still. Sits behind the section's text, filling the same
 * frame the single photo did. Stays still with reduced motion.
 */
export default function GuaranteeParallax() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 1 when the section is just below the screen, -1 when just above.
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / ((vh + rect.height) / 2);
      el.style.setProperty(
        '--parallax',
        String(Math.max(-1, Math.min(1, progress))),
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      role='img'
      aria-label='Skyline installer on a ladder fixing lights on a customer’s roofline'
      className='absolute inset-0'
    >
      {LAYERS.map((layer) => (
        <div
          key={layer.src}
          // Same frame (crop and position) the design gives the photo.
          className='absolute top-[-3.33%] left-0 h-[118.49%] w-[164.59%] will-change-transform'
          style={{
            transform: `translate3d(0, calc(var(--parallax, 0) * ${-layer.shift}px), 0)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={layer.src}
            alt=''
            decoding='async'
            className='absolute left-0 w-full max-w-none'
            style={
              layer.extraTop
                ? {
                    top: `${-layer.extraTop * 100}%`,
                    height: `${(1 + layer.extraTop) * 100}%`,
                  }
                : { top: 0, height: '100%' }
            }
          />
        </div>
      ))}
    </div>
  );
}
