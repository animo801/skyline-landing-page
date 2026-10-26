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
import type { RoofLights } from './shared';

// Single-story modern-farmhouse ranch, modeled in feet: a front-gabled
// garage wing on the left, a middle section set back 3 ft with a low
// side-gabled roof and a small dormer over the entry, and a front-gabled
// wing with a large window on the right.
const P = makeProjection({ scale: 4.25, originX: 24, groundY: 242 });

// The house's outline within the drawing, for cropping it tightly.
export const RANCH_CROP = '0 94 420 158';

const EAVE = 10; // wall height everywhere
const DEPTH = 40; // front to back
const OVERHANG = 0.7; // roof past the side walls

type Wing = { x1: number; x2: number; ridgeX: number; ridgeY: number };
const LEFT: Wing = { x1: 0, x2: 22, ridgeX: 11, ridgeY: 19 };
const RIGHT: Wing = { x1: 42, x2: 64, ridgeX: 53, ridgeY: 19 };
const MID = { x1: 22, x2: 42, frontZ: 3, ridgeZ: 12, ridgeY: 16.5 };
const DORMER = { x1: 29, x2: 35, eaveY: 13, peakY: 15.2 };

// The middle roof's back slope runs down to the back wall.
const MID_BACK_Z = DEPTH;

// Depth at which the middle roof's front slope reaches height y.
const midRoofZ = (y: number) =>
  MID.frontZ + ((y - EAVE) * (MID.ridgeZ - MID.frontZ)) / (MID.ridgeY - EAVE);
// Where a wing's inner roof slope reaches height y, starting from the wall
// at edgeX (the valleys where the middle roof meets the wings).
const valleyX = (wing: Wing, edgeX: number, y: number) =>
  edgeX + ((y - EAVE) / (wing.ridgeY - EAVE)) * (wing.ridgeX - edgeX);
// Height of a wing's front gable at x.
const gableY = (wing: Wing, x: number) =>
  EAVE +
  (wing.ridgeY - EAVE) *
    (1 - Math.abs(x - wing.ridgeX) / (wing.ridgeX - wing.x1));

const VALLEY_LEFT = valleyX(LEFT, MID.x1, MID.ridgeY);
const VALLEY_RIGHT = valleyX(RIGHT, MID.x2, MID.ridgeY);

// Lights on the roof trim, in install order.
export const RANCH_LIGHTS: RoofLights = {
  front: [
    ...P.lightsAlong([0.3, 10.4, 0], [11, 19.6, 0], 7),
    ...P.lightsAlong([11, 19.6, 0], [21.7, 10.4, 0], 7).slice(1),
    ...P.lightsAlong([23, 10.1, 3], [28.4, 10.1, 3], 3),
    ...P.lightsAlong([28.8, 13, 3], [32, 15.5, 3], 3),
    ...P.lightsAlong([32, 15.5, 3], [35.2, 13, 3], 3).slice(1),
    ...P.lightsAlong([35.6, 10.1, 3], [41, 10.1, 3], 3),
    ...P.lightsAlong([42.3, 10.4, 0], [53, 19.6, 0], 7),
    ...P.lightsAlong([53, 19.6, 0], [63.7, 10.4, 0], 7).slice(1),
  ],
  // The back rooflines: the left wing's back gable where it shows, the
  // middle roof's back eave, and the right wing's back gable.
  back: [
    ...P.lightsAlong([11, 19.4, DEPTH], [21.4, 10.9, DEPTH], 7),
    ...P.lightsAlong([23, 10.1, DEPTH], [36.5, 10.1, DEPTH], 5),
    ...P.lightsAlong([53, 19.4, DEPTH], [64.6, 9.6, DEPTH], 8),
  ],
  // Along the right side's eave, front to back.
  side: P.lightsAlong(
    [64 + OVERHANG, 9.6, 3],
    [64 + OVERHANG, 9.6, DEPTH - 1],
    9,
  ),
};

