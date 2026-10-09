import { REVIEWS } from '@/data/reviews';

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function Stars({ className = '' }: { className?: string }) {
  return (
    <span className={`text-amber-400 ${className}`} aria-hidden='true'>
      ★★★★★
    </span>
  );
}

/**
 * Endless row of Google review cards. Like the hero photo carousel, the
 * list is rendered four times and slides by half its width so the loop is
 * seamless; spacing is per-card padding so every card is the same width.
 * Pauses on hover; with reduced motion it's a swipeable row instead.
 */
export default function ReviewMarquee() {
  if (REVIEWS.length === 0) return null;

  return (
    <section
      aria-labelledby='reviews-heading'
      className='border-t border-black/5 bg-white py-10'
    >
      <div className='px-6 text-center'>
        <h2
          id='reviews-heading'
          className='text-sm font-bold tracking-[0.12em] text-black/60 uppercase'
        >
          Real 5-star Google reviews from our customers
        </h2>
        <p className='mt-2 flex items-center justify-center gap-2 text-sm'>
          <Stars className='text-lg' />
          <span className='font-bold text-black'>5.0</span>
          <span className='text-black/60'>· 100% 5-star reviews on Google</span>
        </p>
      </div>

      <div className='group mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto'>
        <ul className='flex w-max animate-[marquee_160s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none'>
          {Array.from({ length: 4 }, () => REVIEWS)
            .flat()
            .map((review, i) => {
              // The extra copies only exist to make the loop seamless, so
              // screen readers skip them.
              const isDuplicate = i >= REVIEWS.length;
              return (
                <li
                  key={i}
                  aria-hidden={isDuplicate || undefined}
                  className='w-80 shrink-0 pr-4'
                >
                  <figure className='h-full rounded-xl border border-black/10 bg-[#f7f8fa] p-4'>
                    <figcaption className='flex items-center gap-3'>
                      <span
                        aria-hidden='true'
                        className='flex size-9 shrink-0 items-center justify-center rounded-full bg-skyline-blue text-sm font-bold text-white'
                      >
                        {initials(review.name)}
                      </span>
                      <span className='min-w-0 flex-1'>
                        <span className='block truncate text-sm font-bold text-black'>
                          {review.name}
                        </span>
                        <Stars className='text-sm' />
                        <span className='sr-only'>5 out of 5 stars</span>
                      </span>
                      <span className='text-xs font-bold text-black/40'>
                        Google
                      </span>
                    </figcaption>
                    <blockquote className='mt-3 line-clamp-4 text-sm leading-relaxed text-black/70'>
                      &ldquo;{review.text}&rdquo;
                    </blockquote>
                  </figure>
                </li>
              );
            })}
        </ul>
      </div>
    </section>
  );
}
