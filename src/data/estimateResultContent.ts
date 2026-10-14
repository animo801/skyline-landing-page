// Content for the /virtual-quote estimate results screen.

// "What's included" — drawn from what Skyline customers describe in their
// Google reviews. Confirm with the client before adding anything new. Each
// has a supporting photo; none repeat the "home like yours" photos below.
export const WHATS_INCLUDED: {
  title: string;
  detail: string;
  image: { src: string; alt: string; position?: string };
}[] = [
  {
    title: 'Custom lighting design',
    detail: 'Planned around your home’s roofline and the look you want.',
    image: {
      src: '/images/showcase/christmas.webp',
      alt: 'Stone home with a custom red and green roofline design',
      position: 'center 42%',
    },
  },
  {
    title: 'Professional installation',
    detail: 'Our crew installs everything and leaves your workspace clean.',
    image: {
      src: '/images/image.jpg',
      alt: 'Skyline installer in front of a home he just finished lighting',
      position: 'center 55%',
    },
  },
  {
    title: 'Control from your phone',
    detail:
      'Change colors and scenes from the app — we’ll help you set it up before we leave.',
    image: {
      src: '/images/included/app-control.png',
      alt: 'Phone showing the Skyline app’s lighting presets in front of a lit home',
      position: 'center 40%',
    },
  },
  {
    title: 'Lighting for every occasion',
    detail:
      'Holidays, game day, parties, and warm everyday accent lighting from one system.',
    image: {
      src: '/images/showcase/holiday.webp',
      alt: 'Colonial home with holiday lighting and lit reindeer in the yard',
      position: 'center 35%',
    },
  },
];

// Based on the warranty section of Skyline's own website ("lifetime parts
// + labor"; "covers both the components and the labor required to service
// your Skyline installation"). Keep in sync with what they publish there.
export const WARRANTY = {
  heading: 'Lifetime Warranty on all installs',
  detail:
    'Too many lighting companies install and disappear, leaving homeowners on their own when something stops working. Not us. We stand behind every install, covering both the components and the labor to service your Skyline system.',
};
