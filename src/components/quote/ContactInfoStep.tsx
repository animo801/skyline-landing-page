'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import QuestionHeading from './QuestionHeading';

export type ContactInfo = {
  firstName: string;
  email: string;
  phone: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhone(phone: string) {
  return phone.replace(/\D/g, '').length >= 10;
}

// Formats digits as the user types into (xxx) xxx-xxxx, growing the mask
// as more digits come in rather than requiring all 10 up front.
function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);

  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const inputClasses =
  'h-14 w-full rounded-lg bg-[#f0f0f0] px-4 text-lg font-bold text-[#111] outline-none focus:ring-2 focus:ring-skyline-blue';

const labelClasses = 'mb-1 block text-base font-bold text-black/70';

export default function ContactInfoStep({
  defaultValue,
  onSubmit,
}: {
  defaultValue?: ContactInfo;
  onSubmit: (contact: ContactInfo) => void;
}) {
  const [firstName, setFirstName] = useState(defaultValue?.firstName ?? '');
  const [email, setEmail] = useState(defaultValue?.email ?? '');
  const [phone, setPhone] = useState(() =>
    formatPhoneNumber(defaultValue?.phone ?? '')
  );
  const [touched, setTouched] = useState(false);

  const isFirstNameValid = firstName.trim().length > 0;
  const isEmailValid = EMAIL_PATTERN.test(email);
  const isPhoneValid = isValidPhone(phone);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);

    if (!isFirstNameValid || !isEmailValid || !isPhoneValid) return;

    onSubmit({
      firstName: firstName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <>
      <QuestionHeading number={4}>
        Almost done — how can we reach you?
      </QuestionHeading>

      <form
        onSubmit={handleSubmit}
        noValidate
        className='mt-6 flex flex-col gap-4'
      >
        <div>
          <label htmlFor='firstName' className={labelClasses}>
            First name
          </label>
          <input
            id='firstName'
            type='text'
            autoComplete='given-name'
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className={inputClasses}
          />
          {touched && !isFirstNameValid && (
            <p className='mt-1 text-sm text-red-600'>
              Enter your first name.
            </p>
          )}
        </div>

        <div>
          <label htmlFor='email' className={labelClasses}>
            Email address
          </label>
          <input
            id='email'
            type='email'
            autoComplete='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClasses}
          />
          {touched && !isEmailValid && (
            <p className='mt-1 text-sm text-red-600'>
              Enter a valid email address.
            </p>
          )}
        </div>

        <div>
          <label htmlFor='phone' className={labelClasses}>
            Phone number
          </label>
          <input
            id='phone'
            type='tel'
            inputMode='tel'
            autoComplete='tel'
            value={phone}
            onChange={(event) => setPhone(formatPhoneNumber(event.target.value))}
            className={inputClasses}
          />
          {touched && !isPhoneValid && (
            <p className='mt-1 text-sm text-red-600'>
              Enter a valid phone number.
            </p>
          )}
        </div>

        <button
          type='submit'
          className='mt-2 h-14 w-full bg-skyline-navy text-base font-bold text-white transition-colors hover:bg-skyline-navy/90'
        >
          Get my free quote
        </button>
      </form>
    </>
  );
}
