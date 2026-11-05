// Content for the /v3 landing page.

// The hero's auto-scrolling strip of installs: 5 different Skyline homes.
// `position` is the CSS object-position used to crop each photo to the
// strip's wide frame, keeping the lit roofline in view.
export const V3_HOUSE_PHOTOS: { src: string; alt: string; position: string }[] = [
  {
    src: '/images/v3/hero-house.webp',
    alt: 'Stone home with warm white permanent lights along the roofline',
    position: 'center 15.6%',
  },
  {
    src: '/images/showcase/everyday-accent.webp',
    alt: 'Brick two-story home with warm white accent lights under each gable',
    position: 'center 45%',
  },
  {
    src: '/images/showcase/fourth-of-july.webp',
    alt: 'Brick home lit red, white and blue along the roofline',
    position: 'center 45%',
  },
  {
    src: '/images/showcase/holiday.webp',
    alt: 'Colonial home with red and white holiday lighting',
    position: 'center 30%',
  },
  {
    src: '/images/showcase/valentines-day.webp',
    alt: 'Brick home glowing pink and purple along the roofline',
    position: 'center 40%',
  },
];

// Background video for the "Dedicated app" section (someone switching
// presets in the app as the house lights change). Compressed from the
// original 4K clip to 720×1280, 30fps, no audio, so it stays light on
// phones; app-bg-poster.webp is its first frame, shown while it loads.
// Set to null to show the app screenshot instead.
export const V3_APP_VIDEO: { src: string; type: string; poster: string } | null =
  {
    src: '/videos/app-bg.mp4',
    type: 'video/mp4',
    poster: '/videos/app-bg-poster.webp',
  };

// "8 reasons" grid. `size` matches each label's font size in the design.
export const V3_REASONS: { label: string; size: 19 | 20 }[] = [
  { label: '#1: No more install bills', size: 19 },
  { label: '#2: Use them for other seasons', size: 19 },
  { label: '#3: Use them as accent lights', size: 19 },
  { label: '#4: No storage fees', size: 20 },
  { label: '#5: Lifetime warranty', size: 20 },
  { label: '#6: No more falling off roofs', size: 20 },
  { label: '#7: Brighter lights', size: 20 },
  { label: '#8: No storing lights', size: 20 },
];

// The "3 things that make our lights unique" callouts on the photo. Tapping
// a dot opens `detail`. Placeholder wording — have the client confirm it
// matches their product before going live.
export const V3_FEATURES: {
  id: string;
  label: string;
  detail: string;
}[] = [
  {
    id: 'peaks',
    label: 'Lights at the peaks',
    detail:
      'We run lights all the way up into every peak and gable, not just along the gutters, so your whole roofline is outlined the way it looks in our photos.',
  },
  {
    id: 'wires',
    label: 'No visible wires',
    detail:
      'Each light sits in a slim channel along your trim, with the wiring run out of sight. During the day they blend in with your home; at night, all you see is the light.',
  },
  {
    id: 'leds',
    label: 'Highest grade LEDs',
    detail:
      'We use commercial-grade LEDs built for year-round outdoor use: bright, true to color, and able to do warm white or any color you pick in the app.',
  },
];
