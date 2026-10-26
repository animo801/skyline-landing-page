'use client';

import { useEffect, useState } from 'react';
import HouseScene, { roofLights } from './HouseScene';
import type { HouseModel } from './HouseScene';

/**
 * Shown while a quote is being submitted: the illustrated house fades in,
 * then lights come on one by one along the roof trim (as if being
 * installed from the ladder) and keep twinkling, with status text that
 * steps through `messages`. With reduced motion, everything appears at once.
 */
export default function LoadingStep({
  messages,
  model,
}: {
  messages: string[];
  // Matches the house to their stories answer.
  model: HouseModel;
}) {
  // Lights go on in install order, starting at the top of the ladder:
  // across the front rooflines, then along the side.
  const lights = roofLights(model);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return;
    const id = window.setInterval(
      () => setMessageIndex((i) => Math.min(i + 1, messages.length - 1)),
      1300,
    );
    return () => window.clearInterval(id);
  }, [messages.length]);

  return (
    <div
      role='status'
      aria-live='polite'
      className='flex flex-col items-center py-10 text-center'
    >
      <HouseScene
        model={model}
        lights={[...lights.front, ...lights.side]}
        showLadder
        animateLights
        className='w-full max-w-sm overflow-visible'
      />

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
