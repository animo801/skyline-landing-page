import Image from 'next/image';
import { REVIEW_PHOTOS } from '@/data/reviewPhotos';

/**
 * Endless horizontal strip of customer photos. The list is rendered twice
 * back to back and the track slides left by exactly half its width, so the
 * loop restarts seamlessly. Pauses on hover; with reduced motion turned on
 * it stops animating and becomes a swipeable row instead.
 */
export default function ReviewPhotoCarousel() {
  if (REVIEW_PHOTOS.length === 0) return null;

  return (
    <div
      aria-label='Photos from our customers'
      className='group mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-x-auto'
    >
      <ul className='flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none'>
        {[...REVIEW_PHOTOS, ...REVIEW_PHOTOS].map((photo, i) => {
          // The second copy only exists to make the loop seamless, so
          // screen readers skip it.
          const isDuplicate = i >= REVIEW_PHOTOS.length;
          return (
            <li
              key={i}
              aria-hidden={isDuplicate || undefined}
              className='relative size-24 shrink-0 overflow-hidden rounded-md sm:size-28 lg:size-32'
            >
              <Image
                src={photo.src}
                alt={isDuplicate ? '' : photo.alt}
                fill
                sizes='128px'
                className='object-cover'
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
