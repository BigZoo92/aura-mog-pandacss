import { hold } from '../choreography/motion/hold'
import { arm, legs, STANCE } from '../choreography/motion/ik'
import { defineTracks, type TrackFrame } from '../choreography/motion/track'

/**
 * Boss-fight movement: staring the boss down, cartoon dodges timed against
 * the utility-class projectiles, and the final aura blast.
 * Dodge peaks line up with projectile arrival times in `battle.config.ts`.
 */
const READY: TrackFrame = {
  ...legs({ pelvis: { y: 1.2 }, L: { x: -3.6 }, R: { x: 3.6 } }),
  ...arm('L', { x: -5.4, y: -4.2, elbow: 'down', hand: 150 }),
  ...arm('R', { x: 5.8, y: -5, elbow: 'down', hand: -150 }),
  torso: 0,
  world: { x: 0, y: 0 },
  body: { sx: 1, sy: 1 },
  head: { r: 6, x: 0.6, y: 0 },
}

export const DODGE_PEAKS = [0.16, 0.355, 0.55, 0.717, 0.88] as const

const pct = (value: number) => Math.round(value * 1000) / 10

export const battleTracks = defineTracks({
  bossStare: {
    summary: 'Turns to face the boss. Unimpressed. Slight bounce.',
    duration: 1000,
    easing: 'inOut',
    frames: {
      0: { ...READY },
      50: { ...legs({ pelvis: { y: 1.6 }, L: { x: -3.6 }, R: { x: 3.6 } }), head: { r: 8, x: 0.6, y: 0.3 } },
      100: { ...READY },
    },
  },
  bossDodge: {
    summary: 'Five cartoon dodges: duck, lean, jump, lean, limbo — each on a projectile.',
    duration: 3600,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: READY,
      // 1 — duck under a high shot
      [pct(DODGE_PEAKS[0] - 0.06)]: READY,
      [pct(DODGE_PEAKS[0])]: {
        ...legs({ pelvis: { y: 4.8 }, L: { x: -4.6, knee: 'out' }, R: { x: 4.6, knee: 'out' } }),
        ...arm('L', { x: -2, y: -12.4, elbow: 'out', hand: 120 }),
        ...arm('R', { x: 2, y: -12.4, elbow: 'out', hand: -120 }),
        body: { sx: 1.08, sy: 0.88 },
        head: { r: 0, x: 0, y: 1.4 },
        ease: 'out',
      },
      [pct(DODGE_PEAKS[0] + 0.07)]: READY,
      // 2 — lean away
      [pct(DODGE_PEAKS[1] - 0.06)]: READY,
      [pct(DODGE_PEAKS[1])]: {
        ...legs({ pelvis: { y: 1.8, x: -1.6, r: -6 }, L: { x: -4.4 }, R: { x: 3.4 } }),
        ...arm('L', { x: -9.6, y: -10, elbow: 'down', hand: 140 }),
        ...arm('R', { x: 3, y: -12, elbow: 'down', hand: -160 }),
        torso: -34,
        head: { r: -18, x: -0.6, y: 0 },
        ease: 'out',
      },
      [pct(DODGE_PEAKS[1] + 0.07)]: READY,
      // 3 — jump over a low shot
      [pct(DODGE_PEAKS[2] - 0.08)]: {
        ...legs({ pelvis: { y: 3 }, L: { x: -3.6 }, R: { x: 3.6 } }),
        body: { sx: 1.08, sy: 0.9 },
        world: { x: 0, y: 0 },
      },
      [pct(DODGE_PEAKS[2])]: {
        ...legs({ pelvis: { y: 0.6 }, L: { x: -2.8, lift: 3.6, toes: 20 }, R: { x: 2.8, lift: 3.6, toes: 20 } }),
        ...arm('L', { x: -8, y: -15, elbow: 'down', hand: 160 }),
        ...arm('R', { x: 8, y: -15, elbow: 'down', hand: -160 }),
        body: { sx: 0.94, sy: 1.08 },
        world: { x: 0, y: -8 },
        shadow: { s: 0.55, o: 0.5 },
        ease: 'in',
      },
      [pct(DODGE_PEAKS[2] + 0.07)]: { ...READY, body: { sx: 1.1, sy: 0.88 }, shadow: { s: 1, o: 1 } },
      [pct(DODGE_PEAKS[2] + 0.1)]: READY,
      // 4 — lean the other way
      [pct(DODGE_PEAKS[3] - 0.05)]: READY,
      [pct(DODGE_PEAKS[3])]: {
        ...legs({ pelvis: { y: 1.8, x: 1.6, r: 6 }, L: { x: -3.4 }, R: { x: 4.4 } }),
        ...arm('L', { x: -3, y: -12, elbow: 'down', hand: 160 }),
        ...arm('R', { x: 9.6, y: -10, elbow: 'down', hand: -140 }),
        torso: 34,
        head: { r: 18, x: 0.6, y: 0 },
        ease: 'out',
      },
      [pct(DODGE_PEAKS[3] + 0.06)]: READY,
      // 5 — "too slow": deep crouch with a dismissive wave
      [pct(DODGE_PEAKS[4] - 0.05)]: READY,
      [pct(DODGE_PEAKS[4])]: {
        ...legs({ pelvis: { y: 4.2 }, L: { x: -4.8, knee: 'out' }, R: { x: 4.8, knee: 'out' } }),
        ...arm('L', { x: -5, y: -1.6, elbow: 'out', hand: -40 }),
        ...arm('R', { x: 9.6, y: -12.6, elbow: 'down', hand: -170 }),
        body: { sx: 1.06, sy: 0.9 },
        head: { r: 10, x: 0.6, y: 1 },
        ease: 'out',
      },
      100: READY,
    },
  },
  auraBlast: {
    summary: 'Gathers aura at the hip, then thrusts both palms at the boss.',
    duration: 1600,
    iterations: 1,
    easing: 'inOut',
    frames: {
      0: READY,
      40: {
        ...legs({ pelvis: { y: 2.4, x: -1, r: -4 }, L: { x: -4.6 }, R: { x: 3.8 } }),
        ...arm('L', { x: -6, y: -3, elbow: 'out', hand: -60 }),
        ...arm('R', { x: -4.6, y: -1.8, elbow: 'out', hand: -40 }),
        torso: -10,
        head: { r: -4, x: 0, y: 0.4 },
        body: { sx: 1.04, sy: 0.96 },
        ease: 'windup',
      },
      55: {
        ...legs({ pelvis: { y: 1.6, x: 1.4, r: 5 }, L: { x: -4.8 }, R: { x: 5.6 } }),
        ...arm('L', { x: 12.6, y: -8.4, elbow: 'down', hand: -90 }),
        ...arm('R', { x: 12.8, y: -6.8, elbow: 'down', hand: -90 }),
        torso: 12,
        head: { r: 8, x: 0.8, y: 0 },
        body: { sx: 0.96, sy: 1.03 },
      },
      100: {
        ...legs({ pelvis: { y: 1.6, x: 1.4, r: 5 }, L: { x: -4.8 }, R: { x: 5.6 } }),
        ...arm('L', { x: 12.4, y: -8.6, elbow: 'down', hand: -90 }),
        ...arm('R', { x: 12.6, y: -7, elbow: 'down', hand: -90 }),
        torso: 12,
        head: { r: 8, x: 0.8, y: 0 },
        body: { sx: 1, sy: 1 },
      },
    },
  },
  victoryBounce: hold('Victory stance, chest out.', { ...legs({ pelvis: { y: 0.5 }, ...STANCE }), torso: 0 }, { duration: 500, tremble: 0.05 }),
})
