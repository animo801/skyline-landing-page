'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { V3_FEATURES } from '@/data/v3Content';

// Positions on the "3 things" photo are in design pixels (402 × 906) and
// turned into percentages so they stay on the house at any width.
const STAGE_W = 402;
const STAGE_H = 906;
const pct = (value: number, of: number) => `${(value / of) * 100}%`;

// Each callout's blue dot (top-left of its 28px ring), from the design.
const DOTS: Record<string, { x: number; y: number }> = {
  peaks: { x: 176, y: 270 },
  wires: { x: 237, y: 473 },
  leds: { x: 112, y: 351 },
};

/**
 * The three callouts on the /v3 "3 things that make our lights unique"
 * photo. Each blue dot pulses to show it can be tapped; tapping a dot (or
 * its label) opens a card under it with more about that feature. The card
 * closes with its ×, a tap anywhere else on the photo, or Escape.
 */
export default function FeatureCallouts() {
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = V3_FEATURES.find((f) => f.id === openId);

  useEffect(() => {
    if (!openId) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openId]);

  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <div className='absolute inset-0'>
      {/* Lights at the peaks / No visible wires: line down-left, label right */}
      {(['peaks', 'wires'] as const).map((id) => {
        const { x, y } = DOTS[id];
        return (
          <div
            key={id}
            className='absolute'
            style={{ left: pct(x, STAGE_W), top: pct(y, STAGE_H) }}
          >
            <div className='absolute top-[20px] left-[-8px] h-[29px] w-[15px]'>
              <div className='absolute inset-[-3.45%_-6.67%]'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=''
                  src='/images/v3/vector12.svg'
                  className='block size-full max-w-none'
                />
              </div>
            </div>
            <Dot />
            <p className='font-v3-condensed absolute top-[-2px] left-[39px] w-[90px] text-[20px] leading-5 font-bold'>
              {V3_FEATURES.find((f) => f.id === id)?.label}
            </p>
          </div>
        );
      })}

      {/* Highest grade LEDs: points down-right, label on the left */}
      <div
        className='absolute'
        style={{
          left: pct(DOTS.leds.x, STAGE_W),
          top: pct(DOTS.leds.y, STAGE_H),
        }}
      >
        <Pulse />
      </div>
      <p
        className='font-v3-condensed absolute w-[90px] text-right text-[20px] leading-5 font-bold'
        style={{ left: pct(11, STAGE_W), top: pct(352, STAGE_H) }}
      >
        Highest grade LEDs
      </p>
      <div
        className='absolute flex h-[60.791px] w-[57.647px] items-center justify-center'
        style={{ left: pct(95, STAGE_W), top: pct(346, STAGE_H) }}
      >
        <div className='flex-none rotate-[-144.85deg] -scale-y-100'>
          <div className='relative h-[49px] w-[36px]'>
            <div className='absolute inset-[0_0_-2.04%_-2.78%]'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=''
                src='/images/v3/group32.svg'
                className='block size-full max-w-none'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tap anywhere else on the photo to close the open card. */}
      {open && (
        <button
          type='button'
          aria-label='Close'
          tabIndex={-1}
          onClick={() => setOpenId(null)}
          className='absolute inset-0 cursor-default'
        />
      )}

      {/* Tap targets covering each dot and its label. */}
      {V3_FEATURES.map((f) => {
        const { x, y } = DOTS[f.id];
        const labelLeft = f.id === 'leds';
        return (
          <button
            key={f.id}
            type='button'
            aria-expanded={openId === f.id}
            aria-controls={`${baseId}-${f.id}`}
            onClick={() => toggle(f.id)}
            className='absolute h-[48px] w-[140px] rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
            style={{
              left: `calc(${pct(x, STAGE_W)} - ${labelLeft ? 106 : 10}px)`,
              top: `calc(${pct(y, STAGE_H)} - 10px)`,
            }}
          >
            <span className='sr-only'>{f.label}: more info</span>
          </button>
        );
      })}

      {open && (
        <div
          id={`${baseId}-${open.id}`}
          role='dialog'
          aria-label={open.label}
          className='absolute inset-x-4 z-10 rounded-xl bg-white p-4 pr-11 text-[#111] shadow-2xl motion-safe:[animation:loading-text_0.2s_ease-out]'
          style={{ top: `calc(${pct(DOTS[open.id].y, STAGE_H)} + 44px)` }}
        >
          {/* Little pointer up to the dot. */}
          <span
            aria-hidden='true'
            className='absolute -top-1.5 size-3 rotate-45 bg-white'
            style={{
              left: `calc(${pct(DOTS[open.id].x + 14, STAGE_W)} - 16px - 6px)`,
            }}
          />
          <p className='font-v3-condensed text-[22px] leading-6 font-black'>
            {open.label}
          </p>
          <p className='mt-1.5 text-[16px] leading-[22px] text-black/75'>
            {open.detail}
          </p>
          <button
            ref={closeRef}
            type='button'
            aria-label='Close'
            onClick={() => setOpenId(null)}
            className='absolute top-2 right-2 flex size-8 items-center justify-center rounded-full text-xl leading-none text-black/50 hover:bg-black/5'
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

// The design's dot (grey ring, blue center) with a pulse behind it.
function Dot() {
  return (
    <>
      <Pulse />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=''
        src='/images/v3/ellipse48.svg'
        width={28}
        height={28}
        className='absolute top-0 left-0 block max-w-none'
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=''
        src='/images/v3/ellipse49.svg'
        width={22}
        height={22}
        className='absolute top-[3px] left-[3px] block max-w-none'
      />
    </>
  );
}

// A ring that swells out from the dot and fades, on repeat.
function Pulse() {
  return (
    <span
      aria-hidden='true'
      className='absolute top-0 left-0 size-[28px] rounded-full bg-skyline-blue motion-safe:animate-ping'
      style={{ opacity: 0.7 }}
    />
  );
}
