export default function OutOfAreaStep({ onRetry }: { onRetry: () => void }) {
  return (
    <div className='mt-10'>
      <h1 className='text-[32px] leading-[1.15] font-black text-[#111]'>
        So sorry!
      </h1>
      <p className='mt-3 text-lg leading-relaxed text-black/70'>
        We only operate within an hour of Charlotte, NC. If you think there
        was an error with our website, give us a call and we&rsquo;d be happy
        to help you.
      </p>

      <button
        type='button'
        onClick={onRetry}
        className='mt-8 h-14 w-full bg-skyline-navy text-base font-bold text-white transition-colors hover:bg-skyline-navy/90'
      >
        Try different zip code
      </button>
    </div>
  );
}
