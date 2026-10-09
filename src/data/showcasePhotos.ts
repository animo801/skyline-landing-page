// Install photos for the rotating showcase on /v2, each with the lighting
// style it shows. PLACEHOLDERS: these reuse the hero photos until real
// install photos (ideally at night, one per style) are added to
// public/images/showcase/.
export const SHOWCASE_PHOTOS: { src: string; label: string; alt: string }[] = [
  {
    src: '/images/image.jpg',
    label: 'Holiday',
    alt: 'Home with permanent holiday lighting along the roofline',
  },
  {
    src: '/images/hero-house.jpg',
    label: 'Game Day',
    alt: 'Home lit up in team colors with permanent lights',
  },
  {
    src: '/images/image.jpg',
    label: 'Everyday Accent',
    alt: 'Home with warm white everyday accent lighting',
  },
  {
    src: '/images/hero-house.jpg',
    label: 'Parties',
    alt: 'Home with colorful party lighting along the roofline',
  },
];