function FrontGable({ wing }: { wing: Wing }) {
  return (
    <path
      d={P.path([
        [wing.x1, 0, 0],
        [wing.x2, 0, 0],
        [wing.x2, EAVE, 0],
        [wing.ridgeX, wing.ridgeY, 0],
        [wing.x1, EAVE, 0],
      ])}
      fill='#ffffff'
      {...ink}
    />
  );
}

function RakeTrim({ wing }: { wing: Wing }) {
  return (
    <Trim
      d={P.path(
        [
          [wing.x1 - 0.4, EAVE - 0.3, 0],
          [wing.ridgeX, wing.ridgeY + 0.5, 0],
          [wing.x2 + 0.4, EAVE - 0.3, 0],
        ],
        true,
      )}
    />
  );
}

// Board-and-batten lines on a gable, from `fromY` up to just under the roof.
function Battens({
  wing,
  xs,
  fromY,
}: {
  wing: Wing;
  xs: number[];
  fromY: number;
}) {
  return (
    <path
      d={P.lines(
        ...xs.map((x) => [
          [x, fromY, 0] as const,
          [x, gableY(wing, x) - 0.7, 0] as const,
        ]),
      )}
      fill='none'
      {...faint}
    />
  );
}

export function RanchHouse({ showLadder }: { showLadder: boolean }) {
  const [, frontY] = P.at([0, 0, 0]);
  const top = snowTop(frontY, P.at([64, 0, 0]), P.at([64, 0, DEPTH]));

  return (
    <g>
      <Snow top={top} />

      {/* Left wing's right roof slope, partly behind the middle roof */}
      <path
        d={P.path([
          [LEFT.ridgeX, LEFT.ridgeY, 0],
          [LEFT.x2 + OVERHANG, EAVE - 0.6, 0],
          [LEFT.x2 + OVERHANG, EAVE - 0.6, DEPTH],
          [LEFT.ridgeX, LEFT.ridgeY, DEPTH],
        ])}
        fill={SHADE}
        {...ink}
      />
      {/* Left wing's short side wall, where the middle is set back */}
      <path d={P.side(LEFT.x2, 0, MID.frontZ, 0, EAVE)} fill={PLANE} {...ink} />

      {/* Middle roof's back slope, seen over the ridge, with its back eave */}
      <path
        d={P.path([
          [VALLEY_LEFT, MID.ridgeY, MID.ridgeZ],
          [VALLEY_RIGHT, MID.ridgeY, MID.ridgeZ],
          [MID.x2, EAVE, MID_BACK_Z],
          [MID.x1, EAVE, MID_BACK_Z],
        ])}
        fill={SHADE}
        {...ink}
      />
      <Trim
        d={P.lines([
          [MID.x1, EAVE, MID_BACK_Z],
          [MID.x2, EAVE, MID_BACK_Z],
        ])}
        width={2.4}
      />

      {/* Middle roof (front slope, meeting the wings in valleys) */}
      <path
        d={P.path([
          [MID.x1, EAVE, MID.frontZ],
          [MID.x2, EAVE, MID.frontZ],
          [VALLEY_RIGHT, MID.ridgeY, MID.ridgeZ],
          [VALLEY_LEFT, MID.ridgeY, MID.ridgeZ],
        ])}
        fill={SHADE}
        {...ink}
      />
      <path
        d={P.lines(
          ...[11.8, 13.4, 15].map((y) => [
            [valleyX(LEFT, MID.x1, y), y, midRoofZ(y)] as const,
            [valleyX(RIGHT, MID.x2, y), y, midRoofZ(y)] as const,
          ]),
        )}
        fill='none'
        stroke='#ffffff'
        strokeWidth={1.4}
        strokeLinecap='round'
        opacity={0.7}
      />

      {/* Middle wall: single garage door and the front door */}
      <path
        d={P.front(MID.frontZ, MID.x1, MID.x2, 0, EAVE)}
        fill='#ffffff'
        {...ink}
      />
      <path
        d={P.front(MID.frontZ, 23.3, 31.4, 0, 7.4)}
        fill='#ffffff'
        {...ink}
      />
      <path
        d={P.front(MID.frontZ, 23.9, 30.8, 6.1, 6.8)}
        fill={PLANE}
        {...ink}
        strokeWidth={1.3}
      />
      <path
        d={P.lines(
          [
            [26.2, 6.1, 3],
            [26.2, 6.8, 3],
          ],
          [
            [28.5, 6.1, 3],
            [28.5, 6.8, 3],
          ],
          [
            [23.3, 2.5, 3],
            [31.4, 2.5, 3],
          ],
          [
            [23.3, 4.5, 3],
            [31.4, 4.5, 3],
          ],
        )}
        fill='none'
        {...ink}
        strokeWidth={1.1}
      />
      <path d={P.front(MID.frontZ, 34.6, 38.6, 0, 7.6)} fill={PLANE} {...ink} />
      <circle
        cx={P.at([38, 3.6, 3])[0]}
        cy={P.at([38, 3.6, 3])[1]}
        r={1.3}
        fill={INK}
      />
      <path
        d={P.front(MID.frontZ, 32.7, 33.5, 6.4, 7.8)}
        fill='#ffffff'
        {...ink}
        strokeWidth={1.3}
      />

      {/* Dormer over the entry */}
      <path
        d={P.path([
          [DORMER.x2, EAVE, MID.frontZ],
          [DORMER.x2, DORMER.eaveY, MID.frontZ],
          [DORMER.x2, DORMER.eaveY, midRoofZ(DORMER.eaveY)],
        ])}
        fill={PLANE}
        {...ink}
      />
      <path
        d={P.path([
          [32, DORMER.peakY, MID.frontZ],
          [DORMER.x2 + 0.4, DORMER.eaveY - 0.3, MID.frontZ],
          [DORMER.x2 + 0.4, DORMER.eaveY - 0.3, midRoofZ(DORMER.eaveY - 0.3)],
          [32, DORMER.peakY, midRoofZ(DORMER.peakY)],
        ])}
        fill={SHADE}
        {...ink}
      />
      <path
        d={P.path([
          [DORMER.x1, EAVE, MID.frontZ],
          [DORMER.x2, EAVE, MID.frontZ],
          [DORMER.x2, DORMER.eaveY, MID.frontZ],
          [32, DORMER.peakY, MID.frontZ],
          [DORMER.x1, DORMER.eaveY, MID.frontZ],
        ])}
        fill='#ffffff'
        {...ink}
      />
      <path
        d={P.front(MID.frontZ, 31.1, 32.9, 10.7, 12.7)}
        fill={PLANE}
        {...ink}
        strokeWidth={1.4}
      />
      <path
        d={P.lines(
          [
            [32, 10.7, 3],
            [32, 12.7, 3],
          ],
          [
            [31.1, 11.7, 3],
            [32.9, 11.7, 3],
          ],
        )}
        fill='none'
        {...ink}
        strokeWidth={1.1}
      />
      <Trim
        d={P.path(
          [
            [DORMER.x1 - 0.3, DORMER.eaveY - 0.2, MID.frontZ],
            [32, DORMER.peakY + 0.3, MID.frontZ],
            [DORMER.x2 + 0.3, DORMER.eaveY - 0.2, MID.frontZ],
          ],
          true,
        )}
        width={2.4}
      />
      <Trim
        d={P.lines(
          [
            [MID.x1, EAVE, MID.frontZ],
            [DORMER.x1, EAVE, MID.frontZ],
          ],
          [
            [DORMER.x2, EAVE, MID.frontZ],
            [MID.x2, EAVE, MID.frontZ],
          ],
        )}
        width={2.4}
      />

      {/* Left wing: double garage door under the front gable */}
      <FrontGable wing={LEFT} />
      <Battens wing={LEFT} xs={[2, 5, 8, 14, 17, 20]} fromY={7.9} />
      <path d={P.front(0, 3, 19, 0, 7.4)} fill='#ffffff' {...ink} />
      <path
        d={P.front(0, 3.6, 18.4, 6.1, 6.8)}
        fill={PLANE}
        {...ink}
        strokeWidth={1.3}
      />
      <path
        d={P.lines(
          ...[6.1, 8.6, 11, 13.4, 15.9].map((x) => [
            [x, 6.1, 0] as const,
            [x, 6.8, 0] as const,
          ]),
          [
            [3, 2.5, 0],
            [19, 2.5, 0],
          ],
          [
            [3, 4.6, 0],
            [19, 4.6, 0],
          ],
        )}
        fill='none'
        {...ink}
        strokeWidth={1.1}
      />
      <path
        d={P.front(0, 10.1, 11.9, 12.4, 15)}
        fill={PLANE}
        {...ink}
        strokeWidth={1.4}
      />
      <path
        d={P.front(0, 1.1, 1.9, 6.5, 7.9)}
        fill='#ffffff'
        {...ink}
        strokeWidth={1.3}
      />
      <path
        d={P.front(0, 20.1, 20.9, 6.5, 7.9)}
        fill='#ffffff'
        {...ink}
        strokeWidth={1.3}
      />
      <RakeTrim wing={LEFT} />

      {/* Right wing: its long side wall and roof slope, then the front */}
      <path d={P.side(RIGHT.x2, 0, DEPTH, 0, EAVE)} fill={PLANE} {...ink} />
      <path d={P.side(RIGHT.x2, 14, 27, 3, 7.6)} fill='#ffffff' {...ink} />
      <path
        d={P.lines([
          [RIGHT.x2, 3, 20.5],
          [RIGHT.x2, 7.6, 20.5],
        ])}
        fill='none'
        {...ink}
        strokeWidth={1.4}
      />
      <path
        d={P.lines([
          [RIGHT.x2, 3.8, 16],
          [RIGHT.x2, 6.9, 19],
        ])}
        fill='none'
        stroke={GLINT}
        strokeWidth={2.4}
        strokeLinecap='round'
      />
      <path
        d={P.path([
          [RIGHT.ridgeX, RIGHT.ridgeY, 0],
          [RIGHT.x2 + OVERHANG, EAVE - 0.6, 0],
          [RIGHT.x2 + OVERHANG, EAVE - 0.6, DEPTH],
          [RIGHT.ridgeX, RIGHT.ridgeY, DEPTH],
        ])}
        fill={SHADE}
        {...ink}
      />
      <Trim
        d={P.path(
          [
            [RIGHT.x2 + OVERHANG, EAVE - 0.6, 0],
            [RIGHT.x2 + OVERHANG, EAVE - 0.6, DEPTH],
            [RIGHT.ridgeX, RIGHT.ridgeY, DEPTH],
          ],
          true,
        )}
        width={2.4}
      />
      <FrontGable wing={RIGHT} />
      <Battens wing={RIGHT} xs={[44, 62]} fromY={0.4} />
      <Battens wing={RIGHT} xs={[47.5, 50.2, 55.8, 58.5]} fromY={9.2} />
      <path d={P.front(0, 45.5, 60.5, 2.6, 8.6)} fill={PLANE} {...ink} />
      <path
        d={P.lines([
          [53, 2.6, 0],
          [53, 8.6, 0],
        ])}
        fill='none'
        {...ink}
        strokeWidth={1.6}
      />
      <path
        d={P.lines(
          [
            [47, 3.4, 0],
            [49.5, 7.8, 0],
          ],
          [
            [54.5, 3.4, 0],
            [57, 7.8, 0],
          ],
        )}
        fill='none'
        stroke={GLINT}
        strokeWidth={3}
        strokeLinecap='round'
      />
      <RakeTrim wing={RIGHT} />

      {/* Shrubs under the big window */}
      {[46, 52.5, 59].map((x) => {
        const [cx, cy] = P.at([x, 0, -1.2]);
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
              [-3.2, 0, -3],
              [0.1, 10.3, -0.3],
            ],
            [
              [-1, 0, -3],
              [2.3, 10.3, -0.3],
            ],
            ...[0.12, 0.27, 0.42, 0.57, 0.72, 0.87].map((t) => [
              [-3.2 + 3.3 * t, 10.3 * t, -3 + 2.7 * t] as const,
              [-1 + 3.3 * t, 10.3 * t, -3 + 2.7 * t] as const,
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
