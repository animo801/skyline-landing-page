'use client';

import { useState } from 'react';
import QuestionHeading from './QuestionHeading';
import OptionButton from './OptionButton';

export type Timeline = 'before-month-end' | 'before-dec-15' | 'next-year';

export default function TimelineStep({
  defaultValue = null,
  onSelect,
}: {
  defaultValue?: Timeline | null;
  onSelect: (value: Timeline) => void;
}) {
  const [selected, setSelected] = useState<Timeline | null>(defaultValue);

  // Computed at render time so the option always reflects the current month
  // rather than a hardcoded one.
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

  const options: { value: Timeline; label: string }[] = [
    { value: 'before-month-end', label: `Before the end of ${currentMonth}` },
    { value: 'before-dec-15', label: 'Before December 15th' },
    { value: 'next-year', label: 'Sometime next year' },
  ];

  const handleSelect = (value: Timeline) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <>
      <QuestionHeading number={3}>
        How soon are you hoping to have lights installed?
      </QuestionHeading>

      <div
        className='mt-8 flex flex-col gap-4'
        role='radiogroup'
        aria-label='Desired timeline'
      >
        {options.map((option) => (
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
