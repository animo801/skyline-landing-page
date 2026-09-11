export default function QuestionHeading({
  number,
  children,
}: {
  number: number;
  children: React.ReactNode;
}) {
  return (
    <>
      <p className='mt-4 text-xl leading-7 font-bold text-black/50'>
        Question #{number}
      </p>
      <h1 className='mt-1 text-[32px] leading-[1.15] font-black text-[#111]'>
        {children}
      </h1>
    </>
  );
}
