'use client';

import { useState } from 'react';
import QuestionHeading from './QuestionHeading';
import OptionButton from './OptionButton';
import OptionGroup from './OptionGroup';
import { COVERAGE_OPTIONS } from '@/lib/estimate';
import type { Coverage } from '@/lib/estimate';

export default function CoverageStep({
  defaultValue = null,
  questionNumber,
  onSelect,
}: {
  defaultValue?: Coverage | null;
  questionNumber: number;
  onSelect: (value: Coverage) => void;
}) {
  const [selected, setSelected] = useState<Coverage | null>(defaultValue);

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

      <OptionGroup label='Lighting coverage'>
        {COVERAGE_OPTIONS.map((option) => (
          <OptionButton
            key={option.value}
            label={option.label}
            selected={selected === option.value}
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </OptionGroup>
    </>
  );
}
