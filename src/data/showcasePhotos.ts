// Real Skyline install photos for the rotating showcase on /v2, each with
// the lighting style it shows. Files live in public/images/showcase/.
// `position` is the CSS object-position used when the photo is cropped to
// the showcase's 3:2 frame — tall photos need it to keep the house in view.
export const SHOWCASE_PHOTOS: {
  src: string;
  label: string;
  alt: string;
  position?: string;
}[] = [
  {
    src: '/images/showcase/christmas.webp',
    label: 'Christmas',
    alt: 'Stone home with red and green permanent Christmas lights along every roofline',
    position: 'center 40%',
  },
  {
    src: '/images/showcase/everyday-accent.webp',
    label: 'Everyday Accent',
    alt: 'Brick two-story home with warm white accent lights under each gable',
  },
  {
    src: '/images/showcase/fourth-of-july.webp',
    label: 'Fourth of July',
    alt: 'Brick home lit red, white and blue along the roofline',
  },
  {
    src: '/images/showcase/holiday.webp',
    label: 'Holiday',
    alt: 'Colonial home with red and white holiday lighting and lit reindeer in the yard',
    position: 'center 21%',
  },
  {
    src: '/images/showcase/valentines-day.webp',
    label: 'Valentine’s Day',
    alt: 'Brick home glowing pink and purple along the roofline in the snow',
  },
  {
    src: '/images/showcase/warm-white.webp',
    label: 'Warm White',
    alt: 'White farmhouse outlined in warm white permanent lights',
    position: 'center 24%',
  },
];
