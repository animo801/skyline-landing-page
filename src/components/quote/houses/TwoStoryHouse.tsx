import {
  faint,
  GLINT,
  INK,
  ink,
  makeProjection,
  PLANE,
  SHADE,
  Snow,
  snowTop,
  Trim,
} from './shared';
import type { P3, RoofLights } from './shared';

// Two-story home, modeled in feet: a two-story center with a front gable,
// a one-story stone wing on the left and a gabled garage wing on the right
// (both stepping 6 ft forward), and a covered porch between them.
const P = makeProjection({ scale: 4.35, originX: 36, groundY: 232 });

const OVERHANG = 0.7; // roof past the side walls

// The house's outline within the drawing, for cropping it tightly.
export const TWO_STORY_CROP = '0 58 420 192';

type Block = {
  x1: number;
  x2: number;
  z1: number;
  z2: number;
  eave: number;
  ridgeX: number;
  ridgeY: number;
};
const CENTER: Block = {
  x1: 18,
  x2: 44,
  z1: 0,
  z2: 32,
  eave: 19,
  ridgeX: 31,
  ridgeY: 27,
};
const LEFT: Block = {
  x1: 0,
  x2: 18,
  z1: -6,
  z2: 24,
  eave: 9,
  ridgeX: 9,
  ridgeY: 16,
};
const GARAGE: Block = {
  x1: 44,
  x2: 66,
  z1: -6,
  z2: 26,
  eave: 9,
  ridgeX: 55,
  ridgeY: 17,
};
const PORCH = { x1: 18, x2: 44, frontZ: -6, wallY: 10.2, eaveY: 8.6 };

// Lights on the roof trim, in install order.
export const TWO_STORY_LIGHTS: RoofLights = {
  front: [
    ...P.lightsAlong([-0.3, 9.1, -6], [9, 16.6, -6], 7),
    ...P.lightsAlong([9, 16.6, -6], [18.3, 9.1, -6], 7).slice(1),
    ...P.lightsAlong([19.2, 8.7, -6], [42.8, 8.7, -6], 7),
    ...P.lightsAlong([17.8, 19.1, 0], [31, 27.6, 0], 7),
    ...P.lightsAlong([31, 27.6, 0], [44.2, 19.1, 0], 7).slice(1),
    ...P.lightsAlong([43.7, 9.1, -6], [55, 17.6, -6], 7),
    ...P.lightsAlong([55, 17.6, -6], [66.3, 9.1, -6], 7).slice(1),
  ],
  // The back gables' rooflines: both slopes of the upper roof, and the
  // garage's.
  back: [
    ...P.lightsAlong([17.4, 18.5, 32], [31, 27.3, 32], 7),
    ...P.lightsAlong([31, 27.3, 32], [44.6, 18.5, 32], 7).slice(1),
    ...P.lightsAlong([55, 17.3, 26], [66.6, 8.5, 26], 7),
  ],
  // Along the side eaves: both sides of the upper story, and the garage.
  side: [
    ...P.lightsAlong([17.3, 18.5, 6], [17.3, 18.5, 31], 5),
    ...P.lightsAlong([44.7, 18.5, 3.5], [44.7, 18.5, 31], 6),
    ...P.lightsAlong([66.7, 8.5, -3], [66.7, 8.5, 25], 7),
  ],
};

// A block's front gable wall, at its front depth.
function FrontGable({ block }: { block: Block }) {
  const z = block.z1;
  return (
    <path
      d={P.path([
        [block.x1, 0, z],
        [block.x2, 0, z],
        [block.x2, block.eave, z],
        [block.ridgeX, block.ridgeY, z],
        [block.x1, block.eave, z],
      ])}
      fill='#ffffff'
      {...ink}
    />
  );
}

// A block's right side wall and right roof slope, with the side eave and
// back roofline trimmed.
function RightSide({ block }: { block: Block }) {
  const eaveX = block.x2 + OVERHANG;
  const eaveY = block.eave - 0.6;
  return (
    <>
      <path
        d={P.side(block.x2, block.z1, block.z2, 0, block.eave)}
        fill={PLANE}
        {...ink}
      />
      <path
        d={P.path([
          [block.ridgeX, block.ridgeY, block.z1],
          [eaveX, eaveY, block.z1],
          [eaveX, eaveY, block.z2],
          [block.ridgeX, block.ridgeY, block.z2],
        ])}
        fill={SHADE}
        {...ink}
      />
      <Trim
        d={P.path(
          [
            [eaveX, eaveY, block.z1],
            [eaveX, eaveY, block.z2],
            [block.ridgeX, block.ridgeY, block.z2],
          ],
          true,
        )}
        width={2.4}
      />
    </>
  );
}

function RakeTrim({ block }: { block: Block }) {
  return (
    <Trim
      d={P.path(
        [
          [block.x1 - 0.4, block.eave - 0.3, block.z1],
          [block.ridgeX, block.ridgeY + 0.5, block.z1],
          [block.x2 + 0.4, block.eave - 0.3, block.z1],
        ],
        true,
      )}
    />
  );
}

