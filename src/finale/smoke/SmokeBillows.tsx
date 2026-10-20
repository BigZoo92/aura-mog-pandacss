import type { CSSProperties } from 'react'
import { cx } from '../../../styled-system/css'
import { MASSES, SMOKE_ORIGIN, STREAM, type SmokeMass } from './smoke.config'
import { lump, massBox, puff, timed } from './smoke.styles'

type Vars = CSSProperties & Record<`--${string}`, string>

/** Lumps of a billow, in % of its box: a cartoon cauliflower silhouette. */
const LUMPS = [
  { l: -6, t: 28, s: 52, breathe: 2300, phase: 0 },
  { l: 18, t: -4, s: 60, breathe: 2700, phase: -600 },
  { l: 48, t: 8, s: 54, breathe: 2100, phase: -1300 },
  { l: 66, t: 34, s: 42, breathe: 2500, phase: -300 },
  { l: 12, t: 46, s: 50, breathe: 1900, phase: -900 },
  { l: 40, t: 42, s: 56, breathe: 2600, phase: -1700 },
] as const

/** The exhale: puffs leave the mouth one after another, swell and fan out. */
export function SmokeStream() {
  return (
    <>
      {STREAM.map((p, i) => (
        <span
          key={i}
          className={cx(puff, timed)}
          style={
            {
              left: `${SMOKE_ORIGIN.x - 2}em`,
              top: `${SMOKE_ORIGIN.y - 2}em`,
              '--at': `${p.at}ms`,
              '--dur': `${p.duration}ms`,
              '--dx': `calc(var(--spread) * ${p.dx}em)`,
              '--dy': `${p.dy}em`,
              '--s': `${p.scale}`,
              '--r': `${p.rotate}deg`,
            } as Vars
          }
        />
      ))}
    </>
  )
}

function Billow({ mass, index }: { mass: SmokeMass; index: number }) {
  const height = mass.width * 0.62
  return (
    <div
      className={cx(massBox, timed)}
      style={
        {
          left: `calc(var(--spread) * ${mass.x}em - ${mass.width / 2}em)`,
          top: `${mass.y - height / 2}em`,
          width: `${mass.width}em`,
          height: `${height}em`,
          '--at': `${mass.at}ms`,
          '--dur': `${mass.duration}ms`,
          '--from-x': `calc(${SMOKE_ORIGIN.x}em - var(--spread) * ${mass.x}em)`,
          '--from-y': `${SMOKE_ORIGIN.y - mass.y}em`,
          '--drift-x': `calc(var(--spread) * ${mass.driftX}em)`,
          '--drift-y': `${mass.driftY}em`,
        } as Vars
      }
    >
      {LUMPS.map((l, i) => (
        <span
          key={i}
          className={lump}
          style={
            {
              left: `${l.l}%`,
              top: `${l.t}%`,
              width: `${l.s}%`,
              aspectRatio: '1',
              '--breathe': `${l.breathe + index * 90}ms`,
              '--phase': `${l.phase - index * 210}ms`,
              '--wobble-x': `${((i + index) % 3) * 0.25 - 0.25}em`,
              '--wobble-y': `${-0.2 - (i % 2) * 0.2}em`,
            } as Vars
          }
        />
      ))}
    </div>
  )
}

/** The big masses that fill the stage after the exhale. */
export function SmokeMasses() {
  return (
    <>
      {MASSES.map((mass, i) => (
        <Billow key={i} mass={mass} index={i} />
      ))}
    </>
  )
}
