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

const inputClasses =
  'h-14 w-full rounded-lg bg-[#f0f0f0] px-4 text-lg font-bold text-[#111] outline-none placeholder:font-normal placeholder:text-black/40 focus:ring-2 focus:ring-skyline-blue';

export default function ContactInfoStep({
  defaultValue,
  onSubmit,
}: {
  defaultValue?: ContactInfo;
  onSubmit: (contact: ContactInfo) => void;
}) {
  const [firstName, setFirstName] = useState(defaultValue?.firstName ?? '');
  const [email, setEmail] = useState(defaultValue?.email ?? '');
  const [phone, setPhone] = useState(defaultValue?.phone ?? '');
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
          <input
            type='text'
            autoComplete='given-name'
            placeholder='First name'
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            aria-label='First name'
            className={inputClasses}
          />
          {touched && !isFirstNameValid && (
            <p className='mt-1 text-sm text-red-600'>
              Enter your first name.
            </p>
          )}
        </div>

        <div>
          <input
            type='email'
            autoComplete='email'
            placeholder='Email address'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-label='Email address'
            className={inputClasses}
          />
          {touched && !isEmailValid && (
            <p className='mt-1 text-sm text-red-600'>
              Enter a valid email address.
            </p>
          )}
        </div>

        <div>
          <input
            type='tel'
            inputMode='tel'
            autoComplete='tel'
            placeholder='Phone number'
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            aria-label='Phone number'
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
          className='mt-2 h-14 w-full bg-skyline-navy text-lg font-bold text-white transition-colors hover:bg-skyline-navy/90'
        >
          Get my free quote
        </button>
      </form>
    </>
  );
}
