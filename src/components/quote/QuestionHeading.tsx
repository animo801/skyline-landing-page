// Zip, home stories, timeline, contact info. Update if a question is added
// or removed.
const TOTAL_QUESTIONS = 4;

export default function QuestionHeading({
  number,
  children,
}: {
  number: number;
  children: React.ReactNode;
}) {
  return (
    <>
      <p className='mt-4 text-base leading-6 font-bold text-black/50 sm:text-xl sm:leading-7'>
        Question #{number} of {TOTAL_QUESTIONS}
      </p>
      <h1 className='mt-1 text-[32px] leading-[1.15] font-black text-[#111]'>
        {children}
      </h1>
    </>
  );
}
