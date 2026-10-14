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

// PLACEHOLDER — replace the [bracketed] values with the client's actual
// warranty terms before this page gets real traffic.
export const WARRANTY = {
  heading: 'Backed by our warranty',
  intro: '[Placeholder: one or two sentences on how Skyline stands behind every install.]',
  items: [
    {
      title: '[X]-year product warranty',
      detail: '[Placeholder: what’s covered on the lights, controller and power supply.]',
    },
    {
      title: '[X]-year workmanship guarantee',
      detail: '[Placeholder: what’s covered on the installation itself.]',
    },
    {
      title: '[Service promise]',
      detail: '[Placeholder: e.g. how quickly the team responds to a service call.]',
    },
  ],
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
