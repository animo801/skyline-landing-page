import Image from 'next/image';
import { V3_HOUSE_PHOTOS } from '@/data/v3Content';

/**
 * Endless, auto-scrolling strip of install photos for the /v3 hero. The
 * track holds the photo list twice and slides left by half its width (the
 * shared `marquee` keyframes), so the loop restarts seamlessly. With
 * reduced motion it stops and can be swiped instead.
 */
export default function HouseCarousel() {
  const photos = [...V3_HOUSE_PHOTOS, ...V3_HOUSE_PHOTOS];

  return (
    <div className='overflow-hidden motion-reduce:overflow-x-auto'>
      <ul className='flex w-max animate-[marquee_130s_linear_infinite] motion-reduce:animate-none'>
        {photos.map((photo, i) => (
          <li
            key={i}
            // The second copy is only there for the loop.
            aria-hidden={i >= V3_HOUSE_PHOTOS.length || undefined}
            className='relative mr-1 h-[242px] w-[382px] shrink-0 overflow-hidden'
          >
            <Image
              src={photo.src}
              alt={i >= V3_HOUSE_PHOTOS.length ? '' : photo.alt}
              fill
              priority={i < 2}
              sizes='382px'
              className='object-cover'
              style={{ objectPosition: photo.position }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
