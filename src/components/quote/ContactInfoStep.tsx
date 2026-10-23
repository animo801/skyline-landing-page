'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import QuestionHeading from './QuestionHeading';
import { isZipInServiceArea } from '@/data/serviceAreaZipCodes';

export type ContactInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: ServiceState;
  // Pre-filled from the zip question; editable here in case of a typo.
  zip: string;
};

// The service area covers North and South Carolina.
export const SERVICE_STATES = ['NC', 'SC'] as const;
export type ServiceState = (typeof SERVICE_STATES)[number];

// Pre-selects the state from the zip they already entered (29xxx is SC).
function stateForZip(zip: string): ServiceState {
  return zip.startsWith('29') ? 'SC' : 'NC';
}

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

const errorClasses = 'mt-1 text-sm text-red-600';

export default function ContactInfoStep({
  defaultValue,
  zip,
  questionNumber = 4,
  submitLabel = 'Get my free quote',
  onSubmit,
}: {
  defaultValue?: ContactInfo;
  // The zip from the zip question, pre-filled into the address.
  zip: string;
  questionNumber?: number;
  submitLabel?: string;
  onSubmit: (contact: ContactInfo) => Promise<void>;
}) {
  const [firstName, setFirstName] = useState(defaultValue?.firstName ?? '');
  const [lastName, setLastName] = useState(defaultValue?.lastName ?? '');
  const [email, setEmail] = useState(defaultValue?.email ?? '');
  const [phone, setPhone] = useState(() =>
    formatPhoneNumber(defaultValue?.phone ?? '')
  );
  const [street, setStreet] = useState(defaultValue?.street ?? '');
  const [city, setCity] = useState(defaultValue?.city ?? '');
  const [state, setState] = useState<ServiceState>(
    defaultValue?.state ?? stateForZip(zip)
  );
  const [addressZip, setAddressZip] = useState(defaultValue?.zip ?? zip);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const isFirstNameValid = firstName.trim().length > 0;
  const isLastNameValid = lastName.trim().length > 0;
  const isStreetValid = street.trim().length >= 3;
  const isCityValid = city.trim().length > 0;
  const isZipComplete = /^\d{5}$/.test(addressZip);
  const isZipInArea = isZipComplete && isZipInServiceArea(addressZip);
  const isEmailValid = EMAIL_PATTERN.test(email);
  const isPhoneValid = isValidPhone(phone);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);

    if (submitting) return;
    if (
      !isFirstNameValid ||
      !isLastNameValid ||
      !isEmailValid ||
      !isPhoneValid ||
      !isStreetValid ||
      !isCityValid ||
      !isZipInArea
    ) {
      return;
    }

    setSubmitting(true);
    setSubmitError(false);
    try {
      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        state,
        zip: addressZip,
      });
    } catch {
      setSubmitError(true);
      setSubmitting(false);
    }
  };

  return (
    <>
      <QuestionHeading
        number={questionNumber}
        hint='So our team can reach out with your estimate'
      >
        Almost done — how can we reach you?
      </QuestionHeading>

      <form
        onSubmit={handleSubmit}
        noValidate
        className='mt-6 flex flex-col gap-4'
      >
        <div className='grid grid-cols-2 gap-3'>
          <div className='min-w-0'>
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
              <p className={errorClasses}>Enter your first name.</p>
            )}
          </div>
          <div className='min-w-0'>
            <label htmlFor='lastName' className={labelClasses}>
              Last name
            </label>
            <input
              id='lastName'
              type='text'
              autoComplete='family-name'
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className={inputClasses}
            />
            {touched && !isLastNameValid && (
              <p className={errorClasses}>Enter your last name.</p>
            )}
          </div>
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
            <p className={errorClasses}>
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
            <p className={errorClasses}>
              Enter a valid phone number.
            </p>
          )}
        </div>

        <div>
          <label htmlFor='street' className={labelClasses}>
            Street address
          </label>
          <input
            id='street'
            type='text'
            autoComplete='address-line1'
            value={street}
            onChange={(event) => setStreet(event.target.value)}
            className={inputClasses}
          />
          {touched && !isStreetValid && (
            <p className={errorClasses}>Enter your street address.</p>
          )}
        </div>

        <div>
          <label htmlFor='city' className={labelClasses}>
            City
          </label>
          <input
            id='city'
            type='text'
            autoComplete='address-level2'
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className={inputClasses}
          />
          {touched && !isCityValid && (
            <p className={errorClasses}>Enter your city.</p>
          )}
        </div>

        <div className='grid grid-cols-[auto_1fr] gap-3'>
          <div>
            <label htmlFor='state' className={labelClasses}>
              State
            </label>
            <div className='relative'>
              <select
                id='state'
                autoComplete='address-level1'
                value={state}
                onChange={(event) =>
                  setState(event.target.value as ServiceState)
                }
                className={`${inputClasses} w-24 appearance-none pr-9`}
              >
                {SERVICE_STATES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden='true'
                viewBox='0 0 20 20'
                className='pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-black/50'
              >
                <path
                  d='M5 8l5 5 5-5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                />
              </svg>
            </div>
          </div>
          <div className='min-w-0'>
            <label htmlFor='addressZip' className={labelClasses}>
              Zip code
            </label>
            <input
              id='addressZip'
              type='text'
              inputMode='numeric'
              autoComplete='postal-code'
              maxLength={10}
              value={addressZip}
              onChange={(event) =>
                setAddressZip(event.target.value.replace(/\D/g, '').slice(0, 5))
              }
              className={inputClasses}
            />
          </div>
        </div>
        {/* Checked as they type, since a corrected zip skips the zip question. */}
        {(touched || isZipComplete) && !isZipInArea && (
          <p className={`${errorClasses} -mt-2`}>
            {isZipComplete
              ? 'That zip is outside our service area (within an hour of Charlotte). Double-check it, or give us a call.'
              : 'Enter your 5-digit zip code.'}
          </p>
        )}

        <button
          type='submit'
          disabled={submitting}
          className='mt-2 h-14 w-full bg-skyline-blue text-base font-bold text-white transition-colors hover:bg-skyline-blue/90 disabled:opacity-70'
        >
          {submitting ? 'Sending…' : submitLabel}
        </button>
        {submitError && (
          <p className='text-sm text-red-600' role='alert'>
            Something went wrong sending your info. Please try again.
          </p>
        )}
      </form>
    </>
  );
}
