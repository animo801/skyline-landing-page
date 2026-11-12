import type { Icon } from '@phosphor-icons/react';
import {
  CalendarStar,
  Coins,
  HouseLine,
  Ladder,
  Lightbulb,
  Package,
  Receipt,
  ShieldCheck,
} from '@phosphor-icons/react/ssr';

// Content for the /v3 landing page.

// The hero's auto-scrolling strip of installs: 5 different Skyline homes.
// `position` is the CSS object-position used to crop each photo to the
// strip's wide frame, keeping the lit roofline in view.
export const V3_HOUSE_PHOTOS: { src: string; alt: string; position: string }[] =
  [
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
export const V3_APP_VIDEO: {
  src: string;
  type: string;
  poster: string;
} | null = {
  src: '/videos/app-bg.mp4',
  type: 'video/mp4',
  poster: '/videos/app-bg-poster.webp',
};

// "8 reasons" grid. `size` matches each label's font size in the design;
// `icon` is a Phosphor icon (phosphoricons.com), drawn in the bold weight.
export const V3_REASONS: { label: string; size: 19 | 20; icon: Icon }[] = [
  { label: '#1: No more install bills', size: 19, icon: Receipt },
  { label: '#2: Use them for other seasons', size: 19, icon: CalendarStar },
  { label: '#3: Use them as accent lights', size: 19, icon: HouseLine },
  { label: '#4: No storage fees', size: 20, icon: Coins },
  { label: '#5: Lifetime warranty', size: 20, icon: ShieldCheck },
  { label: '#6: No more falling off roofs', size: 20, icon: Ladder },
  { label: '#7: Brighter lights', size: 20, icon: Lightbulb },
  { label: '#8: No storing lights', size: 20, icon: Package },
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

// Skyline's reviews on Google (opens the business's review panel).
export const GOOGLE_REVIEWS_URL =
  'https://www.google.com/search?q=skyline+smart+lighting#lrd=0x8e37e8bcce7aadcd:0x62b3de17bebcb14c,1,,,,';

// Real Google reviews for the /v3 review cards, copied word for word from
// Skyline's Google Business profile (only the reviewer names are
// capitalized). Paragraph breaks are kept as blank lines. Each reviewer's
// Google profile photo is saved in public/images/reviews/v3/, named after
// them. /v2 keeps its own shorter list in reviews.ts.
export const V3_REVIEWS: { name: string; text: string }[] = [
  {
    name: 'Kristopher Phagan',
    text: 'Skyline was phenomenal from start to finish! Shane and Dan love what they do, and it shows. They were meticulous, creative, and incredibly easy to work with. Our house looks absolutely incredible! Holiday settings, game day set up, parties, and everyday accent lighting. We love it and highly recommend Skyline!',
  },
  {
    name: 'April Smith',
    text: 'I couldn’t be happier with the permanent lighting installation at my home this past Monday!\n\nShane kept me well informed about his ETA, and when he arrived, he was warm, professional, and incredibly patient as I asked all the questions that magically popped into my head the moment he showed up! He took his time, paid attention to the details, and made sure the job was done right the first time.\n\nI waited for these lights like a kid on Christmas morning—and mind you, Christmas is my favorite holiday! The finished product did not disappoint. The lights look absolutely amazing! Last night, my wife and I literally sat in the truck playing around with all the different presets and enjoying the various lighting options. We were like two kids with a brand-new toy!\n\nA big thank-you to Martin for responding so quickly to my initial inquiry, coming out to provide a quote, and taking the time to understand exactly what I wanted and needed. Your responsiveness and customer service made the entire process seamless.\n\nAnd a HUGE thank-you to Shane for being a true expert at his craft. Your patience, professionalism, attention to detail, and pride in your work did not go unnoticed.\n\nNow I’m sitting here thinking, “What can I have them do next?” That should tell you everything you need to know about my experience!\n\nWhat really sets this company apart is that you don’t feel like just another customer. You feel like you’ve gained new family members. That kind of service is rare these days, and it deserves to be recognized.\n\nIf you’re considering permanent lighting for your home, I highly recommend this company without hesitation! You won’t just get a great installation—you’ll get a team that genuinely cares about its customers and takes pride in delivering quality work.\n\nThank you, Martin and Shane, for an outstanding experience. You’ve definitely earned a customer for life! 🙌🏽',
  },
  {
    name: 'Tom Kuhn',
    text: 'Clean install and the app is easy to use. They really went the extra mile to color match the house correctly. Best in the business! The installer had years of experience and it was obvious in his work!',
  },
  {
    name: 'Jane Baum',
    text: 'This company is highly professional and delivers exactly what is promised! Martin was enthusiastic and helped us decide that permanent lighting was definitely the way to go. Shane did the installation and worked diligently to ensure the lights were simply perfectly placed. He provided a tutorial to the lighting app which is really easy to use. He also helped us customize some settings for the future. I would choose Skyline Smart Lighting again, no doubt!',
  },
  {
    name: 'Staci Cox',
    text: 'We recently had Skyline Smart Lighting install permanent holiday / accent lighting on our home, and we couldn’t be happier with how it turned out. From start to finish, their team was incredibly responsive. They showed up on time for the appointment, which made the entire experience smooth and stress-free.\n\nWe are beyond happy with the final results and the quality of the install. The lights look phenomenal, everything works flawlessly with the app technology. Highly recommend Skyline Smart Lighting to anyone considering permanent lighting!',
  },
  {
    name: 'Lamonte Pennington',
    text: 'My family is beyond happy with Skyline Smart lighting. We have had the lighting system for almost 2 years now and we absolutely love it. Shane and Martin have been so helpful even though I haven’t really had any problems. When I had a question these guys responded quickly and acted accordingly. If you are looking to upgrade the exterior of your home then Skyline Smart lighting is the company that will help you reach that goal.',
  },
  {
    name: 'Shannon Kelso',
    text: 'Incredible experience with Skyline Smart Lighting, everyone I interacted with was terrific. They provide exceptional customer service, ensure questions are answered and stayed late to make sure I knew all the options for the lights. I highly recommend using this trustworthy company.',
  },
  {
    name: 'Corbin Baum',
    text: 'If you’re interested in getting permanent lighting for your home, I highly recommend Skyline Smart Lighting! They were wonderful! They were fair, professional, on-time and their love of the product was truly evident.\n\nWe absolutely love the look of our new home as it’s been augmented by these gorgeous lights! Thanks Shane for a wonderful installation!',
  },
  {
    name: 'Quynh Nhu Pham',
    text: "I couldn't be happier with the work done by Skyline Smart Lighting. From start to finish, the entire process was super efficient and professional. The project only took 3 days - I called for appointment, Martin came the next day to give a quote, then Shane came the day after to install. Both patiently answered my many questions and explained how the app works. Shane left the workspace spotless and took the time to ensure I knew exactly how to use the app, as well as helped me set up some custom accents before he left. The new lighting completely transformed my house. I love it! If you are looking for high quality, professionalism, competitive price, and amazing customer service, look no further. I highly recommend Skyline Smart Lighting and will definitely use them again in the future!",
  },
  {
    name: 'Bernard Townsend',
    text: 'We are very happy that we chose Skyline to handle our installation. Shane was very professional and friendly. He explained how things would work and how it would look. We are VERY PLEASED with the outcome. We would recommend them to anyone, including our neighbors.',
  },
  {
    name: 'Lindsey Trumm',
    text: 'Shane and Martin did a great job with our lighting installation and design! We are so excited to have this permanent lighting on our home and my husband loves programming it.',
  },
  {
    name: 'Chris Marzec',
    text: 'Shane and Martin were excellent to work with. Very friendly, knowledgeable, and customer focused! The system and app that comes with the lights is awesome and easy to use as well. Highly recommend',
  },
];
