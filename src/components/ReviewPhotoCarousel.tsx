import Image from 'next/image';
import { REVIEW_PHOTOS } from '@/data/reviewPhotos';

/**
 * Endless horizontal strip of round customer profile photos. The list is
 * rendered four times back to back and the track slides left by exactly
 * half its width (two copies), so the loop restarts seamlessly and never
 * shows a gap, even on very wide screens. Spacing is padding on each item
 * rather than flex `gap`, so every item is the same width and half the
 * track lines up exactly with the start of the third copy. Pauses on hover; with reduced motion turned on
 * it stops animating and becomes a swipeable row instead.
 */
export default function ReviewPhotoCarousel() {
  if (REVIEW_PHOTOS.length === 0) return null;

  return (
    <div className='mt-8'>
      <p className='text-base font-bold text-black/75 sm:text-lg'>
        100% 5-star reviews on Google
      </p>
      <div
        aria-label='Our customers'
        className='group mt-3 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-x-auto'
      >
        <ul className='flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none'>
          {Array.from({ length: 4 }, () => REVIEW_PHOTOS)
            .flat()
            .map((photo, i) => {
              // The extra copies only exist to make the loop seamless, so
              // screen readers skip them.
              const isDuplicate = i >= REVIEW_PHOTOS.length;
              return (
                <li
                  key={i}
                  aria-hidden={isDuplicate || undefined}
                  className='shrink-0 pr-3'
                >
                  <div className='relative size-16 sm:size-[72px]'>
                    <Image
                      src={photo.src}
                      alt={isDuplicate ? '' : photo.alt}
                      fill
                      sizes='72px'
                      className='object-contain'
                    />
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
