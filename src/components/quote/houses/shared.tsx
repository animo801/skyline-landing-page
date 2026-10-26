// Shared palette, drawing pieces and 3D projection for the line-art house
// illustrations. Each house is modeled in feet as walls and roof planes,
// then drawn from one fixed angle (front-right, slightly above) so every
// part of it shares the same perspective.

export const INK = '#3f3f46';
export const PLANE = '#ececf0';
export const SHADE = '#d9d9e0';
export const FAINT_LINE = '#e0e0e6';
export const GLINT = '#d6d6dc';

export const ink = {
  stroke: INK,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const faint = {
  stroke: FAINT_LINE,
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
};

export type LightPoint = { x: number; y: number };

// Where lights sit on each part of a house's roof trim, in install order.
export type RoofLights = Record<'front' | 'back' | 'side', LightPoint[]>;

// Size of the drawing both houses are made for.
export const HOUSE_VIEWBOX = '0 0 420 270';

// A point in feet: x across the front (left to right), y up, z toward the
// back of the house.
export type P3 = readonly [number, number, number];

// The viewing angle: depth recedes up and to the right at 35°, drawn at
// 60% scale, which shows the front, the right side and the roofs at once.
const DEPTH_X = 0.6 * Math.cos((35 * Math.PI) / 180);
const DEPTH_Y = 0.6 * Math.sin((35 * Math.PI) / 180);

const round = (n: number) => Math.round(n * 10) / 10;

export function makeProjection({
  scale,
  originX,
  groundY,
}: {
  // Pixels per foot.
  scale: number;
  // Where x = 0, z = 0 lands on screen, and the ground line under it.
  originX: number;
  groundY: number;
}) {
  const at = ([x, y, z]: P3): [number, number] => [
    round(originX + scale * (x + z * DEPTH_X)),
    round(groundY - scale * (y + z * DEPTH_Y)),
  ];

  // SVG path through the points, closed unless `open`.
  const path = (points: P3[], open = false) =>
    points
      .map((p, i) => {
        const [u, v] = at(p);
        return `${i === 0 ? 'M' : 'L'}${u} ${v}`;
      })
      .join(' ') + (open ? '' : ' Z');

  // Several separate straight lines in one path.
  const lines = (...segments: P3[][]) =>
    segments.map((segment) => path(segment, true)).join(' ');

  // Rectangle on a front-facing wall at depth z.
  const front = (z: number, x1: number, x2: number, y1: number, y2: number) =>
    path([
      [x1, y1, z],
      [x2, y1, z],
      [x2, y2, z],
      [x1, y2, z],
    ]);

  // Rectangle on a right-facing wall at width x.
  const side = (x: number, z1: number, z2: number, y1: number, y2: number) =>
    path([
      [x, y1, z1],
      [x, y1, z2],
      [x, y2, z2],
      [x, y2, z1],
    ]);

  // Evenly spaced lights from a to b, endpoints included.
  const lightsAlong = (a: P3, b: P3, count: number): LightPoint[] =>
    Array.from({ length: count }, (_, i) => {
      const t = count === 1 ? 0 : i / (count - 1);
      const [x, y] = at([
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
      ]);
      return { x, y };
    });

  return { at, path, lines, front, side, lightsAlong };
}

// Roof trim along an edge: a light band with an inked outline.
export function Trim({ d, width = 3 }: { d: string; width?: number }) {
  return (
    <>
      <path
        d={d}
        fill='none'
        stroke={INK}
        strokeWidth={width + 3}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d={d}
        fill='none'
        stroke={PLANE}
        strokeWidth={width}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </>
  );
}

// Snowy ground the house sits on, drawn first so its outline runs behind
// the house. `top` is its upper edge.
export function Snow({ top }: { top: string }) {
  return (
    <>
      <path d={`${top} V270 H0 Z`} fill='#ffffff' />
      <path d={top} fill='none' {...ink} />
    </>
  );
}

// Snow outline: level along the front, then following the base of the
// house's right side back, then easing gently down to the right edge.
export function snowTop(
  frontY: number,
  [cornerX, cornerY]: [number, number],
  [backX, backY]: [number, number],
) {
  return [
    `M0 ${frontY + 5}`,
    `C14 ${frontY + 1} 26 ${frontY} 44 ${frontY}`,
    `L${cornerX} ${cornerY}`,
    `L${backX} ${backY}`,
    `C${backX + 14} ${backY - 1} ${backX + 28} ${backY + 3} 420 ${backY + 10}`,
  ].join(' ');
}