// A two-pane window on a front wall at depth z.
function FrontWindow({
  z,
  x1,
  x2,
  y1,
  y2,
}: {
  z: number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}) {
  const mid = (x1 + x2) / 2;
  const w = x2 - x1;
  return (
    <>
      <path d={P.front(z, x1, x2, y1, y2)} fill={PLANE} {...ink} />
      <path
        d={P.lines([
          [mid, y1, z],
          [mid, y2, z],
        ])}
        fill='none'
        {...ink}
        strokeWidth={1.4}
      />
      <path
        d={P.lines(
          [
            [x1 + w * 0.12, y1 + 0.6, z],
            [x1 + w * 0.3, y2 - 0.6, z],
          ],
          [
            [mid + w * 0.12, y1 + 0.6, z],
            [mid + w * 0.3, y2 - 0.6, z],
          ],
        )}
        fill='none'
        stroke={GLINT}
        strokeWidth={2.4}
        strokeLinecap='round'
      />
    </>
  );
}

// Short faint dashes suggesting stone on a front wall at depth z.
function Stone({ z, marks }: { z: number; marks: [number, number][] }) {
  return (
    <path
      d={P.lines(
        ...marks.map(([x, y]) => [[x, y, z] as P3, [x + 1.6, y, z] as P3]),
      )}
      fill='none'
      {...faint}
    />
  );
}

