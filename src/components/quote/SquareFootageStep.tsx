'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import QuestionHeading from './QuestionHeading';
import { isValidSquareFeet, SQUARE_FEET_MAX, SQUARE_FEET_MIN } from '@/lib/estimate';

// Digits only, shown with thousands separators as they type ("2,400").
function formatSquareFeet(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 5);
  return digits ? Number(digits).toLocaleString('en-US') : '';
}

export default function SquareFootageStep({
  defaultValue = null,
  questionNumber,
  onComplete,
}: {
  defaultValue?: number | null;
  questionNumber: number;
  onComplete: (squareFeet: number) => void;
}) {
  const [value, setValue] = useState(() =>
    defaultValue ? defaultValue.toLocaleString('en-US') : ''
  );
  const [touched, setTouched] = useState(false);

  const squareFeet = Number(value.replace(/\D/g, ''));
  const isValid = isValidSquareFeet(squareFeet);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (isValid) onComplete(squareFeet);
  };

  return (
    <>
      <QuestionHeading
        number={questionNumber}
        hint='Your best guess is fine — it’s on your listing or tax record'
      >
        About how many square feet is your home?
      </QuestionHeading>

      <form
        onSubmit={handleSubmit}
        noValidate
        className='mt-6 flex flex-col gap-4'
      >
        <div>
          <label htmlFor='squareFeet' className='sr-only'>
            Square feet
          </label>
          <div className='relative'>
            <input
              id='squareFeet'
              name='squareFeet'
              type='text'
              inputMode='numeric'
              autoComplete='off'
              placeholder='e.g. 2,400'
              value={value}
              onChange={(event) => setValue(formatSquareFeet(event.target.value))}
              aria-invalid={touched && !isValid}
              aria-describedby={touched && !isValid ? 'sqft-error' : undefined}
              className='h-14 w-full rounded-lg bg-[#f0f0f0] px-4 pr-16 text-lg font-bold text-[#111] outline-none placeholder:font-normal placeholder:text-black/40 focus:ring-2 focus:ring-skyline-blue'
            />
            <span className='pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-base font-bold text-black/40'>
              sq ft
            </span>
          </div>
          {touched && !isValid && (
            <p id='sqft-error' className='mt-1 text-sm text-red-600'>
              Enter a size between {SQUARE_FEET_MIN.toLocaleString('en-US')}{' '}
              and {SQUARE_FEET_MAX.toLocaleString('en-US')} sq ft.
            </p>
          )}
        </div>

        <button
          type='submit'
          className='h-14 w-full bg-skyline-blue text-base font-bold text-white transition-colors hover:bg-skyline-blue/90'
        >
          Continue
        </button>
      </form>
    </>
  );
}
