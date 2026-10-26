'use client';

import { useEffect, useState } from 'react';

// Illustration palette, in the soft line-art style: charcoal ink, light grey
// planes, and pale background scenery.
const INK = '#3f3f46';
const PLANE = '#ececf0';
const SHADE = '#dedee4';
const FAINT_LINE = '#e0e0e6';
const GLINT = '#d6d6dc';

// When the illustration has faded in and the first light comes on.
const LIGHTS_START_SECONDS = 0.7;

// Evenly spaced points along a straight line, endpoints included.
function pointsAlong(
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
  count: number
) {
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : i / (count - 1);
    return { x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t };
  });
}

// Lights go on in install order along the roof trim: up the front gable,
// down the other side, then back along the side eave.
const LIGHTS = [
  ...pointsAlong([58, 147], [128, 72], 9),
  ...pointsAlong([132, 72], [202, 147], 9),
  ...pointsAlong([212, 147], [286, 128], 8),
];
const LIGHT_STEP_SECONDS = 0.1;
const LIGHT_COLORS = ['#ffbf2e', '#ffbf2e', '#ffd978'];

// Original illustration of a house mid-install (viewBox 0 0 360 270).
function HouseIllustration() {
  const ink = {
    stroke: INK,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <g>

      {/* A snowy hill, in place of a ground line. Drawn first so its outline
          runs behind the house, which sits on top of it. Level under the
          front of the house, rising along the side wall to follow the
          house's perspective, then rolling off to the right. The white
          fill and the inked top edge are separate shapes so only the hill's
          outline is stroked. */}
      <path d='M0 257 C14 252 28 250 44 250 C110 250 160 250 190 249 C226 246 258 235 290 237 C318 239 340 246 360 252 V270 H0 Z' fill='#ffffff' />
      <path d='M0 257 C14 252 28 250 44 250 C110 250 160 250 190 249 C226 246 258 235 290 237 C318 239 340 246 360 252' fill='none' {...ink} />
      {/* Soft shading along the slope */}
      <path
        d='M100 257 H170 M236 249 C256 245 274 244 292 246'
        fill='none'
        stroke={GLINT}
        strokeWidth={2}
        strokeLinecap='round'
      />

      {/* Side roof plane and side wall, receding to the right */}
      <path d='M190 146 L272 130 V238 L190 252 Z' fill={PLANE} {...ink} />
      <path d='M128 70 L214 52 L292 127 L204 150 Z' fill={SHADE} {...ink} />
      <path d='M204 150 L292 127' fill='none' {...ink} strokeWidth={3.5} />

      {/* Front gable wall */}
      <path d='M70 252 V143 L130 85 L190 143 V252 Z' fill='#ffffff' {...ink} />
      {/* Siding lines */}
      <g fill='none' stroke={FAINT_LINE} strokeWidth={1.5} strokeLinecap='round'>
        <path d='M80 165 H112 M150 162 H180 M78 230 H86 M128 236 H180' />
        <path d='M84 150 H104 M156 150 H176 M136 172 H148' />
      </g>
      {/* Front roof trim (fascia band) */}
      <path
        d='M56 150 L130 70 L204 150 L196 154 L130 83 L64 154 Z'
        fill={PLANE}
        {...ink}
      />

      {/* Arched attic window */}
      <path d='M115 136 V121 a15 15 0 0 1 30 0 V136 Z' fill={PLANE} {...ink} />
      <path d='M130 106 V136 M115 124 H145' fill='none' {...ink} strokeWidth={1.6} />
      <path d='M121 132 L134 110' fill='none' stroke={GLINT} strokeWidth={3} strokeLinecap='round' />

      {/* Door with a holiday wreath, and the front step */}
      <path d='M86 244 V188 H118 V244' fill={PLANE} {...ink} />
      <circle cx={102} cy={205} r={7} fill='none' {...ink} strokeWidth={3.2} />
      <circle cx={102} cy={198} r={1.6} fill={INK} />
      <circle cx={96.5} cy={209} r={1.6} fill={INK} />
      <circle cx={107.5} cy={209} r={1.6} fill={INK} />
      <circle cx={113} cy={222} r={1.6} fill={INK} />
      <path d='M80 252 V244 H124 V252' fill='#ffffff' {...ink} />

      {/* Front window with flower box */}
      <path d='M142 206 V186 a11 11 0 0 1 22 0 V206 Z' fill={PLANE} {...ink} />
      <path d='M146 202 L156 182' fill='none' stroke={GLINT} strokeWidth={3} strokeLinecap='round' />
      <path
        d='M139 206 H167 V214 a4 4 0 0 1 -4 4 H143 a4 4 0 0 1 -4 -4 Z'
        fill='#ffffff'
        {...ink}
      />
      <path
        d='M142 206 a4 4 0 0 1 7 -3 a4 4 0 0 1 8 0 a4 4 0 0 1 7 3'
        fill='#ffffff'
        {...ink}
        strokeWidth={1.6}
      />

      {/* Side window (in perspective) */}
      <path d='M212 168 L252 161 V208 L212 216 Z' fill='#ffffff' {...ink} />
      <path d='M232 164.5 V212 M212 192 L252 184.5' fill='none' {...ink} strokeWidth={1.6} />
      <path d='M218 206 L230 172' fill='none' stroke={GLINT} strokeWidth={3} strokeLinecap='round' />

      {/* Bushes */}
      <path
        d='M124 252 a7 7 0 0 1 4 -12 a8 8 0 0 1 14 -2 a7 7 0 0 1 10 8 a5 5 0 0 1 0 6 Z'
        fill='#ffffff'
        {...ink}
      />
      <path
        d='M178 252 a6 6 0 0 1 6 -11 a7 7 0 0 1 12 3 a6 6 0 0 1 2 8 Z'
        fill='#ffffff'
        {...ink}
      />

      {/* Ladder leaning against the front gable, where the install starts */}
      <g fill='none' {...ink} strokeWidth={1.8}>
        <path d='M50 254 L72 126 M64 254 L86 128' />
        <path d='M52.8 236 L66.8 236 M55.6 220 L69.6 220 M58.4 204 L72.4 204 M61.2 188 L75.2 188 M64 172 L78 172 M66.8 156 L80.8 156 M69.6 140 L83.6 140' />
      </g>

    </g>
  );
}

