'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import QuestionHeading from './QuestionHeading';

const ZIP_LENGTH = 5;

// Keeps the first five digits, so a pasted or autofilled ZIP+4
// ("28202-1234") or stray spaces/letters still produce a clean zip.
function normalizeZip(value: string): string {
  return value.replace(/\D/g, '').slice(0, ZIP_LENGTH);
}

export default function ZipCodeStep({
  defaultZip = '',
  onComplete,
}: {
  defaultZip?: string;
  onComplete: (zip: string) => void;
}) {
  const [zip, setZip] = useState(() => normalizeZip(defaultZip));
  const [touched, setTouched] = useState(false);

  const isValid = zip.length === ZIP_LENGTH;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (isValid) onComplete(zip);
  };

  return (
    <>
      <QuestionHeading number={1}>
        What zip code is your home located in?
      </QuestionHeading>

      <form
        onSubmit={handleSubmit}
        noValidate
        className='mt-6 flex flex-col gap-4'
      >
        <div>
          <label htmlFor='zip' className='sr-only'>
            Zip code
          </label>
          <input
            id='zip'
            name='zip'
            type='text'
            inputMode='numeric'
            autoComplete='postal-code'
            placeholder='Zip code'
            // Room for a ZIP+4 so autofill isn't cut off before we trim it.
            maxLength={10}
            value={zip}
            onChange={(event) => setZip(normalizeZip(event.target.value))}
            aria-invalid={touched && !isValid}
            aria-describedby={touched && !isValid ? 'zip-error' : undefined}
            className='h-14 w-full rounded-lg bg-[#f0f0f0] px-4 text-lg font-bold text-[#111] outline-none placeholder:font-normal placeholder:text-black/40 focus:ring-2 focus:ring-skyline-blue'
          />
          {touched && !isValid && (
            <p id='zip-error' className='mt-1 text-sm text-red-600'>
              Enter your 5-digit zip code.
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
