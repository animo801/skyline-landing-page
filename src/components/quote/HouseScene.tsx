'use client';

import { useId } from 'react';
import { RanchHouse, RANCH_CROP, RANCH_LIGHTS } from './houses/RanchHouse';
import {
  TwoStoryHouse,
  TWO_STORY_CROP,
  TWO_STORY_LIGHTS,
} from './houses/TwoStoryHouse';
import { HOUSE_VIEWBOX } from './houses/shared';
import type { LightPoint, RoofLights } from './houses/shared';

export type { LightPoint } from './houses/shared';

// Which house to draw: a single-story ranch or a two-story home, to match
// the visitor's answer to the stories question.
export type HouseModel = 'single' | 'two';

const LIGHT_COLORS = ['#ffbf2e', '#ffbf2e', '#ffd978'];

// A viewBox cropped tightly to the given house, for small thumbnails.
export function houseCrop(model: HouseModel) {
  return model === 'single' ? RANCH_CROP : TWO_STORY_CROP;
}

// Where lights sit on each part of the given house's roof trim.
export function roofLights(model: HouseModel): RoofLights {
  return model === 'single' ? RANCH_LIGHTS : TWO_STORY_LIGHTS;
}

/**
 * The illustrated house (`model`) with lights on the given points. With
 * `animateLights`, the house fades in and the lights come on one at a time
 * starting at `lightsStart` seconds; otherwise they're simply on. Lights
 * twinkle either way (not with reduced motion).
 */
export default function HouseScene({
  model,
  lights,
  showLadder = false,
  animateLights = false,
  lightsStart = 0.7,
  lightStep = 0.1,
  viewBox = HOUSE_VIEWBOX,
  lightRadius = 3.6,
  className,
}: {
  model: HouseModel;
  lights: LightPoint[];
  showLadder?: boolean;
  animateLights?: boolean;
  lightsStart?: number;
  lightStep?: number;
  viewBox?: string;
  // Bigger lights read better when the scene is drawn small.
  lightRadius?: number;
  className?: string;
}) {
  // Each scene on the page needs its own filter id.
  const glowId = `light-glow-${useId().replace(/:/g, '')}`;

  return (
    <svg viewBox={viewBox} className={className} aria-hidden='true'>
      <defs>
        <filter id={glowId} x='-200%' y='-200%' width='500%' height='500%'>
          <feGaussianBlur stdDeviation='2.6' result='blur' />
          <feMerge>
            <feMergeNode in='blur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>

      <g
        className={
          animateLights
            ? 'motion-safe:[animation:loading-text_0.5s_ease-out_both]'
            : undefined
        }
      >
        {model === 'single' ? (
          <RanchHouse showLadder={showLadder} />
        ) : (
          <TwoStoryHouse showLadder={showLadder} />
        )}
      </g>

      {lights.map((light, i) => {
        const delay = animateLights ? lightsStart + i * lightStep : 0;
        const twinkle = `light-twinkle ${1.4 + (i % 4) * 0.3}s ease-in-out ${
          delay + 0.35 + (i % 5) * 0.15
        }s infinite`;
        return (
          <circle
            key={i}
            cx={light.x}
            cy={light.y}
            r={lightRadius}
            fill={LIGHT_COLORS[i % LIGHT_COLORS.length]}
            filter={`url(#${glowId})`}
            className='motion-reduce:[animation:none!important]'
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animation: animateLights
                ? `light-on 0.35s ease-out ${delay}s both, ${twinkle}`
                : twinkle,
            }}
          />
        );
      })}
    </svg>
  );
}