/**
 * Shown while a quote is being submitted: an illustrated house fades in,
 * then lights come on one by one along the roof trim (as if being
 * installed from the ladder) and keep twinkling, with status text that
 * steps through `messages`. With reduced motion, everything appears at once.
 */
export default function LoadingStep({ messages }: { messages: string[] }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return;
    const id = window.setInterval(
      () => setMessageIndex((i) => Math.min(i + 1, messages.length - 1)),
      1300
    );
    return () => window.clearInterval(id);
  }, [messages.length]);

  return (
    <div
      role='status'
      aria-live='polite'
      className='flex flex-col items-center py-10 text-center'
    >
      <svg
        viewBox='0 0 360 270'
        className='w-full max-w-sm overflow-visible'
        aria-hidden='true'
      >
        <defs>
          <filter id='light-glow' x='-200%' y='-200%' width='500%' height='500%'>
            <feGaussianBlur stdDeviation='2.6' result='blur' />
            <feMerge>
              <feMergeNode in='blur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        <g className='motion-safe:[animation:loading-text_0.5s_ease-out_both]'>
          <HouseIllustration />
        </g>

        {LIGHTS.map((light, i) => {
          const delay = LIGHTS_START_SECONDS + i * LIGHT_STEP_SECONDS;
          return (
            <circle
              key={i}
              cx={light.x}
              cy={light.y}
              r={3.6}
              fill={LIGHT_COLORS[i % LIGHT_COLORS.length]}
              filter='url(#light-glow)'
              className='motion-reduce:[animation:none!important]'
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                animation: `light-on 0.35s ease-out ${delay}s both, light-twinkle ${
                  1.4 + (i % 4) * 0.3
                }s ease-in-out ${delay + 0.35 + (i % 5) * 0.15}s infinite`,
              }}
            />
          );
        })}
      </svg>

      <p
        key={messageIndex}
        className='mt-8 text-xl leading-none font-black text-[#111] motion-safe:[animation:loading-text_0.3s_ease-out]'
      >
        {messages[messageIndex]}
      </p>
      <p className='mt-1 text-sm text-black/50'>This only takes a moment.</p>
    </div>
  );
}
