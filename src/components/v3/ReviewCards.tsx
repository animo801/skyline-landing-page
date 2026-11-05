'use client';

import { useState } from 'react';
import { REVIEWS } from '@/data/reviews';

/**
 * Swipeable row of real Google review cards for /v3. Long reviews are
 * clipped to the card and can be expanded with "Read more".
 */
export default function ReviewCards() {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  return (
    <ul className='flex snap-x snap-mandatory scroll-px-6 items-start gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none]'>
      {REVIEWS.map((review, i) => {
        const isOpen = expanded.has(i);
        return (
          <li
            key={review.name}
            className='flex min-h-[360px] w-[291px] shrink-0 snap-start flex-col rounded-[8px] border border-black/12 bg-[#f9f9f9] px-4 pt-[19px] pb-6'
          >
            <p className='text-[14px] leading-4 font-bold text-black/60'>
              5-star Google review
            </p>
            <blockquote
              className={`mt-[5px] text-[18px] leading-7 text-black ${isOpen ? '' : 'line-clamp-7'}`}
            >
              &ldquo;{review.text}&rdquo;
            </blockquote>
            {!isOpen && review.text.length > 220 && (
              <button
                type='button'
                onClick={() => setExpanded((prev) => new Set(prev).add(i))}
                className='mt-1 self-start text-[16px] leading-7 font-bold text-skyline-blue underline underline-offset-2'
              >
                Read more
              </button>
            )}
            <div className='mt-auto flex items-center gap-3 pt-6'>
              <span
                aria-hidden='true'
                className='flex size-12 shrink-0 items-center justify-center rounded-full bg-[#d9d9d9] text-lg font-bold text-black/50'
              >
                {review.name.charAt(0)}
              </span>
              <p className='text-[16px] leading-7 font-bold text-black'>
                {review.name}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
