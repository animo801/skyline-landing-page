export default function ThankYouStep({ firstName }: { firstName: string }) {
  return (
    <div className='mt-10'>
      <h1 className='text-[32px] leading-[1.15] font-black text-[#111]'>
        Thanks{firstName ? `, ${firstName}` : ''}!
      </h1>
      <p className='mt-3 text-lg leading-relaxed text-black/70'>
        In around 10 minutes, our team will call you to discuss options and
        see if we&rsquo;re a good fit.
      </p>
    </div>
  );
}
