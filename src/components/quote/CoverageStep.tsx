'use client';

import { useState } from 'react';
import QuestionHeading from './QuestionHeading';
import HouseScene, { houseCrop, roofLights } from './HouseScene';
import type { HouseModel, LightPoint } from './HouseScene';
import type { RoofLights } from './houses/shared';
import { COVERAGE_OPTIONS } from '@/lib/estimate';
import type { Coverage } from '@/lib/estimate';

// What each option lights up in the illustration, plus a short description.
const COVERAGE_VISUALS: Record<
  Coverage,
  { lights: (roof: RoofLights) => LightPoint[]; description: string }
> = {
  front: {
    lights: (roof) => roof.front,
    description: 'The roofline facing the street',
  },
  'front-back': {
    lights: (roof) => [...roof.front, ...roof.back],
    description: 'Front and back rooflines',
  },
  full: {
    lights: (roof) => [...roof.front, ...roof.back, ...roof.side],
    description: 'Every roofline, all the way around',
  },
};

export default function CoverageStep({
  defaultValue = null,
  model,
  questionNumber,
  onSelect,
}: {
  defaultValue?: Coverage | null;
  // Matches the house to their stories answer.
  model: HouseModel;
  questionNumber: number;
  onSelect: (value: Coverage) => void;
}) {
  const [selected, setSelected] = useState<Coverage | null>(defaultValue);

  const roof = roofLights(model);

  const handleSelect = (value: Coverage) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <>
      <QuestionHeading
        number={questionNumber}
        hint='So we can size your estimate'
      >
        Which parts of your home do you want lit?
      </QuestionHeading>

      <div
        role='radiogroup'
        aria-label='Lighting coverage'
        className='mt-6 flex flex-col gap-3'
      >
        {COVERAGE_OPTIONS.map((option) => {
          const visual = COVERAGE_VISUALS[option.value];
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              type='button'
              role='radio'
              aria-checked={isSelected}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center gap-3 rounded-lg bg-[#f0f0f0] p-3 text-left transition-colors outline-none ${
                isSelected
                  ? 'ring-2 ring-skyline-blue'
                  : 'hover:bg-[#e8e8e8] focus-visible:ring-2 focus-visible:ring-skyline-blue'
              }`}
            >
              <span className='shrink-0 rounded-md bg-white p-1'>
                {/* Cropped to the house itself */}
                <HouseScene
                  model={model}
                  lights={visual.lights(roof)}
                  viewBox={houseCrop(model)}
                  lightRadius={5.5}
                  className='h-auto w-40 sm:w-48'
                />
              </span>
              <span className='min-w-0'>
                <span className='block text-lg leading-tight font-black text-[#111]'>
                  {option.label}
                </span>
                <span className='mt-0.5 block text-sm text-black/55'>
                  {visual.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
