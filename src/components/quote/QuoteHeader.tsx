import Image from 'next/image';
import Link from 'next/link';

export default function QuoteHeader({ progressPercent }: { progressPercent: number }) {
  return (
    <>
      <Link href='/' className='block w-35 sm:w-40'>
        <Image
          src='/images/skyline-logo-dark.svg'
          alt='Skyline Smart Lighting'
          width={178.53}
          height={47.64}
          className='h-auto w-full'
          priority
        />
      </Link>

      <div
        className='mt-[50px] h-1 w-full rounded-full bg-[#d9d9d9]'
        role='progressbar'
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label='Quote form progress'
      >
        <div
          className='h-full rounded-full bg-skyline-blue transition-[width]'
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </>
  );
}
