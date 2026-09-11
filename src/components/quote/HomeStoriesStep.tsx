'use client';

import { useState } from 'react';
import QuestionHeading from './QuestionHeading';
import OptionButton from './OptionButton';

export type HomeStories = 'single' | 'two';

const OPTIONS: { value: HomeStories; label: string }[] = [
  { value: 'single', label: 'Single-story' },
  { value: 'two', label: 'Two-story' },
];

export default function HomeStoriesStep({
  defaultValue = null,
  onSelect,
}: {
  defaultValue?: HomeStories | null;
  onSelect: (value: HomeStories) => void;
}) {
  const [selected, setSelected] = useState<HomeStories | null>(defaultValue);

  const handleSelect = (value: HomeStories) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <>
      <QuestionHeading number={2}>
        How many stories is your home?
      </QuestionHeading>

      <div
        className='mt-8 flex flex-col gap-4'
        role='radiogroup'
        aria-label='Number of stories'
      >
        {OPTIONS.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            selected={selected === option.value}
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </div>
    </>
  );
}
