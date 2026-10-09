// Gentle falling snow over the /v2 hero. Flake positions and timings come
// from a fixed formula rather than Math.random so the server and browser
// render identical markup. Hidden for visitors who prefer reduced motion.
const FLAKE_COUNT = 40;

const flakes = Array.from({ length: FLAKE_COUNT }, (_, i) => {
  // Cheap deterministic pseudo-random spread in [0, 1).
  const r = (seed: number) => {
    const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    left: r(1) * 100,
    size: 2 + r(2) * 4,
    duration: 10 + r(3) * 14,
    // Negative delays start each flake partway down, so the hero is
    // already snowing on first paint instead of filling in from the top.
    delay: -r(4) * 24,
    drift: (r(5) - 0.5) * 80,
    opacity: 0.35 + r(6) * 0.5,
  };
});

export default function Snowfall() {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden'
    >
      {flakes.map((flake, i) => (
        <span
          key={i}
          className='absolute top-0 rounded-full bg-white'
          style={
            {
              left: `${flake.left}%`,
              width: flake.size,
              height: flake.size,
              opacity: flake.opacity,
              animation: `snowfall ${flake.duration}s linear ${flake.delay}s infinite`,
              '--drift': `${flake.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
