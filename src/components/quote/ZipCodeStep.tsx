'use client';

import { useRef, useState } from 'react';
import type { ClipboardEvent, KeyboardEvent } from 'react';
import QuestionHeading from './QuestionHeading';

const ZIP_LENGTH = 5;

export default function ZipCodeStep({
  defaultZip = '',
  onComplete,
}: {
  defaultZip?: string;
  onComplete: (zip: string) => void;
}) {
  const [digits, setDigits] = useState<string[]>(() => {
    const seeded = Array(ZIP_LENGTH).fill('');
    for (let i = 0; i < defaultZip.length && i < ZIP_LENGTH; i += 1) {
      seeded[i] = defaultZip[i];
    }
    return seeded;
  });
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const hasCompleted = useRef(false);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const setDigitAt = (index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const maybeComplete = (allDigits: string[]) => {
    if (hasCompleted.current) return;
    const zip = allDigits.join('');
    if (zip.length === ZIP_LENGTH) {
      hasCompleted.current = true;
      onComplete(zip);
    }
  };

  const handleChange = (index: number, rawValue: string) => {
    // Keep only the digit the user just typed (last char) so retyping over
    // an already-filled box replaces it instead of appending.
    const value = rawValue.replace(/\D/g, '').slice(-1);

    // Compute the next array up front rather than inside the setDigits
    // updater — onComplete may call setState on a parent component, and
    // React forbids updating another component from inside an updater
    // function while this one is still rendering.
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    maybeComplete(next);

    if (value && index < ZIP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      // Current box is already empty: jump back and clear the previous
      // digit ourselves, rather than relying on where the native delete
      // lands after we move focus.
      event.preventDefault();
      setDigitAt(index - 1, '');
      focusInput(index - 1);
    }
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    event.preventDefault();

    const next = [...digits];
    for (let i = 0; i < pasted.length && index + i < ZIP_LENGTH; i += 1) {
      next[index + i] = pasted[i];
    }
    setDigits(next);
    maybeComplete(next);

    focusInput(Math.min(index + pasted.length, ZIP_LENGTH - 1));
  };

  return (
    <>
      <QuestionHeading number={1}>
        What zip code is your home located in?
      </QuestionHeading>

      <div className='mt-6 grid grid-cols-5 gap-3'>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type='text'
            inputMode='numeric'
            pattern='[0-9]*'
            autoComplete='off'
            maxLength={1}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            aria-label={`Zip code digit ${index + 1}`}
            className='h-[66px] w-full rounded-lg bg-[#f0f0f0] text-center text-2xl font-bold text-[#111] outline-none focus:ring-2 focus:ring-skyline-blue'
          />
        ))}
      </div>
    </>
  );
}
