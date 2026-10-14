import type { Coverage } from '@/lib/estimate';

// Content for the /virtual-quote estimate results screen.

// "What's included" — drawn from what Skyline customers describe in their
// Google reviews. Confirm with the client before adding anything new.
export const WHATS_INCLUDED: { title: string; detail: string }[] = [
  {
    title: 'Custom lighting design',
    detail: 'Planned around your home’s roofline and the look you want.',
  },
  {
    title: 'Professional installation',
    detail: 'Our crew installs everything and leaves your workspace clean.',
  },
  {
    title: 'Control from your phone',
    detail:
      'Change colors and scenes from the app — we’ll help you set it up before we leave.',
  },
  {
    title: 'Lighting for every occasion',
    detail:
      'Holidays, game day, parties, and warm everyday accent lighting from one system.',
  },
];

// From the warranty section of Skyline's own website. Keep this in sync
// with what they publish there.
export const WARRANTY = {
  term: 'Lifetime',
  coverage: 'Parts + labor warranty',
  heading: 'Permanent means supported.',
  detail:
    'The warranty covers both the components and the labor required to service your Skyline installation.',
};

// A recent install shown as "a home like yours", picked by their answers.
// Uses the showcase photos in public/images/showcase/.
export function examplePhotoFor({
  stories,
  coverage,
}: {
  stories: 'single' | 'two' | null;
  coverage: Coverage | null;
}): { src: string; alt: string; position?: string } {
  if (coverage === 'full') {
    return {
      src: '/images/showcase/warm-white.webp',
      alt: 'Farmhouse outlined in warm white permanent lights along every roofline',
      position: 'center 24%',
    };
  }
  if (stories === 'two') {
    return {
      src: '/images/showcase/everyday-accent.webp',
      alt: 'Two-story brick home with warm white accent lights under each gable',
    };
  }
  return {
    src: '/images/showcase/valentines-day.webp',
    alt: 'Brick home with permanent lights along the front roofline',
  };
}