export function TwoStoryHouse({ showLadder }: { showLadder: boolean }) {
  const [, frontY] = P.at([0, 0, GARAGE.z1]);
  const top = snowTop(
    frontY,
    P.at([GARAGE.x2, 0, GARAGE.z1]),
    P.at([GARAGE.x2, 0, GARAGE.z2]),
  );

  return (
    <g>
      <Snow top={top} />

      {/* Left wing's right roof slope, behind the two-story center */}
      <path
        d={P.path([
          [LEFT.ridgeX, LEFT.ridgeY, LEFT.z1],
          [LEFT.x2 + OVERHANG, LEFT.eave - 0.6, LEFT.z1],
          [LEFT.x2 + OVERHANG, LEFT.eave - 0.6, LEFT.z2],
          [LEFT.ridgeX, LEFT.ridgeY, LEFT.z2],
        ])}
        fill={SHADE}
        {...ink}
      />

      {/* Upper roof's left slope, visible from above */}
      <path
        d={P.path([
          [CENTER.ridgeX, CENTER.ridgeY, CENTER.z1],
          [CENTER.ridgeX, CENTER.ridgeY, CENTER.z2],
          [CENTER.x1 - OVERHANG, CENTER.eave - 0.6, CENTER.z2],
          [CENTER.x1 - OVERHANG, CENTER.eave - 0.6, CENTER.z1],
        ])}
        fill={SHADE}
        {...ink}
      />
      <Trim
        d={P.path(
          [
            [CENTER.x1 - OVERHANG, CENTER.eave - 0.6, CENTER.z1],
            [CENTER.x1 - OVERHANG, CENTER.eave - 0.6, CENTER.z2],
            [CENTER.ridgeX, CENTER.ridgeY, CENTER.z2],
          ],
          true,
        )}
        width={2.4}
      />

      {/* Two-story center: right side, then the front */}
      <RightSide block={CENTER} />
      <path d={P.side(CENTER.x2, 8, 14, 12.4, 16.6)} fill='#ffffff' {...ink} />
      <path d={P.side(CENTER.x2, 20, 26, 12.4, 16.6)} fill='#ffffff' {...ink} />
      <FrontGable block={CENTER} />
      <path
        d={P.lines(
          ...[11.4, 12.8, 14.2, 15.6, 17, 18.4].map((y) => [
            [CENTER.x1 + 0.3, y, 0] as P3,
            [CENTER.x2 - 0.3, y, 0] as P3,
          ]),
        )}
        fill='none'
        {...faint}
      />
      <path
        d={P.lines(
          ...[23, 26, 36, 39].map((x) => [
            [x, CENTER.eave + 0.3, 0] as P3,
            [
              x,
              CENTER.eave +
                (CENTER.ridgeY - CENTER.eave) *
                  (1 - Math.abs(x - CENTER.ridgeX) / 13) -
                0.7,
              0,
            ] as P3,
          ]),
        )}
        fill='none'
        {...faint}
      />
      <FrontWindow z={0} x1={27.6} x2={34.4} y1={20.2} y2={24.2} />
      <FrontWindow z={0} x1={20.5} x2={25.5} y1={12.2} y2={16.8} />
      <FrontWindow z={0} x1={36.5} x2={41.5} y1={12.2} y2={16.8} />
      {/* Ground floor behind the porch: door and window */}
      <path d={P.front(0, 20.6, 24, 0, 7.4)} fill={PLANE} {...ink} />
      <circle
        cx={P.at([23.4, 3.6, 0])[0]}
        cy={P.at([23.4, 3.6, 0])[1]}
        r={1.3}
        fill={INK}
      />
      <FrontWindow z={0} x1={28.5} x2={36.5} y1={3.8} y2={7} />
      <RakeTrim block={CENTER} />

      {/* Left wing's short side wall along the porch */}
      <path
        d={P.side(LEFT.x2, LEFT.z1, 0, 0, LEFT.eave)}
        fill={PLANE}
        {...ink}
      />

      {/* Covered porch: roof, posts and railing */}
      <path
        d={P.path([
          [PORCH.x1, PORCH.wallY, 0],
          [PORCH.x2, PORCH.wallY, 0],
          [PORCH.x2, PORCH.eaveY, PORCH.frontZ],
          [PORCH.x1, PORCH.eaveY, PORCH.frontZ],
        ])}
        fill={SHADE}
        {...ink}
      />
      <path
        d={P.lines(
          ...[19, 26, 43].map((x) => [
            [x, 0, PORCH.frontZ] as P3,
            [x, PORCH.eaveY, PORCH.frontZ] as P3,
          ]),
        )}
        fill='none'
        {...ink}
        strokeWidth={3.4}
      />
      <path
        d={P.lines(
          [
            [26, 3.2, PORCH.frontZ],
            [43, 3.2, PORCH.frontZ],
          ],
          [
            [26, 0.7, PORCH.frontZ],
            [43, 0.7, PORCH.frontZ],
          ],
          ...[27.7, 29.4, 31.1, 32.8, 34.5, 36.2, 37.9, 39.6, 41.3].map((x) => [
            [x, 0.7, PORCH.frontZ] as P3,
            [x, 3.2, PORCH.frontZ] as P3,
          ]),
        )}
        fill='none'
        {...ink}
        strokeWidth={1.3}
      />
      <Trim
        d={P.lines([
          [PORCH.x1, PORCH.eaveY, PORCH.frontZ],
          [PORCH.x2, PORCH.eaveY, PORCH.frontZ],
        ])}
        width={2.4}
      />

      {/* Left stone wing with a large window */}
      <FrontGable block={LEFT} />
      <Stone
        z={LEFT.z1}
        marks={[
          [1, 1],
          [15, 1.2],
          [1.5, 8],
          [14.6, 8.2],
          [6, 10],
          [10.8, 11.6],
          [8, 13.4],
          [3.2, 7.9],
        ]}
      />
      <FrontWindow z={LEFT.z1} x1={3} x2={15} y1={2.2} y2={7.2} />
      <RakeTrim block={LEFT} />

      {/* Garage wing: right side, then the front */}
      <RightSide block={GARAGE} />
      <path d={P.side(GARAGE.x2, 6, 13, 3.2, 6.6)} fill='#ffffff' {...ink} />
      <FrontGable block={GARAGE} />
      <Stone
        z={GARAGE.z1}
        marks={[
          [45, 1],
          [63.6, 1.2],
          [45.4, 8],
          [63.2, 8.2],
          [50, 10],
          [58.4, 10.4],
          [52.6, 13.6],
        ]}
      />
      <path d={P.front(GARAGE.z1, 47, 63, 0, 7.3)} fill='#ffffff' {...ink} />
      <path
        d={P.lines(
          [
            [47, 2.4, -6],
            [63, 2.4, -6],
          ],
          [
            [47, 4.8, -6],
            [63, 4.8, -6],
          ],
          ...[51, 55, 59].map((x) => [[x, 0, -6] as P3, [x, 7.3, -6] as P3]),
        )}
        fill='none'
        {...ink}
        strokeWidth={1.1}
      />
      <path
        d={P.front(GARAGE.z1, 54, 56, 10.8, 12.8)}
        fill={PLANE}
        {...ink}
        strokeWidth={1.4}
      />
      <path
        d={P.front(GARAGE.z1, 45.2, 46, 5.6, 7)}
        fill='#ffffff'
        {...ink}
        strokeWidth={1.3}
      />
      <path
        d={P.front(GARAGE.z1, 64, 64.8, 5.6, 7)}
        fill='#ffffff'
        {...ink}
        strokeWidth={1.3}
      />
      <RakeTrim block={GARAGE} />

      {/* Shrubs in front of the stone wing */}
      {[3.5, 14.5].map((x) => {
        const [cx, cy] = P.at([x, 0, -7]);
        return (
          <path
            key={x}
            d={`M${cx - 9} ${cy} a6 6 0 0 1 4 -9 a7 7 0 0 1 11 -1 a6 6 0 0 1 3 10 Z`}
            fill='#ffffff'
            {...ink}
          />
        );
      })}

      {showLadder && (
        <path
          d={P.lines(
            [
              [-3.2, 0, -9],
              [0.1, 9.3, -6.3],
            ],
            [
              [-1, 0, -9],
              [2.3, 9.3, -6.3],
            ],
            ...[0.13, 0.3, 0.47, 0.64, 0.81].map((t) => [
              [-3.2 + 3.3 * t, 9.3 * t, -9 + 2.7 * t] as P3,
              [-1 + 3.3 * t, 9.3 * t, -9 + 2.7 * t] as P3,
            ]),
          )}
          fill='none'
          {...ink}
          strokeWidth={1.8}
        />
      )}
    </g>
  );
}
