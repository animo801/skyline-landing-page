export default function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      role='radio'
      aria-checked={selected}
      onClick={onClick}
      className={`min-h-[99px] w-full rounded bg-[#f0f0f0] px-6 py-5 text-center text-lg leading-[1.25] font-black text-[#111] transition-colors outline-none ${
        selected
          ? 'ring-2 ring-skyline-blue'
          : 'hover:bg-[#e8e8e8] focus-visible:ring-2 focus-visible:ring-skyline-blue'
      }`}
    >
      {label}
    </button>
  );
}
